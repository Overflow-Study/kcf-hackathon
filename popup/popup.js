document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btn1').addEventListener('click', () => {
        try {
            chrome.runtime.sendMessage({ action: 'activate' });
        } catch (e) {}
    });
});