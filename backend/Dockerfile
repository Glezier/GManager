# Usa imagem base do node 22 
FROM node:22-alpine 

# Definição da pasta de trabalho
WORKDIR /app

# Cópia dos arquivos e dependências
COPY package*.json ./

# Instala dependências
RUN npm ci --omit=dev

# Copia restante dos arquivos
COPY . .

# Define ambiente como produção
ENV NODE_ENV=production

# Porta usada pela API
EXPOSE 3000

# Inicia o servidor
CMD ["node", "server.js"]