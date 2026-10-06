import { PDFDocument } from 'pdf-lib'

const PDF_HEADER = '%PDF'

function looksLikePdf(file, bytes) {
  const nameLooksLikePdf = typeof file?.name === 'string' && file.name.toLowerCase().endsWith('.pdf')
  const mimeLooksLikePdf = file?.type === 'application/pdf'
  const header = new TextDecoder().decode(bytes.slice(0, 4))
  return (nameLooksLikePdf || mimeLooksLikePdf) && header === PDF_HEADER
}

function classifyLoadError(error) {
  const message = String(error?.message ?? error).toLowerCase()
  return /encrypt|password|decrypt|illegal character|cannot be decrypted/.test(message)
    ? 'encrypted'
    : 'damaged'
}

export async function readPdfInfo(file) {
  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (!looksLikePdf(file, bytes)) return { ok: false, reason: 'notPdf' }
    try {
      const document = await PDFDocument.load(bytes)
      return { ok: true, bytes, pages: document.getPageCount() }
    } catch (error) {
      return { ok: false, reason: classifyLoadError(error) }
    }
  } catch {
    return { ok: false, reason: 'damaged' }
  }
}
