import { createServerFn } from '@tanstack/react-start'
import { CURRENT_VERSION, validateSubmission } from './questions'

/** Public endpoint: stores one completed participation. Returns only the id. */
export const submitParticipation = createServerFn({ method: 'POST' })
  .validator((input: unknown) => validateSubmission(input))
  .handler(async ({ data }) => {
    const { db } = await import('../../db')
    const { participations } = await import('../../db/schema')
    const [row] = await db
      .insert(participations)
      .values({
        nickname: data.nickname,
        consent: data.consent,
        status: 'concluido',
        answers: data.answers,
        questionnaireVersion: CURRENT_VERSION,
      })
      .returning({ id: participations.id })
    return { ok: true as const, id: row.id }
  })
