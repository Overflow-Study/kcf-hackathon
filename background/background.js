chrome.runtime.onMessage.addListener(({ action }) => {
    if (action === 'activate') {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (tab?.url?.match(/https:\/\/.*\.tistory\.com\/manage\/newpost/)) {
                chrome.scripting.executeScript({ 
                    target: { tabId: tab.id }, 
                    function: blogContent 
                });
            }
        });
    }
});

const blogContent = () => {
    const iframe = document.querySelector('#editor-tistory_ifr');
    if (!iframe) return;

    const content_innerHTML = iframe.contentDocument.body.innerHTML;
    const content_textContent = iframe.contentDocument.body.textContent.trim();

    fetch('http://localhost:8000/receive-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_innerHTML, content_textContent })
    });
};