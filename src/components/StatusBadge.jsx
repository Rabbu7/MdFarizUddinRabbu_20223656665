import { useT } from '../i18n/useT'

const variants = {
  missing: ['✕', 'bg-status-missing-bg text-status-missing-fg border-status-missing-border'],
  expiryNeeded: ['◷', 'bg-status-date-needed-bg text-status-date-needed-fg border-status-date-needed-border'],
  expired: ['◴', 'bg-status-expired-bg text-status-expired-fg border-status-expired-border'],
  notProvided: ['—', 'bg-status-not-provided-bg text-status-not-provided-fg border-status-not-provided-border'],
  ok: ['✓', 'bg-status-ok-bg text-status-ok-fg border-status-ok-border'],
}

export default function StatusBadge({ status }) {
  const t = useT()
  const [icon, classes] = variants[status] ?? variants.notProvided
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold ${classes}`}>
      <span aria-hidden="true">{icon}</span>
      <span>{t(`status.${status}`)}</span>
    </span>
  )
}
