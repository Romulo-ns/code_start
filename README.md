# CodeStart 🚀

Plataforma interativa para desenvolvedores iniciantes aprenderem programação através de desafios práticos em JavaScript!

## 🛠 Tecnologias

- **Frontend:** Next.js 16 (App Router) + TypeScript + TailwindCSS v4
- **Backend:** Next.js API Routes / Server Actions
- **Banco de Dados:** PostgreSQL (via Prisma ORM)
- **Autenticação:** NextAuth.js v5 (Google OAuth)

## ⚙️ Como rodar o projeto localmente

Siga os passos abaixo para configurar e executar a plataforma em sua máquina.

### 1. Requisitos Prévios
- [Node.js](https://nodejs.org/en/) (versão 18.17 ou superior)
- Um banco de dados **PostgreSQL** rodando localmente ou na nuvem (ex: Supabase, Neon)
- Uma conta no [Google Cloud Console](https://console.cloud.google.com/) para configurar o login social.

### 2. Configurar Variáveis de Ambiente
Na raiz do projeto, existe um arquivo chamado `.env.local`. Você precisará configurar as seguintes chaves:

\`\`\`env
# Banco de dados
# Exemplo local: postgresql://postgres:suasenha@localhost:5432/codestart
DATABASE_URL="sua_string_de_conexao_postgresql"

# NextAuth (gerar com: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta_aqui"

# Google OAuth (necessário para o Login)
GOOGLE_CLIENT_ID="seu_client_id_do_google"
GOOGLE_CLIENT_SECRET="seu_client_secret_do_google"
\`\`\`

> **Nota:** Para criar as credenciais do Google, acesse o Google Cloud Console > APIs e Serviços > Credenciais > Criar Credenciais > ID do Cliente OAuth. Configure os URIs de redirecionamento para `http://localhost:3000/api/auth/callback/google`.

### 3. Configurar o Banco de Dados (Prisma)

Após configurar a `DATABASE_URL`, rode os seguintes comandos para criar as tabelas e popular o banco com os desafios iniciais:

\`\`\`bash
# Sincronizar o banco de dados
npx prisma db push

# Popular o banco com os desafios iniciais (Seed)
npx tsx prisma/seed.ts
\`\`\`

### 4. Rodar a aplicação

Por fim, inicie o servidor de desenvolvimento:

\`\`\`bash
npm run dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o CodeStart em ação! 🎉
