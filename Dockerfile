FROM node:22.6

WORKDIR /app

COPY . .

CMD ["sh", "docker-command.sh"]