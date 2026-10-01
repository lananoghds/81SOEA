# Dashboard 81ª SOEA — site estático conectado ao Supabase

Arquitetura: **URL pública → este site → Supabase (Auth + REST) → dados atualizados**.
O navegador consulta `https://dknxceugxfraagmjwvda.supabase.co` direto, a cada acesso e ao clicar em "Atualizar dados". Não há dados fixos no código.

## Comandos (não há dependências para instalar)
```bash
npm run typecheck   # verifica o JavaScript (o projeto não usa TypeScript)
SUPABASE_URL=https://dknxceugxfraagmjwvda.supabase.co \
SUPABASE_ANON_KEY=<chave pública> npm run build   # gera dist/index.html
```

## Variáveis de ambiente (as duas são PÚBLICAS)
| Nome | Valor |
|---|---|
| `SUPABASE_URL` | `https://dknxceugxfraagmjwvda.supabase.co` |
| `SUPABASE_ANON_KEY` | `sb_publishable_vbVAb8Ch0TT-QPObOcvu4w_WRFf3R1H` (ou a chave `anon`) |

Nunca use `service_role` / `sb_secret_`: o build recusa essas chaves.

## Publicar no Netlify
1. Envie esta pasta para um repositório no GitHub.
2. Netlify → *Add new site* → *Import from Git*. O `netlify.toml` já define build (`npm run typecheck && npm run build`) e pasta (`dist`).
3. *Site configuration → Environment variables*: crie `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
4. *Deploy*. A URL pública sai no formato `https://<nome>.netlify.app`.

(Alternativa pela linha de comando: `npx netlify-cli deploy --prod --build`.)

## Publicar na Vercel
1. *Add New → Project* → importe o repositório (o `vercel.json` já configura tudo).
2. Em *Environment Variables*, crie as duas variáveis acima.
3. *Deploy* → URL `https://<nome>.vercel.app`.

## Configuração necessária no Supabase
A tabela `mentions` tem RLS ativo e **uma única política de leitura, para usuários logados** (`authenticated`). Por isso o site tem login real (Supabase Auth) e, sem login, o banco devolve zero linhas. Nada no banco foi alterado.
1. **Authentication → Users → Add user**: crie os usuários que vão acessar (e-mail e senha). Ou deixe *Allow new users to sign up* ativo para o botão "Criar conta" funcionar.
2. **Authentication → URL Configuration**: em *Site URL* coloque a URL pública final (e em *Redirect URLs* também), para os e-mails de confirmação apontarem para o site.
3. CORS: nada a configurar (a API do Supabase já aceita chamadas de qualquer domínio).
