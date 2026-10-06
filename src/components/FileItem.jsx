import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'

export default function FileItem({ file, duplicateOf }) {
  const { state, dispatch } = useAppContext()
  const t = useT()
  const matchedRequirement = Object.entries(state.matches).find(([, fileId]) => fileId === file.id)?.[0]
  const requirement = state.requirements.find((item) => item.id === matchedRequirement)
  const size = `${(file.size / 1024 / 1024).toFixed(1)} MB`
  return (
    <article className={`rounded-md border p-3 shadow-card ${duplicateOf ? 'border-status-duplicate-border bg-amber-50' : 'border-border-default bg-white'}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50 text-xs font-bold text-red-600" aria-hidden="true">PDF</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary" title={file.name}>{file.name}</p>
          <p className="mt-1 text-xs text-text-secondary">{t('file.pages', { n: file.pages })} • {size}</p>
          <p className="mt-2 text-xs text-text-muted">
            {requirement ? t('upload.matchedTo', { title: state.lang === 'bn' ? requirement.title_bn : requirement.title_en }) : t('file.notMatched')}
          </p>
          {duplicateOf && <span className="mt-2 inline-flex rounded-full border border-status-duplicate-border bg-status-duplicate-bg px-2.5 py-1 text-xs font-semibold text-status-duplicate-fg">{t('upload.duplicate', { name: duplicateOf.name })}</span>}
        </div>
        <button type="button" aria-label={t('upload.remove', { name: file.name })} onClick={() => dispatch({ type: 'REMOVE_FILE', fileId: file.id })} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span aria-hidden="true">⌫</span>
        </button>
      </div>
    </article>
  )
}
