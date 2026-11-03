import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import '../styles.css'

const siteName = 'Andrey Project — Acessibilidade para Todos'
const siteDescription =
  'Sua opinião pode tornar a internet mais acessível. Um projeto acadêmico de avaliação de acessibilidade e usabilidade.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { name: 'theme-color', content: '#1E3A5F' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#conteudo"
          className="sr-only-focusable fixed left-4 top-4 z-50 rounded-lg bg-navy px-4 py-2 font-semibold text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
