'use client'

import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function ToastProvider() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemTheme = prefersDark ? 'dark' : 'light'
    setTheme(systemTheme)

    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener)
    }
  }, [])

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
    />
  )
}
