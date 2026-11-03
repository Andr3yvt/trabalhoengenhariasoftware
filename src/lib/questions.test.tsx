import { describe, expect, it } from 'vitest'
import { QUESTIONS, validateSubmission } from './questions'

const required = Object.fromEntries(
  QUESTIONS.filter((q) => q.required).map((q) => [q.id, q.options![0]]),
)

describe('questionnaire definition', () => {
  it('has 15 questions: 7 multiple choice and 8 open', () => {
    expect(QUESTIONS).toHaveLength(15)
    expect(QUESTIONS.filter((q) => q.type === 'choice')).toHaveLength(7)
    expect(QUESTIONS.filter((q) => q.type === 'open')).toHaveLength(8)
    expect(QUESTIONS.at(-1)?.id).toBe('q15')
  })
})

describe('validateSubmission', () => {
  it('accepts required answers with optional ones blank', () => {
    const out = validateSubmission({ nickname: '  ', consent: true, answers: { ...required, q2: '' } })
    expect(out.nickname).toBeNull()
    expect(out.answers.q2).toBeUndefined()
  })

  it('rejects missing consent, missing required answers and unknown options', () => {
    expect(() => validateSubmission({ consent: false, answers: required })).toThrow()
    expect(() => validateSubmission({ consent: true, answers: { ...required, q1: '' } })).toThrow()
    expect(() => validateSubmission({ consent: true, answers: { ...required, q4: 'Talvez' } })).toThrow()
  })
})
