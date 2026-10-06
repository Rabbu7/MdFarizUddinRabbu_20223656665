import { Component } from 'react'
import en from '../i18n/en'
import bn from '../i18n/bn'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    const language = localStorage.getItem('lang') === 'bn' ? bn : en
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-bg p-6 text-center text-text-primary">
        <section className="max-w-md rounded-lg border border-border-default bg-white p-8 shadow-card">
          <h1 className="text-xl font-semibold">{language['errorBoundary.title']}</h1>
          <p className="mt-2 text-sm text-text-secondary">{language['errorBoundary.message']}</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            {language['btn.reload']}
          </button>
        </section>
      </main>
    )
  }
}
