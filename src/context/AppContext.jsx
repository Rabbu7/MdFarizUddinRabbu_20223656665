import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const initialState = {
  lang: localStorage.getItem('lang') === 'bn' ? 'bn' : 'en',
  tender: null,
  requirements: [],
  files: [],
  matches: {},
  expiry: {},
  generating: false,
  notice: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LANG':
      return { ...state, lang: action.lang === 'bn' ? 'bn' : 'en' }
    case 'LOAD_TENDER':
      return {
        ...state,
        tender: action.tender,
        requirements: [...action.requirements].sort((a, b) => a.order - b.order),
        matches: {},
        expiry: {},
        notice: null,
      }
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...action.files] }
    case 'REMOVE_FILE': {
      const matches = Object.fromEntries(
        Object.entries(state.matches).filter(([, fileId]) => fileId !== action.fileId),
      )
      const expiry = Object.fromEntries(
        Object.entries(matches).filter(([requirementId]) => state.expiry[requirementId]),
      )
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.fileId),
        matches,
        expiry,
      }
    }
    case 'SET_MATCH': {
      if (action.fileId) {
        const selectedFile = state.files.find((file) => file.id === action.fileId)
        if (!selectedFile) return state
        const otherMatches = Object.entries(state.matches).filter(
          ([requirementId]) => requirementId !== action.requirementId,
        )
        const usedByOther = otherMatches.find(([, fileId]) => fileId === action.fileId)
        if (usedByOther) return state
        const duplicateUsedElsewhere = selectedFile.hash && otherMatches.some(([, fileId]) => {
          const matchedFile = state.files.find((file) => file.id === fileId)
          return matchedFile?.hash && matchedFile.hash === selectedFile.hash
        })
        if (duplicateUsedElsewhere) return state
      }
      const matches = Object.fromEntries(
        Object.entries(state.matches).filter(([requirementId, fileId]) =>
          requirementId !== action.requirementId && fileId !== action.fileId,
        ),
      )
      return {
        ...state,
        matches: action.fileId
          ? { ...matches, [action.requirementId]: action.fileId }
          : matches,
        expiry: { ...state.expiry, [action.requirementId]: '' },
      }
    }
    case 'CLEAR_MATCH': {
      const matches = { ...state.matches }
      delete matches[action.requirementId]
      const expiry = { ...state.expiry }
      delete expiry[action.requirementId]
      return { ...state, matches, expiry }
    }
    case 'SET_EXPIRY':
      return { ...state, expiry: { ...state.expiry, [action.requirementId]: action.value } }
    case 'SET_GENERATING':
      return { ...state, generating: Boolean(action.value) }
    case 'NOTICE':
      return { ...state, notice: action.notice }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    localStorage.setItem('lang', state.lang)
    document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en'
    document.documentElement.dataset.lang = state.lang
    document.documentElement.style.fontFamily =
      state.lang === 'bn'
        ? '"Noto Sans Bengali", sans-serif'
        : 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }, [state.lang])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used inside AppProvider')
  return context
}