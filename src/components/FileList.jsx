import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import { groupDuplicates } from '../lib/hash'
import FileItem from './FileItem'

export default function FileList() {
  const { state } = useAppContext()
  const t = useT()
  const duplicateGroups = useMemo(() => groupDuplicates(state.files), [state.files])
  return (
    <section className="rounded-lg border border-border-default bg-surface-card-subtle p-4 shadow-card lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('upload.filesHeading')}</h2>
        <span className="text-sm text-text-muted">{state.files.length}</span>
      </div>
      {!state.files.length ? (
        <p className="rounded-md border border-dashed border-border-hover bg-white p-5 text-sm text-text-muted">{t('upload.noFiles')}</p>
      ) : (
        <div className="grid gap-3">
          {state.files.map((file) => {
            const group = duplicateGroups.get(file.hash)
            const duplicateOf = group?.find((member) => member.id !== file.id)
            return <FileItem key={file.id} file={file} duplicateOf={duplicateOf} />
          })}
        </div>
      )}
    </section>
  )
}
