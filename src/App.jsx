import { AppProvider } from './context/AppContext'
import { useAppContext } from './context/AppContext'
import { useT } from './i18n/useT'
import Header from './components/Header'
import StepIndicator from './components/StepIndicator'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import TenderInfo from './components/TenderInfo'
import RequirementsList from './components/RequirementsList'

function Workspace() {
  const { state } = useAppContext()
  const t = useT()

  return (
    <main className="min-h-screen bg-surface-bg text-text-primary">
      <Header />
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
        <div className="mb-6">
          <StepIndicator />
        </div>
        <TenderInfo />
        {state.tender ? (
          <div className="mt-6 lg:w-[60%]">
            <RequirementsList />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="min-h-[246px] rounded-lg border border-border-default bg-white p-6 shadow-card">
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
              {[['empty.lockedTitle', 'empty.lockedHint'], ['empty.lockedGenerate', 'empty.lockedGenerateHint']].map(([title, hint]) => (
                <section key={title} className="min-h-[110px] rounded-lg border border-dashed border-border-default bg-slate-50/70 p-6 opacity-75 shadow-card">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg text-text-muted" aria-hidden="true">▣</span>
                    <div>
                      <h2 className="text-base font-semibold text-text-secondary">{t(title)}</h2>
                      <p className="mt-1 text-sm leading-5 text-text-muted">{t(hint)}</p>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
      <Toast />
    </main>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Workspace />
      </AppProvider>
    </ErrorBoundary>
  )
}
