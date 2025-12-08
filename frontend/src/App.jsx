import React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import DemoPage from './components/DemoPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.15)',
    '0px 16px 32px rgba(0,0,0,0.15)',
    ...Array(19).fill('0px 0px 0px rgba(0,0,0,0)'),
  ],
})

function App() {

  try {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DemoPage />
        {/* Chatbot widget will be loaded via vanilla JS */}
        <div id="chatbot-widget-container"></div>
      </ThemeProvider>
    )
  } catch (error) {
    console.error('App rendering error:', error)
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error Loading App</h1>
        <p>{error.message}</p>
      </div>
    )
  }
}

export default App

