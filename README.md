# Task Manager

Aplicação web para gerenciamento de tarefas, desenvolvida com Next.js, TypeScript, tRPC e Prisma. O projeto permite criar, visualizar, editar e excluir tarefas, com validação de dados e feedback visual das operações.

## Tecnologias utilizadas

- **Next.js 16** — Framework React com App Router.
- **React** — Construção da interface.
- **TypeScript** — Tipagem estática.
- **tRPC** — Comunicação tipada entre frontend e backend.
- **TanStack React Query** — Gerenciamento de requisições, cache e atualização dos dados.
- **Prisma ORM** — Modelagem e acesso ao banco de dados.
- **SQLite** — Banco de dados relacional.
- **Zod** — Validação dos dados de entrada.
- **Tailwind CSS** — Estilização da interface.
- **next-themes** — Gerenciamento dos temas claro, escuro e sistema.

## Funcionalidades

- Criar novas tarefas com título e descrição opcional.
- Listar tarefas cadastradas.
- Editar tarefas existentes.
- Excluir tarefas com confirmação.
- Validar campos obrigatórios e limites de caracteres.
- Exibir notificações de sucesso e erro.
- Apresentar estados de carregamento durante as operações.
- Atualizar automaticamente a lista após alterações.
- Carregar inicialmente as tarefas utilizando Server-Side Rendering (SSR) e hidratação.
- Alternar entre os temas claro, escuro e automático (sistema).

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- npm (instalado junto com o Node.js)

## Instalação

Clone o repositório:

```bash
git clone https://github.com/Deadfubs/task-manager-pro-max.git
```

Acesse a pasta do projeto:

```bash
cd task-manager-pro-max
```

Instale as dependências:

```bash
npm install
```

## Configuração do banco de dados

O projeto utiliza SQLite com Prisma ORM.

Crie um arquivo `.env` na raiz do projeto com a seguinte variável:

```env
DATABASE_URL="file:./dev.db"
```

Execute as migrações para criar o banco de dados:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

O arquivo `dev.db` será utilizado como banco de dados local.

## Executando a aplicação

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse a aplicação pelo navegador:

[http://localhost:3000](http://localhost:3000)

## Verificação do código

Para verificar possíveis erros de TypeScript:

```bash
npx tsc --noEmit
```

Para executar a análise estática com ESLint:

```bash
npm run lint
```

## Estrutura do projeto

```text
task-manager-pro-max/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── trpc/
│   │   │       └── [trpc]/
│   │   │           └── route.ts
│   │   ├── confirm-dialog.tsx
│   │   ├── task-edit-form.tsx
│   │   ├── task-form.tsx
│   │   ├── task-list.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── toast.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── generated/
│   │   └── prisma/
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   └── task.ts
│   │   │   ├── root.ts
│   │   │   └── trpc.ts
│   │   └── db.ts
│   └── trpc/
│       ├── client.tsx
│       ├── query-client.ts
│       └── server.tsx
├── .env
├── prisma7.config.ts
├── package.json
└── README.md
```

## Modelo de dados

Cada tarefa possui os seguintes campos:

| Campo