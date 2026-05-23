import { useQuery } from '@tanstack/react-query'
import { getQuestions } from '../services/getQuestions'
import type { Question } from '../types/question'

export function useQuestions(year: number) {
  return useQuery<Question[]>({
    queryKey: ['questions', year],
    queryFn: () => getQuestions(year),
  })
}