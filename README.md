# Portfólio — André Lucas Trevizan

Portfólio e CMS construídos com Next.js, Node.js, Fastify, Prisma e PostgreSQL.

## Variáveis de ambiente

As variáveis ficam centralizadas na raiz do projeto:

```text
.env.development
.env.staging
.env.production
```

Use `.env.example` como referência. Cada arquivo deve apontar para si mesmo:

```env
# .env.development
APP_ENV_FILE=.env.development

# .env.staging
APP_ENV_FILE=.env.staging

# .env.production
APP_ENV_FILE=.env.production
```

Dentro do Docker, a conexão com o banco deve usar o service `portfolio-db`:

```env
DATABASE_URL=postgresql://usuario:senha@portfolio-db:5432/portfolio
```

## Desenvolvimento

Inicializar ou reconstruir os containers:

```bash
docker compose --env-file .env.development -p portfolio-dev -f docker-compose.dev.yml up -d --build
```

Após criar um volume PostgreSQL vazio pela primeira vez, aplique migrations e seed pelo host:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\init-dev-db.ps1
```

Esse passo usa os certificados do Windows para funcionar também em redes corporativas. Não é necessário repeti-lo enquanto o volume `portfolio-dev_postgres_dev_data` for preservado.

Serviços locais:

- Frontend: `http://localhost:3000`
- API: `http://localhost:3333`
- Documentação: `http://localhost:3333/docs`

## Staging

Inicializar ou atualizar staging:

```bash
docker compose --env-file .env.staging -p portfolio-staging -f docker-compose.yml up -d --build
```

Use banco, domínio, credencial do reCAPTCHA e diretório de uploads separados da produção.

## Produção

Crie os diretórios persistentes e instale a credencial do reCAPTCHA:

```bash
sudo install -d -m 0750 /opt/portfolio/uploads /opt/portfolio/google
sudo install -m 0400 recaptcha-auth.json /opt/portfolio/google/recaptcha-auth.json
```

Crie a rede compartilhada com o Nginx, caso ainda não exista:

```bash
docker network create reverse-proxy
```

Inicialize ou atualize a aplicação:

```bash
docker compose --env-file .env.production -p portfolio-prod -f docker-compose.yml up -d --build
```

As migrations do Prisma e o seed administrativo são executados automaticamente durante a inicialização da API.

## Operação dos containers

Substitua o arquivo de ambiente e o nome do projeto conforme o ambiente.

Verificar o estado:

```bash
docker compose --env-file .env.production -p portfolio-prod -f docker-compose.yml ps
```

Acompanhar os logs principais:

```bash
docker compose --env-file .env.production -p portfolio-prod -f docker-compose.yml logs -f portfolio-api portfolio-web
```

Reiniciar os serviços:

```bash
docker compose --env-file .env.production -p portfolio-prod -f docker-compose.yml restart
```

Parar e remover os containers sem apagar banco ou uploads:

```bash
docker compose --env-file .env.production -p portfolio-prod -f docker-compose.yml down
```

> Não use `down -v` em produção: essa opção remove o volume do PostgreSQL.

O PostgreSQL não publica porta em staging ou produção. O Nginx deve acessar os serviços pela rede definida em `REVERSE_PROXY_NETWORK`:

```text
portfolio-web:3000
portfolio-api:3333
```
