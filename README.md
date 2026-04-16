# 🚀 CodeStart

<br>

<div align="center">
  <p>Plataforma interativa para desenvolvedores iniciantes aprenderem programação através de desafios práticos em JavaScript!</p>
</div>

---

## ✨ Funcionalidades

- **Autenticação com Google**: Login seguro e simplificado via Google OAuth.
- **Desafios Interativos**: Editor de código integrado para resolver problemas de lógica de programação em tempo real.
- **Testes Automatizados**: Validação instantânea do código submetido com base em casos de teste visíveis e ocultos.
- **Ranking Global**: Sistema de pontuações (gamificação) para ranquear os usuários na tabela de liderança.
- **Perfis de Usuário**: Acompanhamento do progresso, histórico de submissões e desafios concluídos.
- **Sistema de Dicas e Explicações**: Dicas para ajudar em casos de dúvida e uma explicação didática detalhada para cada problema ao resolvê-lo com sucesso.

## 🛠 Tecnologias

- **Frontend:** Next.js 16 (App Router) + TypeScript + TailwindCSS v4
- **Backend:** Next.js API Routes & Server Actions
- **Banco de Dados:** PostgreSQL (via Prisma ORM)
- **Autenticação:** NextAuth.js v5 (Google OAuth)
- **Deploy Otimizado:** Vercel

## ⚙️ Como rodar o projeto localmente

Siga os passos abaixo para configurar e executar a plataforma em sua máquina.

### 1. Pré-Requisitos
- [Node.js](https://nodejs.org/en/) (versão 18.17 ou superior)
- Um banco de dados **PostgreSQL** rodando localmente ou na nuvem (ex: Supabase, Neon)
- Uma conta no [Google Cloud Console](https://console.cloud.google.com/) para configurar o login social.

### 2. Configurar Variáveis de Ambiente
Na raiz do projeto, crie o arquivo `.env.local` e configure as seguintes credenciais:

```env
# Banco de dados
# Exemplo local: postgresql://postgres:suasenha@localhost:5432/codestart
DATABASE_URL="sua_string_de_conexao_postgresql"

# NextAuth (gerar com: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta_aqui"

# Google OAuth (necessário para o Login)
AUTH_GOOGLE_ID="seu_client_id_do_google"
AUTH_GOOGLE_SECRET="seu_client_secret_do_google"
```

> **Nota:** Para criar as credenciais do Google, acesse o Console Platform > APIs e Serviços > Credenciais > Criar Credenciais > ID do Cliente OAuth. Configure as origin URI e o URI de redirecionamento para o seu localhost, ex: `http://localhost:3000/api/auth/callback/google`.

### 3. Configurar o Banco de Dados (Prisma)

Após configurar a `DATABASE_URL` corretamente, instale todas as dependências e rode os seguintes comandos para estruturar e popular o banco de dados:

```bash
npm install

# Criar a estrutura das tabelas no banco de dados
npx prisma db push

# Popular o banco com os desafios iniciais (Seed)
npx tsx prisma/seed.ts
```

### 4. Rodar a aplicação

Por fim, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o CodeStart em ação! 🎉

## ☁️ Deploy (Vercel)

A plataforma já está com tudo configurado para ser publicada rapidamente na **Vercel**.

1. Crie um novo projeto na Vercel e importe o seu repositório do GitHub.
2. Na aba de configurações do projeto, adicione todas as **Variáveis de Ambiente** (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`). Lembre-se que em produção, a `NEXTAUTH_URL` deve apontar para o domínio público da sua aplicação.
3. O comando de **Build** já está protegido no nosso `package.json` executando `prisma generate && next build` para garantir que o cliente do Prisma tenha os tipos das tabelas mais recentes em tempo de compilação.
4. Clique em **Deploy**! 

*(Opcional)* Caso você crie o projeto via Vercel e o banco esteja zerado em produção, modifique momentaneamente a string do `DATABASE_URL` _localmente_ para apontar para seu banco de produção Postgres e execute `npx tsx prisma/seed.ts` para subir os problemas diretamente do seu PC ao banco da nuvem.
