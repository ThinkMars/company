// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', sender)
  if (request.action === 'changeBackground') {
    document.body.style.backgroundColor = request.color
    sendResponse({ success: true })
  }
})

// Function to change background color
function changeBackgroundColor(color: string) {
  document.body.style.backgroundColor = color
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  // Get stored color preference if any
  chrome.storage.sync.get(['backgroundColor'], (result) => {
    if (result.backgroundColor) {
      changeBackgroundColor(result.backgroundColor)
    }
  })
})
