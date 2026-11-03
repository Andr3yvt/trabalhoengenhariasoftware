export type QuestionCategory = 'acessibilidade' | 'pessoal' | 'surpresa' | 'flerte'

export type Question = {
  id: string
  number: number
  category: QuestionCategory
  type: 'choice' | 'open'
  title: string
  description: string
  options?: string[]
  /** Accessibility questions are required; personal ones are optional. */
  required: boolean
}

export const CATEGORY_LABEL: Record<QuestionCategory, string> = {
  acessibilidade: 'Avaliação de acessibilidade',
  pessoal: 'Preferência pessoal',
  surpresa: 'Pergunta surpresa',
  flerte: 'Pergunta descontraída',
}

export const MAX_OPEN_ANSWER = 2000
export const MAX_NICKNAME = 60

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    number: 1,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: 'Você conseguiu entender o objetivo do site logo na primeira tela?',
    description:
      'Sua primeira impressão é importante para avaliar se a apresentação do projeto está clara.',
    options: ['Sim, foi bem fácil.', 'Mais ou menos.', 'Não, fiquei um pouco perdida.'],
  },
  {
    id: 'q2',
    number: 2,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: 'Qual é a sua cor favorita?',
    description:
      'Aquela cor que você escolheria sem pensar duas vezes. E, se alguém fosse te presentear com uma flor dessa cor, qual você escolheria?',
  },
  {
    id: 'q3',
    number: 3,
    category: 'surpresa',
    type: 'choice',
    // Multiple-choice screens always need a selection to advance ("Não lembro" keeps it light).
    required: true,
    title: 'Já te disseram que você tem olhos lindos?',
    description:
      'Uma pergunta aparentemente simples, mas que pode revelar um elogio que ficou na memória.',
    options: ['Sim, já me disseram.', 'Não, nunca.', 'Não lembro.'],
  },
  {
    id: 'q4',
    number: 4,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: 'Você achou os textos fáceis de ler?',
    description:
      'Queremos garantir que o conteúdo seja confortável de ler em diferentes dispositivos.',
    options: ['Sim.', 'Mais ou menos.', 'Não.'],
  },
  {
    id: 'q5',
    number: 5,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: 'Qual tipo de flor você mais gosta?',
    description:
      'Pode ser uma flor delicada, colorida ou até uma que você nunca recebeu, mas adoraria ganhar.',
  },
  {
    id: 'q6',
    number: 6,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: 'Você conseguiu utilizar os botões e as opções de resposta sem dificuldades?',
    description: 'Essa resposta ajuda a identificar possíveis problemas de navegação.',
    options: [
      'Sim, tudo funcionou.',
      'Algumas coisas poderiam melhorar.',
      'Não consegui utilizar tudo.',
    ],
  },
  {
    id: 'q7',
    number: 7,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: 'Qual seria um presente simples que deixaria seu dia mais feliz?',
    description: 'Não precisa ser algo caro. Às vezes, um pequeno gesto pode significar muito.',
  },
  {
    id: 'q8',
    number: 8,
    category: 'flerte',
    type: 'open',
    required: false,
    title: 'Você acredita que uma pessoa pode chamar sua atenção só com um sorriso?',
    description:
      'Alguns sorrisos parecem ter um efeito especial. Você acha que isso acontece de verdade?',
  },
  {
    id: 'q9',
    number: 9,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: 'Você encontrou alguma dificuldade durante a utilização do site?',
    description: 'Queremos identificar qualquer obstáculo que possa prejudicar a experiência.',
    options: ['Sim.', 'Não.', 'Não tenho certeza.'],
  },
  {
    id: 'q10',
    number: 10,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: 'Qual lugar você gostaria de conhecer algum dia?',
    description:
      'Pode ser uma cidade, uma praia, um país ou qualquer lugar que você tenha vontade de visitar.',
  },
  {
    id: 'q11',
    number: 11,
    category: 'flerte',
    type: 'open',
    required: false,
    title: 'Você costuma perceber quando alguém está tentando te conquistar?',
    description:
      'Algumas pessoas são discretas, outras nem tanto. Qual é a sua opinião sobre isso?',
  },
  {
    id: 'q12',
    number: 12,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title:
      'Você acha que o site poderia ser utilizado com facilidade por pessoas com diferentes necessidades de acessibilidade?',
    description: 'A acessibilidade é um dos principais objetivos deste projeto.',
    options: ['Sim.', 'Em parte.', 'Não.'],
  },
  {
    id: 'q13',
    number: 13,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: 'O que você mais valoriza em uma amizade?',
    description:
      'Pode ser uma qualidade, uma atitude ou algo que faça você se sentir bem ao lado de alguém.',
  },
  {
    id: 'q14',
    number: 14,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: 'De maneira geral, como você avaliaria sua experiência utilizando o site?',
    description:
      'Sua avaliação geral ajuda a entender se o projeto está cumprindo seu objetivo.',
    options: ['Muito boa.', 'Boa.', 'Regular.', 'Ruim.'],
  },
  {
    id: 'q15',
    number: 15,
    category: 'flerte',
    type: 'open',
    required: false,
    title: 'O que você acharia de alguém que criou um site inteiro só para tentar te conquistar?',
    description:
      'Uma pergunta especial para encerrar a experiência. Pode responder com sinceridade, sem pressão.',
  },
]

export type Answers = Record<string, string>

/** Runtime validation shared by the server handler. Throws on invalid input. */
export function validateSubmission(input: unknown): {
  nickname: string | null
  consent: true
  answers: Answers
} {
  if (!input || typeof input !== 'object') throw new Error('Dados inválidos.')
  const raw = input as Record<string, unknown>
  if (raw.consent !== true) throw new Error('A confirmação de participação é obrigatória.')

  let nickname: string | null = null
  if (raw.nickname !== undefined && raw.nickname !== null) {
    if (typeof raw.nickname !== 'string') throw new Error('Apelido inválido.')
    const trimmed = raw.nickname.trim().slice(0, MAX_NICKNAME)
    nickname = trimmed.length ? trimmed : null
  }

  const rawAnswers = raw.answers
  if (!rawAnswers || typeof rawAnswers !== 'object') throw new Error('Respostas inválidas.')
  const source = rawAnswers as Record<string, unknown>
  const answers: Answers = {}
  for (const q of QUESTIONS) {
    const value = source[q.id]
    if (value === undefined || value === null || value === '') {
      if (q.required) throw new Error(`A pergunta ${q.number} é obrigatória.`)
      continue
    }
    if (typeof value !== 'string') throw new Error(`Resposta inválida na pergunta ${q.number}.`)
    if (q.type === 'choice') {
      if (!q.options!.includes(value)) throw new Error(`Alternativa inválida na pergunta ${q.number}.`)
      answers[q.id] = value
    } else {
      const trimmed = value.trim().slice(0, MAX_OPEN_ANSWER)
      if (trimmed) answers[q.id] = trimmed
      else if (q.required) throw new Error(`A pergunta ${q.number} é obrigatória.`)
    }
  }
  return { nickname, consent: true, answers }
}
