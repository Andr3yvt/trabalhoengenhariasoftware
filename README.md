# Andrey Project — Acessibilidade para Todos

> “Sua opinião pode tornar a internet mais acessível.”

Questionário acadêmico (6 a 8 minutos, 25 perguntas) que avalia a acessibilidade e a facilidade de uso de um site, combinado com algumas perguntas pessoais leves e opcionais. Inclui uma área administrativa privada para consultar e exportar as respostas.

## Funcionalidades

- **Abertura** com apresentação do projeto e botão “Começar avaliação”.
- **Identificação opcional** (nome ou apelido) e confirmação obrigatória de participação.
- **25 perguntas**, uma por tela, na sequência definida no projeto: 13 de acessibilidade (obrigatórias), 10 de preferências pessoais e 2 descontraídas (opcionais). Cada tela mostra número, categoria, pergunta, descrição, barra de progresso e os botões “Voltar”, “Próxima pergunta” e “Finalizar”.
  - As respostas ficam preservadas ao navegar e até ao recarregar a aba (rascunho na `sessionStorage` do próprio navegador).
- **Revisão** com opção de editar cada resposta e envio com tratamento de erro (as respostas não se perdem).
- **Agradecimento** com uma seção separada de contato do responsável (WhatsApp 45 98842-8151, botão “Conversar pelo WhatsApp” → `https://wa.me/5545988428151`). Nenhum dado de contato é pedido à participante.
- **Área administrativa** em `/admin` (sem links públicos): login seguro, lista de participações, filtro por data, pesquisa por nome/apelido, leitura completa das respostas (1 a 25, com destaque para as não respondidas) e exportação CSV.
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

Tabela `participations`: `id` (UUID), `nickname` (opcional), `consent`, `status` (`concluido`), `answers` (JSON com `q1`…`q25` → alternativa escolhida ou texto), `questionnaire_version` e `created_at`.

`questionnaire_version` indica a qual conjunto de perguntas as respostas pertencem: `1` = questionário original de 15 perguntas (participações enviadas antes da atualização, preservadas e exibidas com os títulos originais) e `2` = questionário atual de 25 perguntas. No CSV, as respostas da versão atual aparecem nas colunas `P1`…`P25`; se a exportação incluir participações antigas, elas ficam em colunas próprias marcadas com `[v1]`.

## Editar as perguntas

Todas as perguntas ficam em `src/lib/questions.ts`. Se o significado das perguntas mudar no futuro, incremente `CURRENT_VERSION` e mantenha o conjunto anterior para que os registros antigos continuem legíveis.
