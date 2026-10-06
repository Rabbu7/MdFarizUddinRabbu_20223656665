import { AppProvider } from './context/AppContext'
import { useT } from './i18n/useT'
import Header from './components/Header'
import StepIndicator from './components/StepIndicator'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'

function EmptyWorkspace() {
  const t = useT()
  const cardBase = 'rounded-lg border border-border-default bg-surface-card p-6 shadow-card'
  const actionButton =
    'inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

  return (
    <main className="min-h-screen bg-surface-bg text-text-primary">
      <Header />
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
        <div className="mb-8">
          <StepIndicator />
        </div>
        <section className={cardBase}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
                <span className="text-sm font-semibold text-primary">{t('step.loadShort')}</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-[-0.01em] text-text-primary">{t('empty.loadTitle')}</h1>
              <p className="mt-2 text-base leading-6 text-text-secondary">{t('empty.loadHint')}</p>
            </div>
            <button type="button" className={actionButton}>
              <span className="mr-2 text-lg" aria-hidden="true">＋</span>
              {t('btn.loadJson')}
            </button>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className={`${cardBase} min-h-[246px]`}>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
              <span className="text-sm font-semibold text-primary">{t('step.uploadShort')}</span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">{t('empty.uploadTitle')}</h2>
            <p className="mt-2 max-w-xl text-sm leading-5 text-text-secondary">{t('empty.uploadHint')}</p>
            <div className="mt-6 flex min-h-[120px] flex-col items-center justify-center rounded-md border-2 border-dashed border-border-hover bg-surface-card-subtle px-5 text-center">
              <span className="text-3xl text-primary" aria-hidden="true">↑</span>
              <p className="mt-2 text-sm font-medium text-text-primary">{t('upload.dropzone')}</p>
              <p className="mt-1 text-xs text-text-muted">{t('upload.limits')}</p>
            </div>
          </section>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <section className={`${cardBase} min-h-[110px] border-dashed bg-slate-50/70 opacity-75`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg text-text-muted" aria-hidden="true">▣</span>
                <div>
                  <h2 className="text-base font-semibold text-text-secondary">{t('empty.lockedTitle')}</h2>
                  <p className="mt-1 text-sm leading-5 text-text-muted">{t('empty.lockedHint')}</p>
                </div>
              </div>
            </section>
            <section className={`${cardBase} min-h-[110px] border-dashed bg-slate-50/70 opacity-75`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg text-text-muted" aria-hidden="true">▣</span>
                <div>
                  <h2 className="text-base font-semibold text-text-secondary">{t('empty.lockedGenerate')}</h2>
                  <p className="mt-1 text-sm leading-5 text-text-muted">{t('empty.lockedGenerateHint')}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Toast />
    </main>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <EmptyWorkspace />
      </AppProvider>
    </ErrorBoundary>
  )
}
