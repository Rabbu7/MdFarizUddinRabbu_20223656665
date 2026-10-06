import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'

export default function MatchSelect({ requirement }) {
  const { state, dispatch } = useAppContext()
  const t = useT()
  const duplicateHashes = useMemo(() => {
    const counts = new Map()
    state.files.forEach((file) => counts.set(file.hash, (counts.get(file.hash) ?? 0) + 1))
    return counts
  }, [state.files])
  const currentFileId = state.matches[requirement.id] ?? ''

  function matchedRequirementFor(fileId) {
    const entry = Object.entries(state.matches).find(
      ([requirementId, matchedId]) => matchedId === fileId && requirementId !== requirement.id,
    )
    return entry ? state.requirements.find((item) => item.id === entry[0]) : null
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text-secondary">{t('match.label')}</span>
      <select
        value={currentFileId}
        onChange={(event) => dispatch({
          type: event.target.value ? 'SET_MATCH' : 'CLEAR_MATCH',
          requirementId: requirement.id,
          fileId: event.target.value,
        })}
        className="h-10 w-full rounded-md border border-border-hover bg-white px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <option value="">{t('match.noFile')}</option>
        {state.files.map((file) => {
          const usedBy = matchedRequirementFor(file.id)
          const duplicateUsed = duplicateHashes.get(file.hash) > 1 && state.files.some(
            (candidate) => candidate.id !== file.id && candidate.hash === file.hash && matchedRequirementFor(candidate.id),
          )
          const disabled = Boolean(usedBy || (duplicateUsed && file.id !== currentFileId))
          let label = `${file.name} (${t('file.pages', { n: file.pages })})`
          if (usedBy) label += ` ${t('match.usedFor', { title: state.lang === 'bn' ? usedBy.title_bn : usedBy.title_en })}`
          else if (duplicateUsed && file.id !== currentFileId) label += ` ${t('match.duplicateUsed')}`
          return <option key={file.id} value={file.id} disabled={disabled}>{label}</option>
        })}
      </select>
    </label>
  )
}
