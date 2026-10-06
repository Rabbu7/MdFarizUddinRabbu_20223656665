export async function hashBytes(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function groupDuplicates(files) {
  const groups = new Map()
  files.forEach((file) => {
    if (!file.hash) return
    const group = groups.get(file.hash) ?? []
    group.push(file)
    groups.set(file.hash, group)
  })
  return new Map([...groups].filter(([, group]) => group.length > 1))
}
