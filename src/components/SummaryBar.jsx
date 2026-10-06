import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import { getStatusCounts } from '../lib/status'
import { groupDuplicates } from '../lib/hash'
import { buildChecklistCsv, downloadChecklistCsv } from '../lib/exportChecklist'

export default function SummaryBar() {
  const { state } = useAppContext()
  const t = useT()
  const statusLabels = useMemo(
    () => Object.fromEntries(['missing', 'expiryNeeded', 'expired', 'notProvided', 'ok'].map((status) => [status, t(`status.${status}`)])),
    [t],
  )
  const counts = useMemo(
    () => getStatusCounts(state.requirements, state.matches, state.expiry, state.tender?.submission_deadline),
    [state.requirements, state.matches, state.expiry, state.tender?.submission_deadline],
  )
  const duplicateCount = useMemo(() => [...groupDuplicates(state.files).values()].reduce((total, group) => total + group.length, 0), [state.files])
  const problems = counts.missing + counts.expiryNeeded + counts.expired
  const chips = [
    ['ok', counts.ok],
    ['missing', counts.missing],
    ['expired', counts.expired],
    ['expiryNeeded', counts.expiryNeeded],
    ['notProvided', counts.notProvided],
  ]

  function exportChecklist() {
    const csv = buildChecklistCsv({
      tender: state.tender,
      requirements: state.requirements,
      files: state.files,
      matches: state.matches,
      expiry: state.expiry,
      labels: {
        document: t('checklist.document'),
        fileName: t('checklist.fileName'),
        pages: t('checklist.pages'),
        expiryDate: t('checklist.expiryDate'),
        status: t('checklist.status'),
        statusValues: statusLabels,
      },
    })
    downloadChecklistCsv({ csv, tenderId: state.tender.tender_id })
  }

  return (
    <section className="rounded-lg border border-border-default bg-white p-4 shadow-action lg:p-5" aria-live="polite">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-text-secondary">{t('summary.statuses')}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chips.map(([status, count]) => (
              <span key={status} className="rounded-full border border-border-default bg-slate-50 px-3 py-1 text-xs font-semibold text-text-secondary">
                {t(`status.${status}`)} {count}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span>{t('summary.totalRequirements', { n: state.requirements.length })}</span>
            <span>{t('summary.totalFiles', { n: state.files.length })}</span>
            <span>{t('summary.totalDuplicates', { n: duplicateCount })}</span>
            <button
              type="button"
              onClick={exportChecklist}
              className="min-h-10 rounded-md border border-primary px-3 text-sm font-semibold text-primary hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('btn.exportChecklist')}
            </button>
          </div>
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-semibold ${problems ? 'bg-status-missing-bg text-status-missing-fg' : 'bg-status-ok-bg text-status-ok-fg'}`}>
          {problems ? t('summary.notReady', { n: problems }) : t('summary.ready')}
        </div>
      </div>
    </section>
  )
}
