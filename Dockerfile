# Dockerfile super simples para Railway
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/front-dijkstra/browser /usr/share/nginx/html
COPY <<EOF /etc/nginx/templates/default.conf.template
server {
    listen \${PORT:-80};
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
CMD ["nginx", "-g", "daemon off;"]