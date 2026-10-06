import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import en from '../i18n/en'
import bn from '../i18n/bn'

export default function Toast() {
  const { state, dispatch } = useAppContext()
  const t = useT()
  if (!state.notice) return null
  const message = state.notice.key ? t(state.notice.key, state.notice.vars) : t('toast.info')
  const otherMessage = state.notice.key
    ? (state.lang === 'bn' ? en : bn)[state.notice.key]?.replace(/\{(\w+)\}/g, (_, key) => String(state.notice.vars?.[key] ?? `{${key}}`))
    : null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-md border border-border-default bg-white p-4 shadow-raised" role="status" aria-live="polite">
      <p className="text-sm text-text-primary">{message}</p>
      {state.notice.bilingual && otherMessage && <p className="text-sm text-text-secondary">{otherMessage}</p>}
      <button type="button" onClick={() => dispatch({ type: 'NOTICE', notice: null })} className="text-xs font-semibold text-primary hover:underline">
        {t('btn.dismiss')}
      </button>
    </div>
  )
}
