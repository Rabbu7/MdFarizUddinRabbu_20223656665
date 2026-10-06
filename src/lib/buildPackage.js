import {
  PDFDocument,
  PDFName,
  StandardFonts,
  rgb,
} from 'pdf-lib'

const FOOTER_HEIGHT = 28
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

function todayLocal() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function wrapText(text, font, size, maxWidth) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean)
  if (!words.length) return ['']
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
      line = candidate
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawLabelValue(page, label, value, font, boldFont, y, width) {
  page.drawText(`${label}:`, {
    x: 54,
    y,
    size: 11,
    font: boldFont,
    color: rgb(0.12, 0.16, 0.24),
  })
  const labelWidth = boldFont.widthOfTextAtSize(`${label}:`, 11) + 8
  const lines = wrapText(value, font, 11, width - labelWidth)
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: 54 + labelWidth,
      y: y - index * 15,
      size: 11,
      font,
      color: rgb(0.28, 0.33, 0.42),
    })
  })
  return y - Math.max(1, lines.length) * 15 - 7
}

function rotationTransform(page) {
  const box = page.getMediaBox()
  const angle = ((page.getRotation().angle % 360) + 360) % 360
  if (angle === 90) {
    return {
      width: box.height,
      height: box.width,
      matrix: [0, 1, -1, 0, box.y + box.height, -box.x],
      box,
    }
  }
  if (angle === 180) {
    return {
      width: box.width,
      height: box.height,
      matrix: [-1, 0, 0, -1, box.x + box.width, box.y + box.height],
      box,
    }
  }
  if (angle === 270) {
    return {
      width: box.height,
      height: box.width,
      matrix: [0, -1, 1, 0, -box.y, box.x + box.width],
      box,
    }
  }
  return {
    width: box.width,
    height: box.height,
    matrix: [1, 0, 0, 1, -box.x, -box.y],
    box,
  }
}

function drawFooter(page, tenderId, pageNumber, totalPages, font) {
  const text = `${tenderId} | Page ${pageNumber} of ${totalPages}`
  const size = 9
  const width = font.widthOfTextAtSize(text, size)
  page.drawText(text, {
    x: Math.max(12, (page.getWidth() - width) / 2),
    y: 9,
    size,
    font,
    color: rgb(0.20, 0.24, 0.31),
  })
}

export async function buildPackage({ tender, requirements, files, matches }) {
  if (!tender || !Array.isArray(requirements) || !Array.isArray(files)) {
    throw new Error('Cannot generate a package without tender data.')
  }

  const output = await PDFDocument.create()
  const font = await output.embedFont(StandardFonts.Helvetica)
  const boldFont = await output.embedFont(StandardFonts.HelveticaBold)
  const included = requirements
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((requirement) => ({
      requirement,
      file: files.find((item) => item.id === matches[requirement.id]),
    }))
    .filter(({ file }) => file)

  const cover = output.addPage([A4_WIDTH, A4_HEIGHT + FOOTER_HEIGHT])
  cover.drawText('Tender Document Package', {
    x: 54,
    y: A4_HEIGHT - 62,
    size: 24,
    font: boldFont,
    color: rgb(0.06, 0.09, 0.16),
  })
  cover.drawText('Combined submission documents', {
    x: 54,
    y: A4_HEIGHT - 84,
    size: 11,
    font,
    color: rgb(0.28, 0.33, 0.42),
  })

  let y = A4_HEIGHT - 132
  y = drawLabelValue(cover, 'Tender ID', tender.tender_id, font, boldFont, y, A4_WIDTH - 108)
  y = drawLabelValue(cover, 'Title', tender.title, font, boldFont, y, A4_WIDTH - 108)
  y = drawLabelValue(cover, 'Procuring entity', tender.procuring_entity, font, boldFont, y, A4_WIDTH - 108)
  y = drawLabelValue(cover, 'Bidder', tender.bidder, font, boldFont, y, A4_WIDTH - 108)
  y = drawLabelValue(cover, 'Submission deadline', tender.submission_deadline, font, boldFont, y, A4_WIDTH - 108)
  y = drawLabelValue(cover, 'Package generated', todayLocal(), font, boldFont, y, A4_WIDTH - 108)

  const listTitleY = y - 12
  cover.drawText('Included documents', {
    x: 54,
    y: listTitleY,
    size: 13,
    font: boldFont,
    color: rgb(0.06, 0.09, 0.16),
  })

  let listSize = 11
  let listLines = []
  const listMaxHeight = listTitleY - FOOTER_HEIGHT - 28
  while (listSize >= 8) {
    listLines = included.flatMap(({ requirement }, index) => {
      const prefix = `${index + 1}. `
      const wrapped = wrapText(requirement.title_en, font, listSize, A4_WIDTH - 108 - font.widthOfTextAtSize(prefix, listSize))
      return wrapped.map((line, lineIndex) => `${lineIndex === 0 ? prefix : ' '.repeat(prefix.length)}${line}`)
    })
    if (listLines.length * (listSize + 4) <= listMaxHeight) break
    listSize -= 0.5
  }
  const linesPerCover = Math.max(1, Math.floor(listMaxHeight / (listSize + 4)))
  listLines.slice(0, linesPerCover).forEach((line, index) => {
    cover.drawText(line, {
      x: 54,
      y: listTitleY - 24 - index * (listSize + 4),
      size: listSize,
      font,
      color: rgb(0.28, 0.33, 0.42),
    })
  })
  let remainingLines = listLines.slice(linesPerCover)
  while (remainingLines.length) {
    // A second cover page is used only when shrinking and wrapping cannot fit the list on page one.
    const continuation = output.addPage([A4_WIDTH, A4_HEIGHT + FOOTER_HEIGHT])
    continuation.drawText('Included documents (continued)', {
      x: 54,
      y: A4_HEIGHT - 62,
      size: 16,
      font: boldFont,
      color: rgb(0.06, 0.09, 0.16),
    })
    const continuationLines = remainingLines.slice(0, linesPerCover + 1)
    continuationLines.forEach((line, index) => {
      continuation.drawText(line, {
        x: 54,
        y: A4_HEIGHT - 100 - index * (listSize + 4),
        size: listSize,
        font,
        color: rgb(0.28, 0.33, 0.42),
      })
    })
    remainingLines = remainingLines.slice(continuationLines.length)
  }

  for (const { file } of included) {
    const source = await PDFDocument.load(file.bytes)
    for (const sourcePage of source.getPages()) {
      const transformed = rotationTransform(sourcePage)
      if (!sourcePage.node.get(PDFName.of('Contents'))) {
        output.addPage([transformed.width, transformed.height + FOOTER_HEIGHT])
        continue
      }
      const embedded = await output.embedPage(sourcePage, {
        left: transformed.box.x,
        bottom: transformed.box.y,
        right: transformed.box.x + transformed.box.width,
        top: transformed.box.y + transformed.box.height,
      }, transformed.matrix)
      const page = output.addPage([transformed.width, transformed.height + FOOTER_HEIGHT])
      page.drawPage(embedded, {
        x: 0,
        y: FOOTER_HEIGHT,
        width: transformed.width,
        height: transformed.height,
      })
    }
  }

  const pages = output.getPages()
  const totalPages = pages.length
  pages.forEach((page, index) => drawFooter(page, tender.tender_id, index + 1, totalPages, font))

  return {
    bytes: await output.save(),
    totalPages,
  }
}
