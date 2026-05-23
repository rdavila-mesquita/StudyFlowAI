import { enemApi } from '../api/enemApi'
import type { Question } from '../types/question'

export async function getQuestions(year: number): Promise<Question[]> {
  const response = await enemApi.get(`/exams/${year}/questions`)

  return response.data.questions
}