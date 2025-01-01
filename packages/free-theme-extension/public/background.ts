document.getElementById('colorPicker')?.addEventListener('change', (e) => {
  const color = (e.target as HTMLInputElement).value

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, {
      action: 'changeBackground',
      color: color,
    })

    // Save preference
    chrome.storage.sync.set({ backgroundColor: color })
  })
})
