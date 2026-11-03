# Andrey Project — Acessibilidade para Todos

> “Sua opinião pode tornar a internet mais acessível.”

Questionário acadêmico (≈ 5 minutos) que avalia a acessibilidade e a facilidade de uso de um site, combinado com algumas perguntas pessoais leves e opcionais. Inclui uma área administrativa privada para consultar e exportar as respostas.

## Funcionalidades

- **Abertura** com apresentação do projeto e botão “Começar avaliação”.
- **Identificação opcional** (nome ou apelido) e confirmação obrigatória de participação.
- **15 perguntas**, uma por tela (7 de múltipla escolha, 8 abertas), com número da pergunta, barra de progresso, “Voltar”, “Próxima pergunta” e “Finalizar”.
  - Perguntas de acessibilidade e de múltipla escolha são obrigatórias; perguntas pessoais abertas são opcionais.
  - As respostas ficam preservadas ao navegar e até ao recarregar a aba (rascunho na `sessionStorage` do próprio navegador).
- **Revisão** com opção de editar cada resposta e envio com tratamento de erro (as respostas não se perdem).
- **Agradecimento** sem exibir as respostas pessoais.
- **Área administrativa** em `/admin` (sem links públicos): login seguro, lista de participações, filtro por data, pesquisa por nome/apelido, leitura completa das respostas e exportação CSV.
- **Acessibilidade**: navegação por teclado, foco visível, link “Pular para o conteúdo”, rótulos em todos os campos, mensagens de erro com texto e ícone (não só cor), anúncio de telas para leitores de tela, contraste AA, layout responsivo e respeito a `prefers-reduced-motion`.

## Tecnologias

- [TanStack Start](https://tanstack.com/start) + React 19 + TypeScript
- Tailwind CSS 4 (paleta do projeto em `src/styles.css`), fonte Inter
- **Netlify Database** (Postgres gerenciado) com Drizzle ORM para armazenar as respostas
- **Netlify Identity** para autenticar o responsável pelo projeto
- Hospedagem e funções serverless na Netlify

## Executar localmente

```bash
pnpm install
netlify dev        # emula banco de dados e Identity localmente
```

`pnpm dev` (Vite puro) também abre o questionário, mas sem banco de dados e sem login, então o envio e o painel não funcionam nesse modo.

Testes: `pnpm test`.

## Publicar

O site é publicado pela Netlify a cada push na branch principal. As migrações do banco (`netlify/database/migrations/`) são aplicadas automaticamente em cada deploy — nenhuma configuração manual de banco é necessária.

## Configurar o acesso administrativo (uma única vez)

As respostas só podem ser lidas por contas com a função `admin`. Para criar a sua:

1. No painel da Netlify, abra **Project configuration → Identity** e, em **Registration**, escolha **Invite only** (recomendado, para que ninguém crie contas por conta própria).
2. Em **Identity → Invite users**, convide o seu e-mail.
3. Abra o link do convite recebido por e-mail e defina uma senha (o site leva você automaticamente para `/admin`).
4. De volta ao painel da Netlify, abra o seu usuário em **Identity**, adicione a função `admin` em **Roles** e salve.
5. Acesse `https://<seu-site>/admin` e faça login.

Contas sem a função `admin` conseguem fazer login, mas não visualizam nenhum dado. Nenhuma senha ou chave fica no código do navegador.

## Estrutura dos dados

Tabela `participations`: `id` (UUID), `nickname` (opcional), `consent`, `status` (`concluido`), `answers` (JSON com `q1`…`q15` → alternativa escolhida ou texto) e `created_at`.
