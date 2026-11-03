import { useEffect, useId, useRef, useState } from 'react'
import {
  CATEGORY_LABEL,
  MAX_NICKNAME,
  MAX_OPEN_ANSWER,
  QUESTIONS,
  type Answers,
  type Question,
} from '@/lib/questions'
import { submitParticipation } from '@/lib/survey.functions'
import { SiteFooter, SiteHeader } from './Brand'

type Step =
  | { kind: 'welcome' }
  | { kind: 'identify' }
  | { kind: 'question'; index: number; fromReview?: boolean }
  | { kind: 'review' }
  | { kind: 'thanks' }

type Draft = { nickname: string; consent: boolean; answers: Answers; step: Step }

// Versioned key: drafts from the old 15-question flow are never restored into the 25-question one.
const DRAFT_KEY = 'andrey-project:rascunho:v2'
const TOTAL = QUESTIONS.length

function isAnswered(q: Question, answers: Answers) {
  return Boolean(answers[q.id]?.trim())
}

let isFirstScreen = true

/** Moves focus to the main heading of each new screen so screen readers announce it. */
function useFocusHeading(key: string) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    // Leave the very first page load alone; focus every screen reached by navigating.
    if (isFirstScreen) {
      isFirstScreen = false
      return
    }
    ref.current?.focus()
    window.scrollTo({ top: 0 })
  }, [key])
  return ref
}

