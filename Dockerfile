FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 4000

CMD ["npm", "start"]


