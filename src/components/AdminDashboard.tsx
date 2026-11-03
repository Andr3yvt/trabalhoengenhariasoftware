import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { exportParticipationsCsv, listParticipations } from '@/lib/admin.functions'
import { CATEGORY_LABEL, QUESTIONS } from '@/lib/questions'

type Row = Awaited<ReturnType<typeof listParticipations>>[number]
type Filters = { from: string; to: string; search: string }

const EMPTY: Filters = { from: '', to: '', search: '' }

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

function formatDate(iso: string) {
  return dateFmt.format(new Date(iso))
}

function answeredCount(row: Row) {
  return QUESTIONS.filter((q) => row.answers[q.id]?.trim()).length
}

export default function AdminDashboard() {
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [applied, setApplied] = useState<Filters>(EMPTY)
  const [rows, setRows] = useState<Row[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [selected, setSelected] = useState<Row | null>(null)

  const load = useCallback(async (f: Filters) => {
    setLoading(true)
    setError('')
    try {
      setRows(await listParticipations({ data: f }))
    } catch {
      setError('Não foi possível carregar as participações. Atualize a página ou entre novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(applied)
  }, [applied, load])

  function apply(e: FormEvent) {
    e.preventDefault()
    setApplied({ ...filters })
  }

  async function exportCsv() {
    setExporting(true)
    try {
      const csv = await exportParticipationsCsv({ data: applied })
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `andrey-project-respostas-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Não foi possível gerar o arquivo CSV. Tente novamente.')
    } finally {
      setExporting(false)
    }
  }

  const total = rows?.length ?? 0
  const withName = rows?.filter((r) => r.nickname).length ?? 0
  const positive = rows?.filter((r) => ['Muito boa.', 'Boa.'].includes(r.answers.q14)).length ?? 0
  const filtersActive = Boolean(applied.from || applied.to || applied.search)

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Participações</h1>
          <p className="mt-1 text-muted">Respostas recebidas pelo questionário Acessibilidade para Todos.</p>
        </div>
        <button type="button" className="btn-primary" onClick={exportCsv} disabled={exporting || !total}>
          {exporting ? 'Gerando CSV…' : 'Exportar CSV'}
        </button>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label={filtersActive ? 'Participações (filtradas)' : 'Participações'} value={String(total)} />
        <Stat label="Com nome ou apelido" value={String(withName)} />
        <Stat
          label="Experiência boa ou muito boa"
          value={total ? `${Math.round((positive / total) * 100)}%` : '—'}
        />
      </dl>

      <form
        onSubmit={apply}
        className="mt-8 grid gap-4 rounded-2xl border border-line/80 bg-white p-5 shadow-soft md:grid-cols-[1fr_1fr_1.5fr_auto]"
        aria-label="Filtros"
      >
        <div>
          <label htmlFor="f-from" className="block text-sm font-semibold text-navy">
            De
          </label>
          <input
            id="f-from"
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="field mt-1.5 py-2.5"
          />
        </div>
        <div>
          <label htmlFor="f-to" className="block text-sm font-semibold text-navy">
            Até
          </label>
          <input
            id="f-to"
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="field mt-1.5 py-2.5"
          />
        </div>
        <div>
          <label htmlFor="f-search" className="block text-sm font-semibold text-navy">
            Nome ou apelido
          </label>
          <input
            id="f-search"
            type="search"
            value={filters.search}
            placeholder="Pesquisar…"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="field mt-1.5 py-2.5"
          />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn-primary py-2.5">
            Filtrar
          </button>
          {filtersActive && (
            <button
              type="button"
              className="btn-secondary py-2.5"
              onClick={() => {
                setFilters(EMPTY)
                setApplied(EMPTY)
              }}
            >
              Limpar
            </button>
          )}
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-danger-bg px-4 py-3 font-medium text-danger">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-line/80 bg-white shadow-soft">
        {loading && !rows ? (
          <p className="p-8 text-center text-muted" role="status">
            Carregando participações…
          </p>
        ) : rows && rows.length === 0 ? (
          <p className="p-8 text-center text-muted">
            {filtersActive ? 'Nenhuma participação encontrada com esses filtros.' : 'Ainda não há participações.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <caption className="sr-only">Lista de participações</caption>
              <thead className="bg-sky text-sm text-navy">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Data</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Nome ou apelido</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Avaliação geral</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Respondidas</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody aria-busy={loading}>
                {rows?.map((r) => (
                  <tr key={r.id} className="border-t border-line/70 hover:bg-mist/70">
                    <td className="whitespace-nowrap px-5 py-3.5">{formatDate(r.createdAt)}</td>
                    <td className="px-5 py-3.5 font-medium text-navy">
                      {r.nickname || <span className="italic font-normal text-muted">Não informado</span>}
                    </td>
                    <td className="px-5 py-3.5">{r.answers.q14 ?? '—'}</td>
                    <td className="px-5 py-3.5">{answeredCount(r)} / {QUESTIONS.length}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-mint-ink">
                        <span aria-hidden="true">✓</span> {r.status === 'concluido' ? 'Concluído' : r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(r)}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:bg-sky"
                      >
                        Ver respostas<span className="sr-only"> de {r.nickname || 'participante sem nome'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DetailDialog row={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/80 bg-white p-5 shadow-soft">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="mt-1 text-3xl font-bold tracking-tight text-navy">{value}</dd>
    </div>
  )
}

function DetailDialog({ row, onClose }: { row: Row | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (row && !dialog.open) dialog.showModal()
    if (!row && dialog.open) dialog.close()
  }, [row])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="detalhe-titulo"
      className="m-auto w-[min(48rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] rounded-3xl border border-line bg-white p-0 text-ink shadow-soft backdrop:bg-navy/40"
    >
      {row && (
        <div>
          <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-white px-6 py-5">
            <div>
              <h2 id="detalhe-titulo" className="text-xl font-bold text-navy">
                {row.nickname || 'Participante sem nome'}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Enviado em {formatDate(row.createdAt)} · {answeredCount(row)} de {QUESTIONS.length} respondidas
              </p>
              <p className="mt-0.5 break-all text-xs text-muted">ID: {row.id}</p>
            </div>
            <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-sm">
              Fechar
            </button>
          </div>
          <ol className="grid gap-4 p-6">
            {QUESTIONS.map((q) => {
              const answer = row.answers[q.id]?.trim()
              return (
                <li key={q.id} className="rounded-2xl bg-mist p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Pergunta {q.number} · {CATEGORY_LABEL[q.category]} ·{' '}
                    {q.type === 'choice' ? 'Múltipla escolha' : 'Aberta'}
                  </p>
                  <p className="mt-1 font-semibold leading-snug text-navy">{q.title}</p>
                  <p className={`mt-2 whitespace-pre-wrap break-words leading-relaxed ${answer ? '' : 'italic text-muted'}`}>
                    {answer || 'Sem resposta'}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </dialog>
  )
}
