configurar .enc seguindo o .env-example
b fallback de porta para 3000 e expires para 1d
f fallback para http://localhost:3000

cd backend
npm install nodemon validator resend cookie-parser helmet
npm run dev

cd frontend
npm install
npm run dev

npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction

# Gerenciador de Tarefas

Aplicação full-stack para organização pessoal, com foco em tarefas diárias, visão semanal e calendário mensal.

O projeto permite:
- cadastro e login de usuários
- autenticação com JWT
- criação, listagem, conclusão e exclusão de tarefas
- visualização das tarefas do dia no dashboard
- visualização semanal
- calendário mensal com tarefas por data
- página dedicada para cada dia

## Tecnologias utilizadas

### Frontend
- React
- Vite
- React Router
- FullCalendar

### Backend
- Node.js
- Express
- JWT
- PostgreSQL

### Banco de dados
- PostgreSQL
- conexão via `DB_URL`

---

## Estrutura do projeto

```text
backend/
  server.js
  app.js
  package.json
  src/
    controllers/
    database/
    middleswares/
    routes/

frontend/
  package.json
  src/
    api/
    components/
    pages/
    routes/
Pré-requisitos
Antes de rodar o projeto, você precisa ter instalado:

Node.js
npm
PostgreSQL
Git
Instalação do projeto
1. Clonar o repositório
bash

git clone <URL_DO_REPOSITORIO>
cd PlataformaOrganização
2. Instalar as dependências do backend
bash

cd backend
npm install
3. Instalar as dependências do frontend
bash

cd ../frontend
npm install
Variáveis de ambiente
Backend
Crie um arquivo .env dentro da pasta backend com este conteúdo:

env

DB_URL=sua_string_de_conexao_postgresql
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES=1d
PORT=3000
Exemplo de DB_URL
env

DB_URL=postgresql://usuario:senha@host:5432/nome_do_banco
Observação:

o projeto está configurado para conectar via connectionString
o backend utiliza SSL com rejectUnauthorized: false
isso é comum em bancos hospedados em serviços externos
Como rodar o projeto
Rodar o backend
Na pasta backend:

bash

npm run dev
O servidor será iniciado, por padrão, na porta 3000.

Rodar o frontend
Em outro terminal, na pasta frontend:

bash

npm run dev
O Vite vai mostrar no terminal a URL local, normalmente algo como:

bash

http://localhost:5173
Scripts disponíveis
Backend
bash

npm run dev
Executa o servidor com nodemon.

Frontend
bash

npm run dev
Inicia o ambiente de desenvolvimento com Vite.

bash

npm run build
Gera a versão de produção do frontend.

bash

npm run preview
Executa a build localmente para pré-visualização.

bash

npm run lint
Roda o ESLint no frontend.

Funcionalidades atuais
registro de usuário
login de usuário
autenticação com token JWT
proteção de rotas privadas
criação de tarefas
conclusão de tarefas
exclusão de tarefas
dashboard com tarefas do dia
visão semanal
calendário mensal
página individual por dia
Rotas da aplicação
Frontend
/ → login
/register → cadastro
/dashboard → dashboard principal
/calendario → calendário mensal
/dia/:data → tarefas de um dia específico
Backend
POST /auth/register
POST /auth/login
GET /tarefas?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
POST /tarefas
PUT /tarefas/:id
DELETE /tarefas/:id
PATCH /tarefas/:id/concluir
Estrutura básica do banco
Atualmente o projeto espera algo equivalente às tabelas abaixo.

Tabela usuarios
sql

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha TEXT NOT NULL
);
Tabela tarefas
sql

CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pendente',
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora TIME
);
Fluxo de uso
o usuário cria uma conta
faz login
acessa o dashboard
visualiza as tarefas do dia
acompanha a semana
acessa o calendário mensal
clica em um dia específico
gerencia as tarefas daquele dia
Estado atual do projeto
O projeto está em desenvolvimento e evoluindo com foco em:

melhoria de layout e experiência visual
calendário interativo
organização por dia
notas rápidas
compartilhamento
futuras funcionalidades de produtividade
Melhorias futuras planejadas
cache de consultas por mês no calendário
notas rápidas
compartilhamento de visão do dia
filtros de tarefas
página de perfil
melhoria de responsividade
deploy do frontend e backend
Observações
o backend exige sempre inicio e fim na busca de tarefas
o frontend e o calendário foram adaptados para trabalhar com intervalos de datas
o projeto atualmente não possui migrations automatizadas
a criação das tabelas do banco deve ser feita manualmente
Autor
Projeto desenvolvido como prática de desenvolvimento full-stack e como ferramenta pessoal de organização.



Minha sugestão é você depois adaptar só 4 coisas:
- URL do repositório
- nome final do projeto, se mudar
- seu nome na seção autor
- detalhes do banco, se sua estrutura mudar

Se quiser, no próximo passo eu posso te mandar uma versão ainda mais “profissional”, com:
- badges
- seção de screenshots
- seção “Como contribuir”
- `.env.example`
- organização mais parecida com README de portfólio/projeto real.