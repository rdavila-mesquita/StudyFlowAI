import "./i18n";
import React from 'react'
import ReactDOM from 'react-dom/client'
import { PlanPage } from "./pages/Plan/PlanPage";
import SimulatorPage from "./simulator/simulatorPage";
import App from "./App";
import './index.css'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { BrowserRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/api/planos" element={<PlanPage />} />
          <Route path="/api/planos/:id" element={<PlanPage />} />
          <Route path="/api/simulados" element={<SimulatorPage />} />
          <Route path="/api/simulados/:id" element={<SimulatorPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </QueryClientProvider>
  </React.StrictMode>,
)