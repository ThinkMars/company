export function getPageUrl(): string {
  return window.location.href
}

export function getNetworkType(): string {
  return (navigator as any).connection
    ? (navigator as any).connection.effectiveType
    : ''
}

export function getLocaleLanguage() {
  if (navigator.languages != undefined) return navigator.languages[0]
  return navigator.language
}

export function generateUniqueId() {
  // 检查LocalStorage中是否已存在唯一性ID
  let uniqueId = localStorage.getItem('metrics-uniqueId')

  // 如果不存在，则生成一个新的唯一性ID
  if (!uniqueId) {
    uniqueId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      },
    )
    localStorage.setItem('metrics-uniqueId', uniqueId)
  }

  return uniqueId
}
