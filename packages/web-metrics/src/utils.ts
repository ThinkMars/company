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
