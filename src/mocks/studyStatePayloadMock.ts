export const mockStudyStatePayload = {
  session_id: "abc123",
  user_name: "Victor",
  study_goal: "Aprender LangGraph e FastAPI",
  available_time_hours: 4,
  study_days_per_week: 5,

  subjects: [
    "LangGraph",
    "FastAPI",
    "Python",
    "APIs REST"
  ],

  priority_subjects: [
    "LangGraph",
    "FastAPI"
  ],

  learning_preferences: {
    preferencia: "aprendizado_pratico",
    gosta_de_projetos: true,
    tempo_estudo_noite: true
  },

  constraints: {
    max_horas_por_dia: 4,
    dias_indisponiveis: ["domingo"]
  },

  current_plan: {
    segunda: "Estudar conceitos de State e Nodes",
    terca: "Criar APIs com FastAPI",
    quarta: "Implementar grafos no LangGraph",
    quinta: "Praticar integração com Ollama",
    sexta: "Desenvolver workflow completo"
  },

  replanning_reason: "Dificuldade em entender tool calling",

  simulation_input: {
    quantidade_questoes: 10,
    tempo_limite_minutos: 30
  },

  // Notas explícitas adicionadas
  simulation_output: {
    notas: [7.0, 8.5, 6.0],
    media: 7.17, // média consistente com `notas` (arredondada)
    acertos: 8,
    erros: 2,
    tempo_medio_resposta: "2 minutos"
  },

  analysis_output: {
    pontos_fortes: [
      "Criação de APIs",
      "Estruturação de workflows"
    ],
    pontos_fracos: [
      "Tool Calling",
      "Gerenciamento de estado"
    ],
    frequencia_estudos: 85
  },

  report_data: {},
  report_text: "",

  metadata: {}
};
