import resizeTextArea from "../util/resizeTextArea.js";

// 当页面加载完毕时，从 localStorage 中获取数据并显示在输入框中
document.addEventListener('DOMContentLoaded', function() {
    let extraRequest = document.getElementById('extraRequest');

    // 动态调整输入框大小

    [extraRequest].forEach(textarea => {
        textarea.addEventListener('focus', () => resizeTextArea(textarea));
        textarea.addEventListener('input', () => resizeTextArea(textarea));
    });

    // 从 localStorage 中恢复数据
    let savedData = localStorage.getItem('extraRequestData');
    if (savedData) {
        savedData = JSON.parse(savedData);
        extraRequest.value = savedData.extraRequest || '';
    }

    // 监听输入框的变化并实时保存数据
    extraRequest.addEventListener('input', saveData);

    // 保存当前页面状态
    localStorage.setItem('lastOpenedPage', 'detailPages/extraRequestDetail.html');
});

// 保存数据到 localStorage
function saveData() {
    let dataToSave = {
        extraRequest: document.getElementById('extraRequest').value
    };
    localStorage.setItem('extraRequestData', JSON.stringify(dataToSave));
}

// 直接为复制按钮绑定复制功能的事件监听器
document.getElementById('copyButton').addEventListener('click', copyAllDataToClipboard);

// 为返回按钮添加点击事件监听器
document.getElementById('backButton').addEventListener('click', function() {
    localStorage.removeItem('lastOpenedPage');
    window.location.href = '../popup.html'; // 返回到 popup.html
});
