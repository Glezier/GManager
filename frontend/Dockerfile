# Build da aplicação
FROM node:22-alpine AS builder

# Pasta de trabalho
WORKDIR /app

# Copia os arquivos e dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia restante
COPY . .

# URL do vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build da produção
RUN npm run builder

# Servidor com Nginx
FROM nginx:alpine

# Copia a build gerada para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Porta padrão do nginx
EXPOSE 80

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]