export default function Survey() {
  const [step, setStep] = useState<Step>({ kind: 'welcome' })
  const [nickname, setNickname] = useState('')
  const [consent, setConsent] = useState(false)
  const [answers, setAnswers] = useState<Answers>({})
  const [restored, setRestored] = useState(false)

  // Restore an in-progress draft (same tab only) so a reload never loses answers.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY)
      if (raw) {
        const draft = JSON.parse(raw) as Draft
        setNickname(draft.nickname ?? '')
        setConsent(Boolean(draft.consent))
        setAnswers(draft.answers ?? {})
        if (draft.step && draft.step.kind !== 'thanks') setStep(draft.step)
      }
    } catch {
      /* ignore corrupt drafts */
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      if (step.kind === 'welcome' || step.kind === 'thanks') {
        window.sessionStorage.removeItem(DRAFT_KEY)
      } else {
        const draft: Draft = { nickname, consent, answers, step }
        window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      }
    } catch {
      /* storage may be unavailable (private mode); the flow still works in memory */
    }
  }, [restored, step, nickname, consent, answers])

  const stepKey =
    step.kind === 'question' ? `q-${step.index}` : step.kind

  function reset() {
    setNickname('')
    setConsent(false)
    setAnswers({})
    setStep({ kind: 'welcome' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky/70 via-white to-white">
      <SiteHeader />
      <main id="conteudo" className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {step.kind === 'welcome' && <Welcome stepKey={stepKey} onStart={() => setStep({ kind: 'identify' })} />}
        {step.kind === 'identify' && (
          <Identify
            stepKey={stepKey}
            nickname={nickname}
            consent={consent}
            onNickname={setNickname}
            onConsent={setConsent}
            onBack={() => setStep({ kind: 'welcome' })}
            onNext={() => setStep({ kind: 'question', index: 0 })}
          />
        )}
        {step.kind === 'question' && (
          <QuestionScreen
            key={step.index}
            stepKey={stepKey}
            index={step.index}
            fromReview={Boolean(step.fromReview)}
            answers={answers}
            onAnswer={(id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))}
            onBack={() =>
              setStep(step.index === 0 ? { kind: 'identify' } : { kind: 'question', index: step.index - 1 })
            }
            onNext={() =>
              setStep(
                step.index === TOTAL - 1 ? { kind: 'review' } : { kind: 'question', index: step.index + 1 },
              )
            }
            onReturnToReview={() => setStep({ kind: 'review' })}
          />
        )}
        {step.kind === 'review' && (
          <Review
            stepKey={stepKey}
            nickname={nickname}
            consent={consent}
            answers={answers}
            onEdit={(index) => setStep({ kind: 'question', index, fromReview: true })}
            onEditIdentity={() => setStep({ kind: 'identify' })}
            onBack={() => setStep({ kind: 'question', index: TOTAL - 1 })}
            onSubmitted={() => setStep({ kind: 'thanks' })}
          />
        )}
        {step.kind === 'thanks' && <Thanks stepKey={stepKey} onFinish={reset} />}
      </main>
      <SiteFooter />
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Welcome({ stepKey, onStart }: { stepKey: string; onStart: () => void }) {
  const ref = useFocusHeading(stepKey)
  return (
    <section aria-labelledby="titulo-abertura" className="animate-rise text-center">
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-navy">Andrey Project</p>
      <p className="mx-auto mt-5 mb-6 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-1.5 text-sm font-medium text-navy shadow-soft">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-navy" />
        Projeto acadêmico de acessibilidade digital
      </p>
      <h1
        id="titulo-abertura"
        ref={ref}
        tabIndex={-1}
        className="text-4xl font-extrabold tracking-tight text-navy sm:text-6xl"
      >
        Acessibilidade para Todos
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg font-medium italic text-navy/85 sm:text-xl">
        “Sua opinião pode tornar a internet mais acessível.”
      </p>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">
        Um projeto que busca tornar a experiência digital mais acessível, simples e agradável para todos.
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Sua participação é muito importante. Por meio das suas respostas, podemos identificar dificuldades, avaliar
        funcionalidades e encontrar oportunidades de melhoria.
      </p>
      <div className="mt-10">
        <button type="button" className="btn-primary px-8 text-lg" onClick={onStart}>
          Começar avaliação
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <ul className="mx-auto mt-14 grid max-w-2xl gap-4 text-left sm:grid-cols-3" aria-label="Sobre a avaliação">
        {[
          { icon: 'clock', t: 'Tempo estimado', v: '6 a 8 minutos', d: 'Sem pressa e sem limite de tempo.' },
          { icon: 'list', t: 'Quantidade', v: `${TOTAL} perguntas`, d: 'Uma por tela, com progresso visível.' },
          { icon: 'heart', t: 'Participação', v: 'Voluntária', d: 'Perguntas pessoais são opcionais.' },
        ].map((item) => (
          <li key={item.t} className="rounded-2xl border border-line/80 bg-white p-5 shadow-soft">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-navy">
              <InfoIcon name={item.icon} />
            </span>
            <p className="mt-3 text-sm font-medium text-muted">{item.t}</p>
            <p className="font-semibold text-navy">{item.v}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.d}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function InfoIcon({ name }: { name: string }) {
  const common = {
    viewBox: '0 0 24 24',
    className: 'h-5 w-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (name === 'clock')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  if (name === 'list')
    return (
      <svg {...common}>
        <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */

function Identify(props: {
  stepKey: string
  nickname: string
  consent: boolean
  onNickname: (v: string) => void
  onConsent: (v: boolean) => void
  onBack: () => void
  onNext: () => void
}) {
  const ref = useFocusHeading(props.stepKey)
  const [showError, setShowError] = useState(false)
  const consentRef = useRef<HTMLInputElement>(null)

  function next(e: React.FormEvent) {
    e.preventDefault()
    if (!props.consent) {
      setShowError(true)
      consentRef.current?.focus()
      return
    }
    props.onNext()
  }

  return (
    <section aria-labelledby="titulo-identificacao" className="animate-rise">
      <form onSubmit={next} noValidate className="rounded-3xl border border-line/80 bg-white p-6 shadow-soft sm:p-10">
        <h1
          id="titulo-identificacao"
          ref={ref}
          tabIndex={-1}
          className="text-3xl font-bold tracking-tight text-navy sm:text-4xl"
        >
          Antes de começar
        </h1>
        <p className="mt-4 text-lg leading-relaxed">
          Para organizar os resultados desta avaliação, você pode informar como gostaria de ser identificada.
        </p>

        <div className="mt-8">
          <label htmlFor="apelido" className="block text-base font-semibold text-navy">
            Nome ou apelido <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            id="apelido"
            name="apelido"
            type="text"
            autoComplete="nickname"
            maxLength={MAX_NICKNAME}
            value={props.nickname}
            onChange={(e) => props.onNickname(e.target.value)}
            className="field mt-2"
            placeholder="Como você gostaria de ser chamada?"
          />
        </div>

        <div className="mt-8 rounded-2xl bg-sky p-5 sm:p-6">
          <p className="text-base leading-relaxed">
            Suas respostas serão utilizadas para avaliar e aprimorar este projeto. As respostas pessoais são opcionais
            e serão armazenadas em uma área privada, acessível somente ao responsável autorizado pelo projeto.
          </p>
          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              ref={consentRef}
              type="checkbox"
              checked={props.consent}
              onChange={(e) => {
                props.onConsent(e.target.checked)
                if (e.target.checked) setShowError(false)
              }}
              aria-invalid={showError}
              aria-describedby={showError ? 'erro-consentimento' : undefined}
              required
              className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-navy"
            />
            <span className="text-base font-semibold text-navy">
              Confirmo que desejo participar <span className="font-normal text-muted">(obrigatório)</span>
            </span>
          </label>
          {showError && (
            <p id="erro-consentimento" role="alert" className="mt-3 flex items-center gap-2 rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
              <span aria-hidden="true">⚠</span> Para continuar, marque a confirmação de participação.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" className="btn-secondary" onClick={props.onBack}>
            <span aria-hidden="true">←</span> Voltar
          </button>
          <button type="submit" className="btn-primary">
            Continuar <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Progress({ index, answers }: { index: number; answers: Answers }) {
  const answered = QUESTIONS.filter((q) => isAnswered(q, answers)).length
  const pct = Math.round((answered / TOTAL) * 100)
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <p className="font-semibold text-navy">
          Pergunta {index + 1} de {TOTAL}
        </p>
        <p className="text-muted" aria-live="polite">
          {answered} de {TOTAL} respondidas
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Perguntas respondidas"
        aria-valuemin={0}
        aria-valuemax={TOTAL}
        aria-valuenow={answered}
        aria-valuetext={`${answered} de ${TOTAL} perguntas respondidas`}
        className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-mist ring-1 ring-line/70"
      >
        <div className="h-full rounded-full bg-navy transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-3 hidden gap-1.5 sm:flex" aria-hidden="true">
        {QUESTIONS.map((q, i) => (
          <li
            key={q.id}
            className={`h-1.5 flex-1 rounded-full ${
              i === index ? 'bg-navy' : isAnswered(q, answers) ? 'bg-navy/35' : 'bg-line'
            }`}
          />
        ))}
      </ol>
    </div>
  )
}

function QuestionScreen(props: {
  stepKey: string
  index: number
  fromReview: boolean
  answers: Answers
  onAnswer: (id: string, value: string) => void
  onBack: () => void
  onNext: () => void
  onReturnToReview: () => void
}) {
  const q = QUESTIONS[props.index]
  const ref = useFocusHeading(props.stepKey)
  const [error, setError] = useState(false)
  const value = props.answers[q.id] ?? ''
  const isLast = props.index === TOTAL - 1
  const titleId = useId()
  const descId = useId()
  const errorId = useId()

  function advance(target: 'next' | 'review') {
    if (q.required && !value.trim()) {
      setError(true)
      document.getElementById(q.type === 'choice' ? `${q.id}-opt-0` : `${q.id}-texto`)?.focus()
      return
    }
    if (target === 'review') props.onReturnToReview()
    else props.onNext()
  }

  return (
    <section aria-labelledby={titleId} className="animate-rise">
      <Progress index={props.index} answers={props.answers} />

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          advance('next')
        }}
        className="rounded-3xl border border-line/80 bg-white p-6 shadow-soft sm:p-10"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy ring-1 ring-navy/15">
            Pergunta {String(q.number).padStart(2, '0')}
          </span>
          <span className="rounded-full bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy">
            {CATEGORY_LABEL[q.category]}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              q.required ? 'bg-navy text-white' : 'border border-line text-muted'
            }`}
          >
            {q.required ? 'Obrigatória' : 'Opcional'}
          </span>
        </div>

        <h1
          id={titleId}
          ref={ref}
          tabIndex={-1}
          className="mt-5 text-2xl font-bold leading-snug tracking-tight text-navy sm:text-3xl"
        >
          <span className="sr-only">Pergunta {q.number} de {TOTAL}: </span>
          {q.title}
        </h1>
        <p id={descId} className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
          {q.description}
        </p>

        <div className="mt-8">
          {q.type === 'choice' ? (
            <fieldset aria-describedby={`${descId}${error ? ` ${errorId}` : ''}`}>
              <legend className="sr-only">{q.title}</legend>
              <div className="grid gap-3">
                {q.options!.map((opt, i) => {
                  const checked = value === opt
                  const id = `${q.id}-opt-${i}`
                  return (
                    <label
                      key={opt}
                      htmlFor={id}
                      className={`group flex cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 py-4 transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy ${
                        checked
                          ? 'border-navy bg-sky'
                          : 'border-line bg-white hover:border-navy/40 hover:bg-mist'
                      }`}
                    >
                      <input
                        id={id}
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={checked}
                        onChange={() => {
                          props.onAnswer(q.id, opt)
                          setError(false)
                        }}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          checked ? 'border-navy bg-navy text-white' : 'border-muted/60 bg-white'
                        }`}
                      >
                        {checked && (
                          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                            <path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={`flex-1 text-base sm:text-lg ${checked ? 'font-semibold text-navy' : 'text-ink'}`}>
                        {opt}
                      </span>
                      {checked && (
                        <span aria-hidden="true" className="text-xs font-semibold uppercase tracking-wide text-navy">
                          Selecionada
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ) : (
            <div>
              <label htmlFor={`${q.id}-texto`} className="block text-base font-semibold text-navy">
                Sua resposta {!q.required && <span className="font-normal text-muted">(opcional)</span>}
              </label>
              <textarea
                id={`${q.id}-texto`}
                rows={5}
                maxLength={MAX_OPEN_ANSWER}
                value={value}
                onChange={(e) => {
                  props.onAnswer(q.id, e.target.value)
                  setError(false)
                }}
                aria-describedby={`${descId} ${q.id}-contador${error ? ` ${errorId}` : ''}`}
                className="field mt-2 min-h-36 resize-y leading-relaxed"
                placeholder="Escreva com suas palavras… pode ser curto ou detalhado."
              />
              <p id={`${q.id}-contador`} className="mt-2 text-right text-sm text-muted">
                {value.length} / {MAX_OPEN_ANSWER} caracteres
              </p>
            </div>
          )}

          {error && (
            <p
              id={errorId}
              role="alert"
              className="mt-4 flex items-center gap-2 rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger"
            >
              <span aria-hidden="true">⚠</span>
              {q.type === 'choice'
                ? 'Selecione uma alternativa para continuar.'
                : 'Escreva uma resposta para continuar.'}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="btn-secondary" onClick={props.onBack}>
            <span aria-hidden="true">←</span> Voltar
          </button>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {props.fromReview && !isLast && (
              <button type="button" className="btn-secondary" onClick={() => advance('review')}>
                Voltar à revisão
              </button>
            )}
            <button type="submit" className="btn-primary">
              {isLast ? 'Finalizar' : 'Próxima pergunta'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Review(props: {
  stepKey: string
  nickname: string
  consent: boolean
  answers: Answers
  onEdit: (index: number) => void
  onEditIdentity: () => void
  onBack: () => void
  onSubmitted: () => void
}) {
  const ref = useFocusHeading(props.stepKey)
  const [status, setStatus] = useState<'idle' | 'pending' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const sending = useRef(false)
  const missing = QUESTIONS.filter((q) => q.required && !isAnswered(q, props.answers))
  const errorRef = useRef<HTMLDivElement>(null)

  async function send() {
    if (sending.current) return
    if (missing.length || !props.consent) return
    sending.current = true
    setStatus('pending')
    try {
      await submitParticipation({
        data: { nickname: props.nickname, consent: true, answers: props.answers },
      })
      props.onSubmitted()
    } catch (err) {
      setStatus('error')
      setMessage(
        err instanceof Error && err.message && err.message.length < 140 && !/fetch|network/i.test(err.message)
          ? err.message
          : '',
      )
      requestAnimationFrame(() => errorRef.current?.focus())
    } finally {
      sending.current = false
    }
  }

  return (
    <section aria-labelledby="titulo-revisao" className="animate-rise">
      <h1 id="titulo-revisao" ref={ref} tabIndex={-1} className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        Quase tudo pronto!
      </h1>
      <p className="mt-3 text-lg leading-relaxed">
        Antes de finalizar, você pode conferir suas respostas e alterar qualquer informação, caso deseje.
      </p>

      <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line/80 bg-sky px-5 py-4">
        <div>
          <p className="text-sm font-medium text-muted">Identificação</p>
          <p className="font-semibold text-navy">{props.nickname.trim() || 'Não informada'}</p>
        </div>
        <button type="button" onClick={props.onEditIdentity} className="text-sm font-semibold text-navy underline underline-offset-4 hover:no-underline">
          Editar<span className="sr-only"> identificação</span>
        </button>
      </div>

      {missing.length > 0 && (
        <div role="alert" className="mt-6 rounded-2xl border border-danger/30 bg-danger-bg p-5 text-danger">
          <p className="font-semibold">
            <span aria-hidden="true">⚠ </span>Faltam respostas obrigatórias:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {missing.map((q) => (
              <li key={q.id}>
                <button type="button" className="underline underline-offset-2" onClick={() => props.onEdit(q.number - 1)}>
                  Pergunta {q.number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className="mt-6 grid gap-3">
        {QUESTIONS.map((q, i) => {
          const answer = props.answers[q.id]?.trim()
          return (
            <li key={q.id} className="rounded-2xl border border-line/80 bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-muted">
                    Pergunta {String(q.number).padStart(2, '0')} · {CATEGORY_LABEL[q.category]} ·{' '}
                    {q.required ? 'Obrigatória' : 'Opcional'}
                  </p>
                  <p className="mt-1 font-semibold leading-snug text-navy">{q.title}</p>
                  <p className={`mt-2 whitespace-pre-wrap break-words leading-relaxed ${answer ? 'text-ink' : 'italic text-muted'}`}>
                    {answer || 'Sem resposta'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => props.onEdit(i)}
                  className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:bg-sky"
                >
                  Editar<span className="sr-only"> pergunta {q.number}</span>
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      {status === 'error' && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-2xl border border-danger/30 bg-danger-bg p-5 text-danger"
        >
          <p className="font-semibold">
            <span aria-hidden="true">⚠ </span>Não foi possível enviar suas respostas.
          </p>
          <p className="mt-1 text-sm">
            {message || 'Verifique sua conexão e tente novamente.'} Suas respostas continuam salvas nesta tela.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" className="btn-secondary" onClick={props.onBack} disabled={status === 'pending'}>
          <span aria-hidden="true">←</span> Voltar
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={send}
          disabled={status === 'pending' || missing.length > 0}
        >
          {status === 'pending' ? 'Enviando…' : status === 'error' ? 'Tentar novamente' : 'Enviar respostas'}
        </button>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

const WHATSAPP_DISPLAY = '45 98842-8151'
const WHATSAPP_URL = 'https://wa.me/5545988428151'

function Thanks({ stepKey, onFinish }: { stepKey: string; onFinish: () => void }) {
  const ref = useFocusHeading(stepKey)
  return (
    <section aria-labelledby="titulo-obrigado" className="animate-rise">
      <div className="rounded-3xl border border-mint-ink/15 bg-mint p-8 text-center shadow-soft sm:p-12">
        <div aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-mint-ink shadow-soft">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
            <path d="M5 12.5 10 17.5 19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 id="titulo-obrigado" ref={ref} tabIndex={-1} className="mt-6 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          Obrigado por participar!
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink">
          Sua participação foi muito importante para este projeto. Cada resposta contribui para identificar
          oportunidades de melhoria e tornar a experiência digital mais acessível, inclusiva e agradável.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mint-ink">
          Esperamos que sua experiência tenha sido agradável. Agradecemos por dedicar alguns minutos para conhecer e
          avaliar o Andrey Project.
        </p>
        <p role="status" className="sr-only">
          Respostas enviadas com sucesso.
        </p>
      </div>

      <section
        aria-labelledby="titulo-contato"
        className="mt-8 rounded-3xl border border-line/80 bg-white p-6 shadow-soft sm:p-10"
      >
        <h2 id="titulo-contato" className="text-2xl font-bold tracking-tight text-navy">
          Gostaria de compartilhar mais alguma opinião?
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink sm:text-lg">
          Caso tenha alguma sugestão, comentário ou queira conversar um pouco mais sobre o projeto, deixo abaixo meu
          contato. Será um prazer receber seu feedback e trocar algumas ideias.
        </p>

        <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-sky p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-navy shadow-soft">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5Z" />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-semibold text-muted">Contato do responsável pelo projeto</h3>
              <p className="mt-0.5 text-lg font-bold text-navy">
                <span className="font-medium text-muted">WhatsApp: </span>
                {WHATSAPP_DISPLAY}
              </p>
            </div>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
            Conversar pelo WhatsApp
            <span className="sr-only"> (abre em uma nova aba)</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <div className="mt-8 text-center">
        <button type="button" className="btn-secondary" onClick={onFinish}>
          Voltar ao início
        </button>
      </div>
    </section>
  )
}
