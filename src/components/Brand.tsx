export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="#1E3A5F" />
      <circle cx="32" cy="18" r="5" fill="#fff" />
      <path
        d="M18 27h28M32 27v12m0 0-7 12m7-12 7 12"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function SiteHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="border-b border-line/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <p className="text-[1.05rem] font-bold tracking-tight text-navy">Andrey Project</p>
            <p className="text-sm text-muted">Acessibilidade para Todos</p>
          </div>
        </div>
        {right}
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/70 bg-mist">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Andrey Project · Acessibilidade para Todos</p>
        <p>“Sua opinião pode tornar a internet mais acessível.”</p>
      </div>
    </footer>
  )
}
