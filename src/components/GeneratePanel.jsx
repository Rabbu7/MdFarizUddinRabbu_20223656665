import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import { getBlockingList } from '../lib/status'

export default function GeneratePanel() {
  const { state } = useAppContext()
  const t = useT()
  const blocking = useMemo(
    () => getBlockingList(state.requirements, state.matches, state.expiry, state.tender?.submission_deadline),
    [state.requirements, state.matches, state.expiry, state.tender?.submission_deadline],
  )
  const disabled = blocking.length > 0 || !state.requirements.length

  function jumpTo(requirementId) {
    const element = document.getElementById(`requirement-${requirementId}`)
    if (!element) return
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.classList.add('ring-2', 'ring-primary', 'ring-offset-2')
    window.setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 1600)
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
        <button type="button" disabled={disabled} className="min-h-12 rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          {t('btn.generate')}
        </button>
      </div>
    </section>
  )
}
