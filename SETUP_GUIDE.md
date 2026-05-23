# StudyFlowAI — Setup Guide

## Visão geral

StudyFlowAI é uma aplicação de planejamento de estudos com IA. O usuário preenche um formulário com disciplina, conteúdo, nível, data da prova e horas disponíveis por dia. A IA gera um plano personalizado com tópicos, dicas e cronograma de revisão espaçada, exibido em cards e calendário interativo.

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Backend StudyFlowAI rodando | `http://localhost:8000` |

---

## Estrutura do projeto

```
StudyFlowAI/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── planApi.ts           # funções de fetch para o backend
│   ├── components/
│   │   └── ui/
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── datepicker.tsx   # date picker com linguagem natural
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── plan-calendar.tsx  # calendário com marcadores de estudo
│   │       ├── radio-group.tsx
│   │       ├── scheduleOverview.tsx  # cards de cronograma
│   │       └── ...
│   ├── hooks/
│   │   ├── usePlan.tsx          # geração do plano
│   │   ├── usePlanById.ts       # busca plano por ID
│   │   └── useAllPlans.ts       # lista todos os planos
│   ├── locales/
│   │   ├── en.json              # traduções em inglês
│   │   └── pt.json              # traduções em português
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.tsx         # formulário de geração
│   │   │   └── Home.css
│   │   ├── Plan/
│   │   │   ├── PlanPage.tsx     # exibição do plano gerado
│   │   │   └── PlanPage.css
│   │   └── Analytics/
│   │       └── studyPerformance.tsx
│   ├── service/
│   │   └── api.ts               # instância do axios
│   ├── simulator/
│   │   ├── api/
│   │   │   └── enemApi.ts       # integração com api.enem.dev
│   │   ├── hooks/
│   │   │   └── useQuestion.ts
│   │   ├── services/
│   │   │   └── getQuestions.ts
│   │   ├── types/
│   │   │   └── question.ts
│   │   └── simulatorPage.tsx
│   ├── types/
│   │   └── study.ts             # interfaces TypeScript do domínio
│   ├── i18n.ts                  # configuração do i18next
│   ├── main.tsx                 # entry point com rotas
│   └── index.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Instalação

```bash
# 1. Clone ou extraia o projeto
cd StudyFlowAI

# 2. Instale as dependências
npm install
```

---


> Se o backend estiver em outro endereço ou porta, ajuste o valor aqui.  
> O frontend usa `http://localhost:8000` como fallback caso a variável não exista.

---

## Rodando em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> O backend precisa estar rodando antes de gerar um plano. Veja a seção [Backend](#backend).

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `/dist` |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint no projeto |

---

## Rotas da aplicação

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Home.tsx` | Formulário de geração do plano |
| `/plan` | `PlanPage.tsx` | Exibe o plano recém-gerado (via `navigate` state) |
| `/plans/:id` | `PlanPage.tsx` | Busca e exibe um plano salvo por ID |

---

## Backend

O frontend consome uma API FastAPI. Certifique-se de que o backend está rodando com CORS configurado para `http://localhost:5173`.

### Endpoints consumidos

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/generate-plan` | Gera e salva um novo plano |
| `GET` | `/plans/:id` | Busca um plano salvo por ID |
| `GET` | `/plans` | Lista todos os planos salvos |

### Payload do POST `/generate-plan`

```json
{
  "discipline": "Arquitetura de Software",
  "subject": "MVC",
  "level": "advanced",
  "exam_date": "2026-06-01",
  "hours_per_day": 2
}
```

O campo `level` aceita: `"beginner"`, `"intermediate"` ou `"advanced"`.

---

## Dependências principais

| Pacote | Uso |
|---|---|
| `react` + `react-dom` | Framework UI |
| `react-router-dom` | Navegação entre páginas |
| `@tanstack/react-query` | Cache e gerenciamento de estado remoto |
| `axios` | Requisições HTTP |
| `tailwindcss` | Estilização |
| `shadcn` + `radix-ui` | Componentes de UI acessíveis |
| `react-day-picker` | Calendário |
| `chrono-node` | Parsing de datas em linguagem natural |
| `date-fns` | Formatação de datas |
| `react-i18next` + `i18next` | Internacionalização (pt/en) |
| `sonner` | Notificações toast |
| `lucide-react` | Ícones |
| `recharts` | Gráficos (Analytics) |
| `zod` + `react-hook-form` | Validação de formulários |

---

## Internacionalização

O idioma padrão é **português (`pt`)**. Os arquivos de tradução ficam em `src/locales/`:

```
src/locales/
├── pt.json   # rótulos em português
└── en.json   # rótulos em inglês (fallback)
```

> Os valores retornados pela IA (títulos dos tópicos, descrições) já vêm em português porque o prompt instrui o modelo nesse contexto. As traduções cobrem apenas os rótulos estáticos da interface.

Para trocar o idioma em runtime:

```typescript
import i18n from "./i18n";
i18n.changeLanguage("en");
```

---

## Simulador de questões

O projeto inclui um módulo de simulado integrado à [API pública do ENEM](https://api.enem.dev/v1). O código fica em `src/simulator/` e pode ser acessado após concluir todos os tópicos do plano ou pelo botão "Fazer Simulado" nos cards de revisão.

---

## Build de produção

```bash
npm run build
```

Os arquivos gerados ficam em `/dist`. Para visualizar localmente antes de fazer deploy:

```bash
npm run preview
```

---

## Problemas comuns

**Erro de CORS ao chamar o backend**  
Verifique se o backend tem o middleware de CORS configurado com `allow_origins=["http://localhost:5173"]`.

**Plano não carrega ao acessar `/plans/:id` diretamente**  
Certifique-se de que o backend está rodando e o `id` informado existe no banco. O frontend redireciona para `/` automaticamente se o plano não for encontrado.
