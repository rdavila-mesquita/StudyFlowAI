# StudyFlowAI

Assistente inteligente de planejamento de estudos. Informe a disciplina, o conteúdo, seu nível e a data da prova — a IA monta um plano personalizado com tópicos, dicas, objetivos de aprendizagem e um cronograma de revisão espaçada.

---

## Funcionalidades

- **Geração de plano com IA** — plano estruturado em tópicos progressivos, com dificuldade calibrada ao seu nível
- **Cronograma automático** — distribui os tópicos nos dias disponíveis e agenda revisões em D+1, D+7 e D+14
- **Calendário interativo** — visualize seus dias de estudo e revisão no calendário
- **Progresso por tópico** — marque tópicos como concluídos e acompanhe seu avanço com barra de progresso
- **Simulado** — ao concluir todos os tópicos, faça um simulado com questões reais do ENEM
- **Busca de planos salvos** — todos os planos são salvos e acessíveis pelo link `api/planos/:id`

---

## Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui + Radix UI
- TanStack Query
- React Router DOM v7
- i18next (pt/en)
- Sonner (toasts)
- Recharts (analytics)

---

## Pré-requisitos

- Node.js 18+
- Backend StudyFlowAI rodando em `http://localhost:8000`

---

## Instalação

```bash
# instale as dependências
npm install

---

## Rodando

```bash
npm run dev
```

Acesse `http://localhost:5173`.

---

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Formulário de geração do plano |
| `/api/planos` | Plano recém-gerado |
| `/api/planos/:id` | Plano salvo por ID |

---

## Estrutura

```
src/
├── api/          # chamadas ao backend
├── components/   # componentes reutilizáveis
├── hooks/        # usePlan, usePlanById, useAllPlans
├── locales/      # traduções pt/en
├── pages/        # Home, Plan, Analytics
├── service/      # instância do axios
├── simulator/    # integração com api.enem.dev
└── types/        # interfaces TypeScript
```

---

## Scripts

```bash
npm run dev       # desenvolvimento
npm run build     # build de produção
npm run preview   # preview do build
npm run lint      # linting
```

---

## Documentação

Consulte o [SETUP_GUIDE.md](./SETUP_GUIDE.md) para instruções detalhadas de configuração, variáveis de ambiente, endpoints do backend e solução de problemas comuns.
