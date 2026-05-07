# GManager — Correções de Performance

## Diagnóstico

Analisando o código e os tempos do devtools (560–750ms constantes em todas as requisições), identifiquei **4 problemas**:

1. **`SELECT NOW()` no startup do servidor** — Em serverless, esse código roda a cada cold start e atrasa a inicialização. Pior: ele abre uma conexão que nunca vai ser reutilizada, pois a Vercel descarta o processo logo depois.
2. **Pool com `max: 5` em serverless** — Cada instância cria até 5 conexões. Com múltiplas requisições paralelas (como acontece no carregamento inicial — `auth/me` + várias `tarefas`), você pode estar estourando o limite de 10 do Neon gratuito, causando fila de conexões.
3. **`auth/me` chamado múltiplas vezes** — Vendo no devtools: 2 chamadas para `me` no mesmo carregamento. Dado que os dados do usuário não mudam durante a sessão, isso é desperdício puro.
4. **`tarefas` chamado em duplicata** — Cada endpoint (`tarefas?inicio=...`) aparece duas vezes no devtools. Isso indica que algum `useEffect` ou `useQuery` está sendo instanciado duas vezes, provavelmente por `StrictMode` do React em dev ou re-renders em produção.

---

## Arquivo 1 — `backend/src/database/db.js`

**Problema:** `max: 5` é alto para serverless. Em ambiente serverless, o ideal é `max: 1` por instância — o pooler do Neon já cuida da reutilização de conexões no lado do banco.

```js
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DB_URL,
  max: 1,                        // em serverless, 1 por instância é suficiente
  idleTimeoutMillis: 10000,      // libera conexão ociosa mais rápido
  connectionTimeoutMillis: 10000,
})

module.exports = pool
```

---

## Arquivo 2 — `backend/src/server.js`

**Problema:** `pool.query('SELECT NOW()')` antes de `app.listen()` é desnecessário em serverless. A Vercel não usa `listen()` — ela importa o `app` diretamente. Esse código roda a cada cold start e desperdiça uma conexão.

```js
const app = require('./app')

// Remova completamente o bloco pool.query('SELECT NOW()').
// Em serverless (Vercel), app.listen() não é chamado.
// A Vercel importa o handler diretamente. Se quiser manter
// compatibilidade local, faça assim:

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}

module.exports = app
```

---

## Arquivo 3 — Keep-alive endpoint (novo arquivo)

Crie `backend/src/routes/keepalive.js` e registre a rota no seu `app.js`.
O objetivo é evitar que o Neon hiberne durante períodos de inatividade.

```js
// backend/src/routes/keepalive.js
const express = require('express')
const router = express.Router()
const pool = require('../database/db')

router.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
})

module.exports = router
```

No seu `app.js`, adicione:
```js
const keepaliveRouter = require('./src/routes/keepalive')
app.use('/keepalive', keepaliveRouter)
```

Depois, cadastre esse endpoint no [cron-job.org](https://cron-job.org) (gratuito) apontando para:
```
https://api.mygmanager.com.br/keepalive
```
A cada **4 minutos** — isso impede a hibernação do Neon.

---

## Arquivo 4 — Frontend: instalar React Query

React Query resolve de uma vez os problemas de chamadas duplicadas e requisições repetidas para dados que não mudam.

```bash
cd frontend
npm install @tanstack/react-query
```

---

## Arquivo 5 — `frontend/src/main.jsx`

Envolva o app com o `QueryClientProvider`:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // dados ficam "frescos" por 5 minutos
      retry: 1,                   // tenta 1 vez em caso de erro
    },
  },
})

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

---

## Arquivo 6 — Hook `useMe` (novo arquivo)

Crie `frontend/src/hooks/useMe.js`.
Isso garante que `auth/me` seja chamado **uma única vez por sessão**, com cache de 5 minutos.

```js
import { useQuery } from '@tanstack/react-query'
import api from '../services/api' // ajuste o caminho conforme seu projeto

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
    staleTime: 1000 * 60 * 5,   // 5 minutos — dados do usuário mudam raramente
    gcTime: 1000 * 60 * 30,     // mantém em memória por 30 min mesmo desmontado
  })
}
```

Substitua qualquer `useEffect` + `fetch('/auth/me')` pelo hook:
```jsx
// Antes:
const [user, setUser] = useState(null)
useEffect(() => {
  fetch('/auth/me').then(r => r.json()).then(setUser)
}, [])

// Depois:
const { data: user, isLoading } = useMe()
```

---

## Arquivo 7 — Hook `useTarefas` (novo arquivo)

Crie `frontend/src/hooks/useTarefas.js`.
Isso garante que cada combinação de `inicio`+`fim` seja buscada apenas uma vez, e depois servida do cache.

```js
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useTarefas({ inicio, fim }) {
  return useQuery({
    queryKey: ['tarefas', inicio, fim],
    queryFn: () =>
      api.get('/tarefas', { params: { inicio, fim } }).then(r => r.data),
    staleTime: 1000 * 60 * 2,   // 2 minutos — tarefas mudam com mais frequência
    enabled: Boolean(inicio && fim),
  })
}
```

**Por que isso elimina as duplicatas?**
O React Query usa `queryKey` como chave de cache. Se dois componentes chamarem `useTarefas({ inicio: 'X', fim: 'Y' })` ao mesmo tempo, **apenas uma requisição HTTP é feita** — o segundo componente recebe o resultado do cache instantaneamente.

---

## Arquivo 8 — Invalidação de cache após mutações

Quando o usuário criar/editar/deletar uma tarefa, invalide o cache para que a lista seja recarregada:

```js
import { useQueryClient } from '@tanstack/react-query'

function TarefaForm({ inicio, fim }) {
  const queryClient = useQueryClient()

  async function handleSalvar(dados) {
    await api.post('/tarefas', dados)

    // Invalida todas as queries de tarefas — próxima leitura vai ao banco
    queryClient.invalidateQueries({ queryKey: ['tarefas'] })
  }
}
```

---

## Variáveis de ambiente — corrigir produção

No painel da Vercel, certifique-se que o frontend tem:

```env
VITE_API_URL=https://api.mygmanager.com.br
```

E o backend tem:
```env
FRONTEND_URL=https://mygmanager.com.br
NODE_ENV=production
```

Esses valores estão errados no `.env` que você compartilhou (apontam para localhost).

---

## Configuração Neon — verificar região da Vercel

No painel da Vercel, vá em **Settings → Functions** e verifique em qual região as funções estão rodando. Se estiver em `iad1` (Virginia), mude para `gru1` (São Paulo) — isso reduz a latência de rede entre a função e o banco do Neon (que está em `sa-east-1`).

Para forçar a região, adicione ao `vercel.json` do backend:
```json
{
  "regions": ["gru1"]
}
```

---

## Resumo do impacto esperado

| Problema | Solução | Ganho estimado |
|---|---|---|
| `SELECT NOW()` no startup | Remover | −100–300ms no cold start |
| `max: 5` no pool | Mudar para `max: 1` | Evita fila de conexões |
| `auth/me` duplicado | `useMe` com React Query | −500–600ms por navegação |
| `tarefas` duplicado | `useTarefas` com React Query | −500–700ms por navegação |
| Neon hibernando | Keep-alive a cada 4 min | Elimina spike de 1–2s |
| Vercel em Virginia | Mudar para `gru1` | −80–150ms por requisição |
