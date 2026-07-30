# Portfólio — André Lucas Trevizan

Portfólio e CMS construídos com Next.js, Node.js, Fastify, Prisma e PostgreSQL.

## Desenvolvimento com Docker

Preencha as variáveis privadas em `api/.env` e `web/.env`. O arquivo `dev.env`
contém somente a configuração local dos containers.

```bash
docker compose --env-file dev.env -f docker-compose.dev.yml up -d --build
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:3333`
- Documentação: `http://localhost:3333/docs`

## Produção

1. Copie `.env.example` para `.prod.env` e substitua todos os valores.
2. Crie os diretórios persistentes e instale a credencial do reCAPTCHA:

```bash
sudo install -d -m 0750 /opt/portfolio/uploads /opt/portfolio/google
sudo install -m 0400 recaptcha-auth.json /opt/portfolio/google/recaptcha-auth.json
```

3. Crie a rede compartilhada com o proxy reverso, caso ainda não exista:

```bash
docker network create reverse-proxy
```

4. Suba a aplicação:

```bash
docker compose --env-file .prod.env -f docker-compose.prod.yml up -d --build
```

5. Confira o estado:

```bash
docker compose --env-file .prod.env -f docker-compose.prod.yml ps
docker compose --env-file .prod.env -f docker-compose.prod.yml logs -f api web
```

O PostgreSQL não publica porta em produção. API e frontend ficam acessíveis
somente pela rede externa configurada em `REVERSE_PROXY_NETWORK`.

## Staging

Use uma credencial, banco, domínio e diretório separados em `.staging.env`:

```bash
docker compose --env-file .staging.env -f docker-compose.staging.yml up -d --build
```

O diretório persistente padrão de staging é `/opt/portfolio-staging`.
