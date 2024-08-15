document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggle');

    // 토글 버튼 상태에 따라 백그라운드 스크립트에 메시지 전송
    toggle.addEventListener('change', function() {
        const enabled = toggle.checked;
        chrome.runtime.sendMessage({ enabled: enabled });
    });
});
