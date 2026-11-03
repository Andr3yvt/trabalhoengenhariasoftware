export type QuestionCategory = 'acessibilidade' | 'pessoal' | 'flerte' | 'especial' | 'surpresa'

export type Question = {
  id: string
  number: number
  category: QuestionCategory
  type: 'choice' | 'open'
  title: string
  description: string
  options?: string[]
  /** Accessibility questions are required; personal and light-hearted ones are optional. */
  required: boolean
}

export const CATEGORY_LABEL: Record<QuestionCategory, string> = {
  acessibilidade: 'Acessibilidade',
  pessoal: 'Preferência pessoal',
  flerte: 'Pergunta descontraída',
  especial: 'Pergunta especial',
  // Only used by the legacy 15-question set (older records).
  surpresa: 'Pergunta surpresa',
}

export const MAX_OPEN_ANSWER = 2000
export const MAX_NICKNAME = 60

/** Version stored with every new participation; bump when the question list changes meaning. */
export const CURRENT_VERSION = 2

/** Current questionnaire: 25 questions, in the exact order defined by the project brief. */
export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    number: 1,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você conseguiu entender o objetivo do site logo na primeira tela?",
    description: "Uma boa experiência começa quando o visitante entende facilmente onde está e o que precisa fazer.",
    options: ["Sim, foi bem fácil.", "Mais ou menos.", "Não, fiquei um pouco perdida."],
  },
  {
    id: 'q2',
    number: 2,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "Qual é a sua cor favorita?",
    description: "Aquela cor que você escolheria sem pensar duas vezes. E se alguém fosse te presentear com uma flor dessa cor, qual escolheria?",
  },
  {
    id: 'q3',
    number: 3,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você achou os textos apresentados no site fáceis de ler?",
    description: "O tamanho das letras, a fonte e a organização do texto fazem diferença na experiência de leitura.",
    options: ["Sim, perfeitamente.", "Mais ou menos.", "Não, tive dificuldades."],
  },
  {
    id: 'q4',
    number: 4,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "Você gosta de assistir filmes? Se sim, qual tipo de filme mais gosta?",
    description: "Romance, comédia, suspense, aventura... ou talvez aquele filme que você conseguiria assistir várias vezes sem enjoar?",
  },
  {
    id: 'q5',
    number: 5,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você conseguiu utilizar todos os botões e opções de resposta sem dificuldades?",
    description: "Os elementos interativos precisam ser fáceis de identificar e utilizar.",
    options: ["Sim, tudo funcionou.", "Algumas opções apresentaram dificuldades.", "Não consegui utilizar tudo."],
  },
  {
    id: 'q6',
    number: 6,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "Qual tipo de flor você mais gosta?",
    description: "Pode ser uma flor delicada, colorida ou até uma que você nunca recebeu, mas adoraria ganhar.",
  },
  {
    id: 'q7',
    number: 7,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você considera que as cores utilizadas no site oferecem um bom contraste para facilitar a leitura?",
    description: "Um bom contraste ajuda pessoas com diferentes condições visuais a utilizar o conteúdo.",
    options: ["Sim, o contraste está ótimo.", "Poderia ser um pouco melhor.", "Não, tive dificuldade para enxergar alguns elementos.", "Não sei dizer."],
  },
  {
    id: 'q8',
    number: 8,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "Qual estilo de música você mais gosta de ouvir?",
    description: "Aquela música ou estilo que você coloca para tocar quando quer melhorar o humor.",
  },
  {
    id: 'q9',
    number: 9,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você conseguiu encontrar facilmente as informações e as opções disponíveis no site?",
    description: "A organização da navegação é fundamental para uma experiência acessível.",
    options: ["Sim, tudo estava bem organizado.", "Algumas informações poderiam estar mais visíveis.", "Não, tive dificuldade para encontrar algumas coisas."],
  },
  {
    id: 'q10',
    number: 10,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "Qual lugar você gostaria muito de conhecer algum dia?",
    description: "Pode ser uma cidade, uma praia, outro país ou qualquer lugar que esteja na sua lista de sonhos.",
  },
  {
    id: 'q11',
    number: 11,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você está utilizando o site pelo celular, computador ou tablet?",
    description: "Queremos entender como o site se comporta em diferentes dispositivos.",
    options: ["Celular.", "Computador.", "Tablet."],
  },
  {
    id: 'q12',
    number: 12,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "O que você costuma fazer quando tem um tempo livre?",
    description: "Vale qualquer coisa: sair, assistir alguma coisa, ouvir música, ler, conversar ou simplesmente descansar.",
  },
  {
    id: 'q13',
    number: 13,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você consegue navegar pelas opções do site utilizando a tecla TAB do teclado?",
    description: "A navegação por teclado é importante para pessoas que não conseguem utilizar o mouse.",
    options: ["Sim, consegui navegar.", "Consegui parcialmente.", "Não consegui.", "Não estou utilizando um teclado físico."],
  },
  {
    id: 'q14',
    number: 14,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "Qual seria um presente simples que deixaria seu dia mais feliz?",
    description: "Não precisa ser algo caro. Às vezes, um pequeno gesto pode significar muito. Fica a dica para quem estiver procurando uma boa ideia.",
  },
  {
    id: 'q15',
    number: 15,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "As perguntas e instruções apresentadas no site são fáceis de entender?",
    description: "Uma linguagem simples e direta torna a internet mais inclusiva.",
    options: ["Sim, são muito claras.", "Algumas poderiam ser mais simples.", "Não, encontrei dificuldades."],
  },
  {
    id: 'q16',
    number: 16,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "O que você mais valoriza em uma amizade?",
    description: "Pode ser uma qualidade, uma atitude ou algo que faça você se sentir bem ao lado de alguém.",
  },
  {
    id: 'q17',
    number: 17,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "As imagens e os elementos visuais do site ajudam a compreender o conteúdo?",
    description: "Os elementos visuais devem complementar as informações, e não dificultar sua compreensão.",
    options: ["Sim, ajudam bastante.", "Algumas imagens poderiam ser mais explicativas.", "Não fazem muita diferença.", "Não sei dizer."],
  },
  {
    id: 'q18',
    number: 18,
    category: 'flerte',
    type: 'open',
    required: false,
    title: "Você acredita que uma pessoa pode chamar sua atenção só com um sorriso?",
    description: "Alguns sorrisos parecem ter um efeito especial. Será que você concorda?",
  },
  {
    id: 'q19',
    number: 19,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você consegue aumentar o zoom ou ampliar os textos sem perder a facilidade de navegação?",
    description: "A possibilidade de ampliar conteúdos ajuda pessoas com baixa visão e diferentes necessidades de leitura.",
    options: ["Sim, normalmente.", "Consigo, mas alguns elementos ficam desorganizados.", "Não consegui.", "Não testei."],
  },
  {
    id: 'q20',
    number: 20,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "Existe algum hobby ou atividade que você gostaria de aprender ou experimentar?",
    description: "Pode ser algo que você sempre teve vontade de fazer, mas ainda não encontrou a oportunidade.",
  },
  {
    id: 'q21',
    number: 21,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Quando você seleciona uma opção ou preenche um campo, o site deixa claro o que aconteceu?",
    description: "Mensagens visuais e textuais ajudam o visitante a compreender suas ações.",
    options: ["Sim, tudo fica bem claro.", "Algumas ações poderiam ter indicações melhores.", "Não consegui identificar algumas alterações.", "Não sei dizer."],
  },
  {
    id: 'q22',
    number: 22,
    category: 'pessoal',
    type: 'open',
    required: false,
    title: "O que normalmente consegue melhorar seu dia quando você não está muito animada?",
    description: "Pode ser uma música, uma conversa, uma comida favorita ou até a companhia de alguém especial.",
  },
  {
    id: 'q23',
    number: 23,
    category: 'acessibilidade',
    type: 'choice',
    required: true,
    title: "Você utiliza ou já utilizou algum recurso de acessibilidade digital, como leitor de tela, ampliação de texto ou navegação por voz?",
    description: "Queremos compreender o contato dos participantes com diferentes tecnologias assistivas.",
    options: ["Sim, utilizo frequentemente.", "Já utilizei algumas vezes.", "Conheço, mas nunca utilizei.", "Nunca utilizei e não conhecia."],
  },
  {
    id: 'q24',
    number: 24,
    category: 'acessibilidade',
    type: 'open',
    required: true,
    title: "Na sua opinião, o que poderia ser melhorado neste site para torná-lo mais acessível e inclusivo?",
    description: "Esta é uma das respostas mais importantes do questionário. Fique à vontade para sugerir mudanças, apontar dificuldades ou apresentar ideias.",
  },
  {
    id: 'q25',
    number: 25,
    category: 'especial',
    type: 'open',
    required: false,
    title: "O que você acharia de alguém que criou um site inteiro só para tentar te conquistar?",
    description: "Uma pergunta especial para encerrar a experiência. Pode responder com sinceridade, sem pressão.",
  },
]

/** Original 15-question set. Kept read-only so participations sent before the update stay readable. */
export const LEGACY_QUESTIONS_V1: Question[] = [
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

export function questionsForVersion(version: number | null | undefined): Question[] {
  return version === 1 ? LEGACY_QUESTIONS_V1 : QUESTIONS
}

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
