import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'

export default function ExpiryInput({ requirement }) {
  const { state, dispatch } = useAppContext()
  const t = useT()
  const deadline = state.tender?.submission_deadline ?? ''
  return (
    <label className="mt-4 block max-w-sm">
      <span className="mb-2 block text-sm font-medium text-text-secondary">{t('expiry.label')}</span>
      <input
        type="date"
        value={state.expiry[requirement.id] ?? ''}
        onChange={(event) => dispatch({ type: 'SET_EXPIRY', requirementId: requirement.id, value: event.target.value })}
        className="h-10 w-full rounded-md border border-border-hover bg-white px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      />
      <span className="mt-1 block text-xs text-text-muted">{t('expiry.hint', { date: deadline })}</span>
    </label>
  )
}
