# Dockerfile para aplicação Angular
# Estágio 1: Build da aplicação
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para o build)
RUN npm ci

# Copia todo o código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados do estágio anterior (ajustando o caminho)
COPY --from=build /app/dist/front-dijkstra/browser /usr/share/nginx/html

# Copia configuração customizada do Nginx (opcional, mas recomendada)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]