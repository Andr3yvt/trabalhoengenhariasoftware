import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getUser } from '@netlify/identity'
import { and, desc, gte, ilike, lt } from 'drizzle-orm'
import { QUESTIONS } from './questions'

const ADMIN_ROLE = 'admin'

async function currentAdmin() {
  const user = await getUser()
  if (!user) return { user: null, isAdmin: false }
  const isAdmin = (user.roles ?? []).includes(ADMIN_ROLE)
  return { user, isAdmin }
}

/** Every admin data function runs this; route guards are only for UX. */
const requireAdmin = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const { user, isAdmin } = await currentAdmin()
  if (!user) throw new Error('Autenticação necessária.')
  if (!isAdmin) throw new Error('Acesso restrito ao responsável pelo projeto.')
  return next({ context: { user } })
})

export const getAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  const { user, isAdmin } = await currentAdmin()
  if (!user) return null
  return { email: user.email ?? '', name: user.name ?? '', isAdmin }
})

type Filters = { from?: string; to?: string; search?: string }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function validateFilters(input: unknown): Filters {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const out: Filters = {}
  if (typeof raw.from === 'string' && DATE_RE.test(raw.from)) out.from = raw.from
  if (typeof raw.to === 'string' && DATE_RE.test(raw.to)) out.to = raw.to
  if (typeof raw.search === 'string' && raw.search.trim()) out.search = raw.search.trim().slice(0, 60)
  return out
}

async function queryParticipations(filters: Filters) {
  const { db } = await import('../../db')
  const { participations } = await import('../../db/schema')
  const conditions = []
  // Dates are interpreted in Brasília time (UTC-3), the project's audience.
  if (filters.from) conditions.push(gte(participations.createdAt, new Date(`${filters.from}T00:00:00-03:00`)))
  if (filters.to) {
    const end = new Date(`${filters.to}T00:00:00-03:00`)
    end.setUTCDate(end.getUTCDate() + 1)
    conditions.push(lt(participations.createdAt, end))
  }
  if (filters.search) {
    const escaped = filters.search.replace(/[\\%_]/g, (c) => `\\${c}`)
    conditions.push(ilike(participations.nickname, `%${escaped}%`))
  }
  return db
    .select()
    .from(participations)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(participations.createdAt))
    .limit(1000)
}

export const listParticipations = createServerFn({ method: 'GET' })
  .middleware([requireAdmin])
  .validator(validateFilters)
  .handler(async ({ data }) => {
    const rows = await queryParticipations(data)
    return rows.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      answers: r.answers,
    }))
  })

function csvCell(value: string) {
  // Neutralise spreadsheet formula injection and escape quotes.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export const exportParticipationsCsv = createServerFn({ method: 'POST' })
  .middleware([requireAdmin])
  .validator(validateFilters)
  .handler(async ({ data }) => {
    const rows = await queryParticipations(data)
    const header = ['id', 'data_envio', 'nome_ou_apelido', 'status', ...QUESTIONS.map((q) => `P${q.number} - ${q.title}`)]
    const lines = [header.map(csvCell).join(',')]
    for (const r of rows) {
      lines.push(
        [r.id, r.createdAt.toISOString(), r.nickname ?? '', r.status, ...QUESTIONS.map((q) => r.answers[q.id] ?? '')]
          .map(csvCell)
          .join(','),
      )
    }
    // BOM so Excel opens accented characters correctly.
    return '﻿' + lines.join('\r\n')
  })
