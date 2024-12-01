import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { ThemeProvider } from './components/providers/theme-provider'
import App from './app'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './components/providers/auth-provider'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark'>
    <AuthProvider>
      <App />
    </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
