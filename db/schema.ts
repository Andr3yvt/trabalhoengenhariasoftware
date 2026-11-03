import { boolean, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * One row per completed participation in the "Acessibilidade para Todos" questionnaire.
 * `answers` maps question ids (q1…q15) to the selected option or the free-text answer.
 */
export const participations = pgTable(
  'participations',
  {
    id: uuid().primaryKey().defaultRandom(),
    nickname: text(),
    consent: boolean().notNull(),
    status: text().notNull().default('concluido'),
    answers: jsonb().$type<Record<string, string>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('participations_created_at_idx').on(table.createdAt)],
)

export type Participation = typeof participations.$inferSelect
