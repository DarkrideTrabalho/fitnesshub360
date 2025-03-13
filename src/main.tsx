
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SettingsProvider } from './contexts/SettingsContext.tsx'
import { TranslationProvider } from './contexts/TranslationContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TranslationProvider>
            <App />
            <Toaster position="top-right" />
          </TranslationProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
