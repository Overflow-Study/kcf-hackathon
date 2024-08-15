let intervalId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.enabled) {
        // 기능이 활성화된 경우, 10초마다 요소를 가져옵니다.
        if (!intervalId) {
            intervalId = setInterval(() => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length === 0 || !tabs[0].url) {
                        console.error("No active tab found or URL is undefined.");
                        return;
                    }

                    const activeTab = tabs[0];
                    const urlPattern = /https:\/\/.*\.tistory\.com\/manage\/newpost/;
                    if (urlPattern.test(activeTab.url)) {
                        chrome.scripting.executeScript({
                            target: { tabId: activeTab.id },
                            function: extractContent
                        }, (results) => {
                            if (chrome.runtime.lastError) {
                                console.error('Script execution failed: ', chrome.runtime.lastError.message);
                            } else {
                                console.log('Script execution results: ', results);
                            }
                        });
                    } else {
                        console.log("URL does not match the pattern.");
                    }
                });
            }, 10000); // 10초 간격
        }
    } else {
        // 기능이 비활성화된 경우, 주기적인 작업을 중단합니다.
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
});

function extractContent() {
    console.log("extractContent function executed.");
    const iframe = document.querySelector('#editor-tistory_ifr');
    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const iframeContent = iframeDocument.body.innerHTML;
        console.log(iframeContent);

        // FastAPI 서버로 POST 요청
        fetch('http://localhost:8000/receive-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: iframeContent })
        })
        .then(response => response.json())
        .then(data => console.log('Server response:', data))
        .catch(error => console.error('Error sending content:', error));
    } else {
        console.log("Iframe not found.");
    }
}
