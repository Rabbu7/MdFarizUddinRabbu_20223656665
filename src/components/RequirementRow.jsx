import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import StatusBadge from './StatusBadge'
import { getStatus } from '../lib/status'

export default function RequirementRow({ requirement }) {
  const { state } = useAppContext()
  const t = useT()
  const status = getStatus(
    requirement,
    Boolean(state.matches[requirement.id]),
    state.expiry[requirement.id],
    state.tender?.submission_deadline,
  )
  return (
    <article className={`rounded-md border border-border-default bg-white p-4 shadow-card ${status === 'missing' ? 'border-l-4 border-l-status-missing-border' : ''}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-text-secondary">{requirement.order}</span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-text-primary">{state.lang === 'bn' ? requirement.title_bn : requirement.title_en}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${requirement.mandatory ? 'bg-text-primary text-white' : 'border border-border-hover text-text-secondary'}`}>
                {t(requirement.mandatory ? 'req.mandatory' : 'req.optional')}
              </span>
              {requirement.has_expiry && <span className="text-xs text-text-muted">◷ {t('req.hasExpiry')}</span>}
            </div>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="mt-4 border-t border-border-default pt-3 text-sm text-text-muted">{t('requirements.matchingSoon')}</p>
    </article>
  )
}
