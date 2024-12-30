FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY public public
COPY src src
COPY tsconfig.* .
COPY vite.config.ts .

EXPOSE 5173

CMD ["bun", "dev"]
