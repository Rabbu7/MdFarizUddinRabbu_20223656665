import { useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import en from '../i18n/en'
import bn from '../i18n/bn'
import { isDateString } from '../lib/dates'

const requiredFields = ['id', 'order', 'title_en', 'title_bn', 'mandatory', 'has_expiry']

function validateRequirementsFile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'err.jsonNotObject'
  if (!value.tender || typeof value.tender !== 'object' || Array.isArray(value.tender)) return 'err.missingTender'
  const tenderFields = ['tender_id', 'title', 'procuring_entity', 'bidder', 'submission_deadline']
  if (
    tenderFields.some((field) => typeof value.tender[field] !== 'string' || !value.tender[field].trim()) ||
    !isDateString(value.tender.submission_deadline)
  ) return 'err.invalidTender'
  if (!Array.isArray(value.requirements) || value.requirements.length === 0) return 'err.emptyRequirements'
  const invalidIndex = value.requirements.findIndex(
    (requirement) =>
      !requirement ||
      typeof requirement !== 'object' ||
      requiredFields.some((field) => !Object.prototype.hasOwnProperty.call(requirement, field)),
  )
  return invalidIndex === -1 ? null : { key: 'err.invalidRequirement', vars: { n: invalidIndex + 1 } }
}

export default function TenderInfo() {
  const { state, dispatch } = useAppContext()
  const t = useT()
  const inputRef = useRef(null)
  const [error, setError] = useState(null)

  async function loadFile(file) {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      const validation = validateRequirementsFile(parsed)
      if (validation) {
        setError(typeof validation === 'string' ? { key: validation, vars: {} } : validation)
        return
      }
      setError(null)
      dispatch({ type: 'LOAD_TENDER', tender: parsed.tender, requirements: parsed.requirements })
    } catch {
      setError({ key: 'err.badJson', vars: {} })
    }
  }

  function onDrop(event) {
    event.preventDefault()
    loadFile(event.dataTransfer.files?.[0])
  }

  if (!state.tender) {
    return (
      <section
        className="rounded-lg border border-border-default bg-white p-6 shadow-card"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <input ref={inputRef} className="hidden" type="file" accept=".json,application/json" onChange={(event) => loadFile(event.target.files?.[0])} />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
              <span className="text-sm font-semibold text-primary">{t('step.loadShort')}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.01em]">{t('empty.loadTitle')}</h1>
            <p className="mt-2 text-base text-text-secondary">{t('empty.loadHint')}</p>
          </div>
          <button type="button" onClick={() => inputRef.current?.click()} className="min-h-12 rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <span className="mr-2" aria-hidden="true">＋</span>{t('btn.loadJson')}
          </button>
        </div>
        {error && <BilingualAlert error={error} />}
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-border-default bg-white p-6 shadow-card">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
          <h1 className="text-xl font-semibold">{t('step.load')}</h1>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} className="text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {t('btn.loadDifferent')}
        </button>
      </div>
      <input ref={inputRef} className="hidden" type="file" accept=".json,application/json" onChange={(event) => loadFile(event.target.files?.[0])} />
      {error && <BilingualAlert error={error} />}
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['tender.id', state.tender.tender_id],
          ['tender.title', state.tender.title],
          ['tender.entity', state.tender.procuring_entity],
          ['tender.bidder', state.tender.bidder],
          ['tender.deadline', state.tender.submission_deadline],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-surface-card-subtle p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">{t(label)}</dt>
            <dd className="mt-1 text-sm font-medium text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function BilingualAlert({ error }) {
  const t = useT()
  const reasonEn = en[error.key] ?? en['err.generic']
  const reasonBn = bn[error.key] ?? bn['err.generic']
  const vars = error.vars ?? {}
  const fill = (message) => message.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
  return (
    <div className="mt-5 rounded-md border border-status-missing-border bg-status-missing-bg p-4 text-sm text-status-missing-fg" role="alert">
      <p className="font-semibold">{t('alert.invalidJson', { reason: fill(reasonEn) })}</p>
      <p className="mt-1">{fill(reasonBn)}</p>
    </div>
  )
}
