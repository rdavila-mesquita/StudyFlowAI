export interface Alternative {
  letter: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: number
  title: string
  context: string
  alternatives: Alternative[]
  discipline: string
  language: string
  year: number
}