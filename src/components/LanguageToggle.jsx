import { useAppContext } from '../context/AppContext'
import { useT } from '../i18n/useT'

export default function LanguageToggle() {
  const { state, dispatch } = useAppContext()
  const t = useT()

  return (
    <div className="flex rounded-md bg-slate-100 p-1" role="group" aria-label={`${t('lang.english')} | ${t('lang.bangla')}`}>
      {['en', 'bn'].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => dispatch({ type: 'SET_LANG', lang })}
          className={`min-h-8 rounded px-3 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
            state.lang === lang ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-slate-200'
          }`}
          aria-pressed={state.lang === lang}
        >
          {lang === 'en' ? t('lang.english') : t('lang.bangla')}
        </button>
      ))}
    </div>
  )
}
