import { AppProvider } from './context/AppContext'
import { useAppContext } from './context/AppContext'
import { useT } from './i18n/useT'
import Header from './components/Header'
import StepIndicator from './components/StepIndicator'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import TenderInfo from './components/TenderInfo'
import RequirementsList from './components/RequirementsList'
import FileUploader from './components/FileUploader'
import FileList from './components/FileList'
import SummaryBar from './components/SummaryBar'
import GeneratePanel from './components/GeneratePanel'

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
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {state.tender ? <RequirementsList /> : (
              <section className="rounded-lg border border-dashed border-border-default bg-slate-50/70 p-6 opacity-75 shadow-card">
                <h2 className="text-xl font-semibold text-text-secondary">{t('empty.lockedTitle')}</h2>
                <p className="mt-2 text-sm leading-5 text-text-muted">{t('empty.lockedHint')}</p>
              </section>
            )}
          </div>
          <div className="grid gap-6">
            <FileUploader />
            <FileList />
          </div>
        </div>
        {state.tender && (
          <div className="mt-6 grid gap-6">
            <SummaryBar />
            <GeneratePanel />
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
