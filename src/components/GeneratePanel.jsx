import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import { getBlockingList } from '../lib/status'
import { buildPackage } from '../lib/buildPackage'

export default function GeneratePanel() {
  const { state, dispatch } = useAppContext()
  const t = useT()
  const [result, setResult] = useState(null)
  const blocking = useMemo(
    () => getBlockingList(state.requirements, state.matches, state.expiry, state.tender?.submission_deadline),
    [state.requirements, state.matches, state.expiry, state.tender?.submission_deadline],
  )
  const disabled = blocking.length > 0 || !state.requirements.length

  useEffect(() => {
    setResult(null)
  }, [state.tender, state.requirements, state.files, state.matches, state.expiry])

  function jumpTo(requirementId) {
    const element = document.getElementById(`requirement-${requirementId}`)
    if (!element) return
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.classList.add('ring-2', 'ring-primary', 'ring-offset-2')
    window.setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 1600)
  }

  async function generate() {
    if (disabled || state.generating) return
    dispatch({ type: 'SET_GENERATING', value: true })
    try {
      const packageResult = await buildPackage({
        tender: state.tender,
        requirements: state.requirements,
        files: state.files,
        matches: state.matches,
      })
      setResult(packageResult)
    } catch {
      dispatch({
        type: 'NOTICE',
        notice: { type: 'error', key: 'err.generate', vars: {}, bilingual: true },
      })
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false })
    }
  }

  function download() {
    if (!result || !state.tender) return
    const blob = new Blob([result.bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${state.tender.tender_id}_Package.pdf`
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <section className="rounded-lg border border-border-default bg-white p-5 shadow-card lg:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-text-secondary">4</span>
            <h2 className="text-xl font-semibold">{t('step.generate')}</h2>
          </div>
          {blocking.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-status-missing-fg">{t('generate.fix')}</p>
              <ul className="mt-2 grid gap-1">
                {blocking.map(({ requirement, status }) => (
                  <li key={requirement.id}>
                    <button type="button" onClick={() => jumpTo(requirement.id)} className="text-left text-sm text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      {t('generate.problem', {
                        order: requirement.order,
                        title: state.lang === 'bn' ? requirement.title_bn : requirement.title_en,
                        status: t(`status.${status}`),
                      })}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">{t('generate.readyHint')}</p>
          )}
        </div>
        <button type="button" disabled={disabled || state.generating} onClick={generate} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          {state.generating && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />}
          {state.generating ? t('generate.working') : t('btn.generate')}
        </button>
      </div>
      {result && (
        <div className="mt-6 rounded-lg border border-status-ok-border bg-status-ok-bg p-5" aria-live="polite">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-ok-fg text-xl text-white" aria-hidden="true">✓</span>
              <div>
                <h3 className="text-base font-semibold text-status-ok-fg">{t('download.ready')}</h3>
                <p className="mt-1 text-sm text-text-secondary">{state.tender.tender_id}_Package.pdf • {t('download.pages', { n: result.totalPages })}</p>
              </div>
            </div>
            <button type="button" onClick={download} className="min-h-11 rounded-md bg-status-ok-fg px-5 text-sm font-semibold text-white hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {t('btn.download')}
            </button>
          </div>
          <button type="button" onClick={() => setResult(null)} className="mt-4 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            {t('download.generateAgain')}
          </button>
        </div>
      )}
    </section>
  )
}
