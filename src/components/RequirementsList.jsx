import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'
import RequirementRow from './RequirementRow'

export default function RequirementsList() {
  const { state } = useAppContext()
  const t = useT()
  if (!state.requirements.length) return null
  return (
    <section className="rounded-lg border border-border-default bg-surface-card-subtle p-4 shadow-card lg:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{t('requirements.heading')}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t('requirements.count', { n: state.requirements.length })}</p>
        </div>
      </div>
      <div className="grid gap-3">
        {state.requirements.map((requirement) => <RequirementRow key={requirement.id} requirement={requirement} />)}
      </div>
    </section>
  )
}
