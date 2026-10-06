import { useMemo, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import { hashBytes } from '../lib/hash'
import { readPdfInfo } from '../lib/pdfInfo'

const MAX_FILES = 30
const MAX_BYTES = 50 * 1024 * 1024

export default function FileUploader() {
  const { state, dispatch } = useAppContext()
  const t = useT()
  const inputRef = useRef(null)
  const [processing, setProcessing] = useState(false)
  const [alerts, setAlerts] = useState([])
  const totalBytes = useMemo(() => state.files.reduce((total, file) => total + file.size, 0), [state.files])
  const sizeMb = (totalBytes / 1024 / 1024).toFixed(1)
  const progress = Math.min((totalBytes / MAX_BYTES) * 100, 100)

  async function addFiles(fileList) {
    const incoming = Array.from(fileList ?? [])
    if (!incoming.length) return
    setProcessing(true)
    const rejected = []
    const accepted = []
    let count = state.files.length
    let bytes = totalBytes

    for (const file of incoming) {
      if (count >= MAX_FILES) {
        rejected.push({ name: file.name, reason: 'limitCount' })
        continue
      }
      if (bytes + file.size > MAX_BYTES) {
        rejected.push({ name: file.name, reason: 'limitSize' })
        continue
      }
      const info = await readPdfInfo(file)
      if (!info.ok) {
        rejected.push({ name: file.name, reason: info.reason })
        continue
      }
      accepted.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        pages: info.pages,
        hash: await hashBytes(info.bytes),
        bytes: info.bytes,
      })
      count += 1
      bytes += file.size
    }

    if (accepted.length) dispatch({ type: 'ADD_FILES', files: accepted })
    if (rejected.length) setAlerts((current) => [...current, ...rejected])
    setProcessing(false)
  }

  return (
    <section className="rounded-lg border border-border-default bg-white p-6 shadow-card">
      <input ref={inputRef} className="hidden" type="file" accept=".pdf,application/pdf" multiple onChange={(event) => addFiles(event.target.files)} />
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
        <h2 className="text-xl font-semibold">{t('step.upload')}</h2>
      </div>
      <div
        className="flex min-h-[150px] flex-col items-center justify-center rounded-md border-2 border-dashed border-border-hover bg-surface-card-subtle px-5 text-center transition hover:border-primary"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          addFiles(event.dataTransfer.files)
        }}
      >
        {processing ? (
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary" aria-live="polite">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
            {t('upload.processing')}
          </div>
        ) : (
          <>
            <span className="text-3xl text-primary" aria-hidden="true">↑</span>
            <p className="mt-2 text-sm font-medium text-text-primary">{t('upload.dropzone')}</p>
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 min-h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {t('btn.chooseFiles')}
            </button>
          </>
        )}
      </div>
      <div className="mt-4">
        <div className="flex justify-between gap-3 text-xs font-medium text-text-secondary">
          <span>{t('upload.counter', { files: state.files.length, size: sizeMb })}</span>
          <span>{t('upload.limits')}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" aria-label={t('upload.counter', { files: state.files.length, size: sizeMb })}>
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      {alerts.length > 0 && (
        <div className="mt-4 grid gap-2" aria-live="polite">
          {alerts.map((alert, index) => (
            <div key={`${alert.name}-${alert.reason}-${index}`} className="flex items-start justify-between gap-3 rounded-md border border-status-missing-border bg-status-missing-bg p-3 text-sm text-status-missing-fg" role="alert">
              <span>{t(`upload.reason.${alert.reason}`, { name: alert.name })}</span>
              <button type="button" aria-label={t('upload.dismissAlert')} onClick={() => setAlerts((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 font-semibold hover:underline">
                {t('btn.dismiss')}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
