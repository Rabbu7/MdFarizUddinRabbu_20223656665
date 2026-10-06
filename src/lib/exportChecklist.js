import { getStatus } from './status.js'

function escapeCsvCell(value) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

export function buildChecklistCsv({ tender, requirements, files, matches, expiry, labels }) {
  const fileById = new Map(files.map((file) => [file.id, file]))
  const rows = [
    [labels.document, labels.fileName, labels.pages, labels.expiryDate, labels.status],
    ...requirements
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((requirement) => {
        const file = fileById.get(matches[requirement.id])
        return [
          requirement.title,
          file?.name ?? '',
          file?.pages ?? '',
          expiry[requirement.id] ?? '',
          labels.statusValues[getStatus(
            requirement,
            Boolean(file),
            expiry[requirement.id],
            tender.submission_deadline,
          )],
        ]
      }),
  ]
  return `\uFEFF${rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n')}\r\n`
}

export function downloadChecklistCsv({ csv, tenderId }) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${tenderId}_Checklist.csv`
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
