import { useT } from '../i18n/useT'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  const t = useT()
  return (
    <header className="h-16 border-b border-border-default bg-white">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-lg text-white" aria-hidden="true">▣</span>
          <div>
            <p className="text-base font-semibold text-text-primary">{t('app.title')}</p>
            <p className="hidden text-xs text-text-muted sm:block">{t('app.subtitle')}</p>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  )
}
