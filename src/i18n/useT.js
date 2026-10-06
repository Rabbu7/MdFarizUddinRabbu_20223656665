import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import en from './en'
import bn from './bn'

export function useT() {
  const { state } = useAppContext()
  return useCallback(
    (key, vars = {}) => {
      const dictionary = state.lang === 'bn' ? bn : en
      const template = dictionary[key] ?? en[key] ?? key
      return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`))
    },
    [state.lang],
  )
}
