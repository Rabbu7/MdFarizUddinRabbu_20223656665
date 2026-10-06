const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isDateString(value) {
  return typeof value === 'string' && DATE_PATTERN.test(value)
}

export function compareDateStrings(left, right) {
  if (!isDateString(left) || !isDateString(right)) {
    throw new Error('Dates must use YYYY-MM-DD format')
  }
  return left < right ? -1 : left > right ? 1 : 0
}

export function isBeforeDate(left, right) {
  return compareDateStrings(left, right) < 0
}

export function isOnOrAfterDate(left, right) {
  return compareDateStrings(left, right) >= 0
}
