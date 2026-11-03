import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  AuthError,
  acceptInvite,
  handleAuthCallback,
  login,
  logout,
  requestPasswordRecovery,
  updateUser,
} from '@netlify/identity'
import { SiteHeader } from '@/components/Brand'
import AdminDashboard from '@/components/AdminDashboard'
import { getAdminSession } from '@/lib/admin.functions'

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [{ title: 'Área administrativa — Andrey Project' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  loader: () => getAdminSession(),
  component: AdminPage,
})

type Callback = { type: 'invite'; token: string } | { type: 'recovery' } | null

function AdminPage() {
  const session = Route.useLoaderData()
  const router = useRouter()
  const [callback, setCallback] = useState<Callback>(null)
  const [callbackError, setCallbackError] = useState('')

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const tokens = ['invite_token', 'recovery_token', 'confirmation_token', 'email_change_token', 'access_token']
    if (!tokens.some((t) => hash.has(t))) return
    handleAuthCallback()
      .then(async (result) => {
        window.history.replaceState(null, '', window.location.pathname)
        if (!result) return
        if (result.type === 'invite' && result.token) setCallback({ type: 'invite', token: result.token })
        else if (result.type === 'recovery') setCallback({ type: 'recovery' })
        else await router.invalidate()
      })
      .catch(() => setCallbackError('O link usado é inválido ou expirou. Solicite um novo convite ou redefinição.'))
  }, [router])

  async function signOut() {
    await logout().catch(() => undefined)
    await router.invalidate()
  }

  let content: React.ReactNode
  if (callback) {
    content = (
      <SetPassword
        mode={callback.type}
        onDone={async (password) => {
          if (callback.type === 'invite') await acceptInvite(callback.token, password)
          else await updateUser({ password })
          setCallback(null)
          await router.invalidate()
        }}
      />
    )
  } else if (!session) {
    content = <Login error={callbackError} />
  } else if (!session.isAdmin) {
    content = (
      <Card title="Acesso restrito">
        <p className="leading-relaxed">
          Você entrou como <strong>{session.email}</strong>, mas esta conta não tem permissão para consultar as
          respostas. Somente contas com a função <code className="rounded bg-mist px-1.5">admin</code> podem acessar
          este painel.
        </p>
        <button type="button" className="btn-secondary mt-6" onClick={signOut}>
          Sair
        </button>
      </Card>
    )
  } else {
    content = <AdminDashboard />
  }

  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <SiteHeader
        right={
          session ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">{session.email}</span>
              <button type="button" onClick={signOut} className="btn-secondary px-4 py-2 text-sm">
                Sair
              </button>
            </div>
          ) : (
            <span className="rounded-full bg-sky px-3 py-1 text-xs font-semibold text-navy">Área privada</span>
          )
        }
      />
      <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        {content}
      </main>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-md rounded-3xl border border-line/80 bg-white p-8 shadow-soft">
      <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Login({ error: initialError }: { error: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'pending'>('idle')
  const [error, setError] = useState(initialError)
  const [notice, setNotice] = useState('')
  const [mode, setMode] = useState<'login' | 'recover'>('login')
  const alertRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => setError(initialError), [initialError])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'pending') return
    const fields = new FormData(event.currentTarget)
    const email = String(fields.get('email') ?? '').trim()
    setState('pending')
    setError('')
    setNotice('')
    try {
      if (mode === 'login') {
        await login(email, String(fields.get('password') ?? ''))
        await router.invalidate()
      } else {
        await requestPasswordRecovery(email)
        setNotice('Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.')
      }
    } catch (err) {
      setError(
        err instanceof AuthError && (err.status === 400 || err.status === 401)
          ? 'E-mail ou senha incorretos.'
          : 'Não foi possível concluir agora. Tente novamente em instantes.',
      )
      requestAnimationFrame(() => alertRef.current?.focus())
    } finally {
      setState('idle')
    }
  }

  return (
    <Card title={mode === 'login' ? 'Entrar na área administrativa' : 'Redefinir senha'}>
      <p className="text-muted">
        {mode === 'login'
          ? 'Acesso exclusivo para o responsável pelo projeto.'
          : 'Informe o e-mail da conta administrativa.'}
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-5">
        <fieldset disabled={state === 'pending'} className="grid gap-5">
          <legend className="sr-only">Credenciais</legend>
          <div>
            <label htmlFor="email" className="block font-semibold text-navy">
              E-mail
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className="field mt-2" />
          </div>
          {mode === 'login' && (
            <div>
              <label htmlFor="password" className="block font-semibold text-navy">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="field mt-2"
              />
            </div>
          )}
          <button type="submit" className="btn-primary w-full">
            {state === 'pending' ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Enviar link'}
          </button>
        </fieldset>
        {error && (
          <p ref={alertRef} tabIndex={-1} role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
            <span aria-hidden="true">⚠ </span>
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-mint-ink">
            {notice}
          </p>
        )}
        <button
          type="button"
          className="justify-self-start text-sm font-semibold text-navy underline underline-offset-4"
          onClick={() => {
            setMode(mode === 'login' ? 'recover' : 'login')
            setError('')
            setNotice('')
          }}
        >
          {mode === 'login' ? 'Esqueci minha senha' : 'Voltar para o login'}
        </button>
      </form>
    </Card>
  )
}

function SetPassword({ mode, onDone }: { mode: 'invite' | 'recovery'; onDone: (password: string) => Promise<void> }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const password = String(fields.get('password') ?? '')
    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (password !== String(fields.get('confirm') ?? '')) {
      setError('As senhas não coincidem.')
      return
    }
    setPending(true)
    setError('')
    try {
      await onDone(password)
    } catch {
      setError('Não foi possível salvar a senha. O link pode ter expirado.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Card title={mode === 'invite' ? 'Criar sua senha' : 'Definir nova senha'}>
      <form onSubmit={submit} className="grid gap-5">
        <fieldset disabled={pending} className="grid gap-5">
          <legend className="sr-only">Nova senha</legend>
          <div>
            <label htmlFor="password" className="block font-semibold text-navy">
              Nova senha
            </label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="field mt-2" />
          </div>
          <div>
            <label htmlFor="confirm" className="block font-semibold text-navy">
              Confirmar senha
            </label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className="field mt-2" />
          </div>
          <button type="submit" className="btn-primary w-full">
            {pending ? 'Salvando…' : 'Salvar senha'}
          </button>
        </fieldset>
        {error && (
          <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
            <span aria-hidden="true">⚠ </span>
            {error}
          </p>
        )}
      </form>
    </Card>
  )
}
