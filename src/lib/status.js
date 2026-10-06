import { isBeforeDate, isOnOrAfterDate } from './dates.js'

export const STATUS_KEYS = ['missing', 'expiryNeeded', 'expired', 'notProvided', 'ok']
export const BLOCKING_STATUSES = new Set(['missing', 'expiryNeeded', 'expired'])

export function getStatus(requirement, hasFile, expiryDate, deadline) {
  if (!hasFile) return requirement.mandatory ? 'missing' : 'notProvided'
  if (!requirement.has_expiry) return 'ok'
  if (!expiryDate) return 'expiryNeeded'
  if (isBeforeDate(expiryDate, deadline)) return 'expired'
  if (isOnOrAfterDate(expiryDate, deadline)) return 'ok'
  return 'expiryNeeded'
}

export function isBlockingStatus(status) {
  return BLOCKING_STATUSES.has(status)
}

export function getBlockingList(requirements, matches = {}, expiry = {}, deadline) {
  if (!deadline) return []
  return requirements
    .map((requirement) => ({
      requirement,
      status: getStatus(
        requirement,
        Boolean(matches[requirement.id]),
        expiry[requirement.id],
        deadline,
      ),
    }))
    .filter(({ status }) => isBlockingStatus(status))
}

export function getStatusCounts(requirements, matches = {}, expiry = {}, deadline) {
  return requirements.reduce(
    (counts, requirement) => {
      const status = deadline
        ? getStatus(requirement, Boolean(matches[requirement.id]), expiry[requirement.id], deadline)
        : requirement.mandatory
          ? 'missing'
          : 'notProvided'
      counts[status] += 1
      return counts
    },
    { missing: 0, expiryNeeded: 0, expired: 0, notProvided: 0, ok: 0 },
  )
}

export function canGenerate(requirements, matches = {}, expiry = {}, deadline) {
  return requirements.length > 0 && getBlockingList(requirements, matches, expiry, deadline).length === 0
}
