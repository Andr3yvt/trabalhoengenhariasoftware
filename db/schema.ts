import { boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * One row per completed participation in the "Acessibilidade para Todos" questionnaire.
 * `answers` maps question ids (q1…qN) to the selected option or the free-text answer.
 * `questionnaireVersion` tells which question set the ids refer to: 1 = original 15 questions
 * (rows created before the 25-question update), 2 = current 25 questions.
 */
export const participations = pgTable(
  'participations',
  {
    id: uuid().primaryKey().defaultRandom(),
    nickname: text(),
    consent: boolean().notNull(),
    status: text().notNull().default('concluido'),
    answers: jsonb().$type<Record<string, string>>().notNull(),
    questionnaireVersion: integer('questionnaire_version').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('participations_created_at_idx').on(table.createdAt)],
)

export type Participation = typeof participations.$inferSelect
