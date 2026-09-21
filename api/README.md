# API do portfólio

A organização segue a API de `abatimentos`, mantendo os casos de uso próprios do portfólio.

- `routers`: endpoints, schemas Zod e autenticação HTTP.
- `controllers`: leitura das requisições, multipart e respostas HTTP.
- `services`: regras de negócio; recebem dependências pelo construtor e dados por `execute(dto)`.
- `contracts`: interfaces de persistência, envio de e-mail e reCAPTCHA.
- `dtos`: entradas tipadas e dados compartilhados entre camadas.
- `entities`: tipos de retorno compostos usados pelos contratos.
- `repositories`: consultas e gravações Prisma, com parâmetros explícitos e cliente injetável.
- `factories`: montagem dos services e implementações concretas.

Dados de requisição não devem ficar em propriedades de controllers, services ou repositories. Uma mesma instância pode atender chamadas simultâneas; todos os valores específicos de cada chamada devem permanecer em parâmetros ou variáveis locais.

Os módulos de educação, experiência e depoimentos têm um arquivo por caso de uso. Os arquivos agregadores preservam os imports existentes das rotas.

O hash de senhas pertence aos services. Cadastro e atualização de contas gravam perfil e função na mesma operação Prisma. A exclusão usa os relacionamentos com `onDelete: Cascade` já definidos no schema. Não há migrações novas nesta refatoração.

As rotas e os envelopes de resposta foram mantidos. A referência antiga a `cnpj_root` foi removida da consulta de contas e do schema de resposta do cadastro porque esse campo não existe no modelo `Account` do portfólio.

Validação, a partir desta pasta:

```sh
pnpm run typecheck
pnpm test
pnpm run build
```

Os testes de services usam dependências em memória, incluindo um cenário de logins simultâneos. Os testes HTTP usam `Fastify.inject` com repositories e e-mail substituídos; não acessam PostgreSQL, SMTP ou reCAPTCHA reais. Para validar essas integrações, execute a aplicação com as variáveis e os serviços do ambiente de desenvolvimento.
