import { useT } from '../i18n/useT'

export default function StepIndicator() {
  const t = useT()
  const steps = [
    ['1', 'step.loadShort'],
    ['2', 'step.uploadShort'],
    ['3', 'step.matchShort'],
    ['4', 'step.generateShort'],
  ]

  return (
    <nav aria-label={t('step.load')} className="rounded-lg border border-border-default bg-white px-5 py-4 shadow-card">
      <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        {steps.map(([number, key], index) => (
          <li key={number} className="flex items-center gap-3 sm:flex-1">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              index === 0 ? 'bg-primary text-white' : 'border border-border-default bg-slate-50 text-text-muted'
            }`}>{number}</span>
            <span className={`text-sm font-medium ${index === 0 ? 'text-text-primary' : 'text-text-muted'}`}>{t(key)}</span>
            {index < steps.length - 1 && <span className="hidden h-px flex-1 bg-border-default sm:block" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
