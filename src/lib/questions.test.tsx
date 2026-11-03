import { describe, expect, it } from 'vitest'
import { LEGACY_QUESTIONS_V1, QUESTIONS, questionsForVersion, validateSubmission } from './questions'

const required = Object.fromEntries(
  QUESTIONS.filter((q) => q.required).map((q) => [q.id, q.options ? q.options[0] : 'Sugestão curta']),
)

describe('questionnaire definition', () => {
  it('has the 25 questions in order with the categories of the brief', () => {
    expect(QUESTIONS).toHaveLength(25)
    expect(QUESTIONS.map((q) => q.id)).toEqual(Array.from({ length: 25 }, (_, i) => `q${i + 1}`))
    expect(QUESTIONS.map((q) => q.number)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1))
    expect(QUESTIONS.filter((q) => q.category === 'acessibilidade')).toHaveLength(13)
    expect(QUESTIONS.filter((q) => q.category === 'pessoal')).toHaveLength(10)
    expect(QUESTIONS.filter((q) => q.category === 'flerte' || q.category === 'especial').map((q) => q.number)).toEqual([
      18, 25,
    ])
  })

  it('requires exactly the accessibility questions', () => {
    for (const q of QUESTIONS) expect(q.required).toBe(q.category === 'acessibilidade')
  })

  it('keeps the legacy 15-question set for older records', () => {
    expect(LEGACY_QUESTIONS_V1).toHaveLength(15)
    expect(questionsForVersion(1)).toBe(LEGACY_QUESTIONS_V1)
    expect(questionsForVersion(2)).toBe(QUESTIONS)
  })
})

describe('validateSubmission', () => {
  it('accepts required answers with optional ones blank', () => {
    const out = validateSubmission({ nickname: '  ', consent: true, answers: { ...required, q2: '' } })
    expect(out.nickname).toBeNull()
    expect(out.answers.q2).toBeUndefined()
    expect(Object.keys(out.answers)).toHaveLength(13)
  })

  it('rejects missing consent, missing required answers and unknown options', () => {
    expect(() => validateSubmission({ consent: false, answers: required })).toThrow()
    expect(() => validateSubmission({ consent: true, answers: { ...required, q1: '' } })).toThrow()
    expect(() => validateSubmission({ consent: true, answers: { ...required, q24: '   ' } })).toThrow()
    expect(() => validateSubmission({ consent: true, answers: { ...required, q3: 'Talvez' } })).toThrow()
  })
})
