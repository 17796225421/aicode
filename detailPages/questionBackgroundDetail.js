// 当页面加载完毕时，从 localStorage 中获取问题背景的数据并显示在输入框中
document.addEventListener('DOMContentLoaded', function() {
    let relatedModule = document.getElementById('relatedModule');
    let specificCode = document.getElementById('specificCode');

    // 从 localStorage 中恢复数据
    let savedData = localStorage.getItem('questionBackgroundData');
    if (savedData) {
        savedData = JSON.parse(savedData);
        relatedModule.value = savedData.relatedModule || '';
        specificCode.value = savedData.specificCode || '';
    }

    // 监听输入框的变化并实时保存数据
    relatedModule.addEventListener('input', saveData);
    specificCode.addEventListener('input', saveData);

    // 保存当前页面状态
    localStorage.setItem('lastOpenedPage', 'detailPages/questionBackgroundDetail.html');
});

// 保存数据到 localStorage
function saveData() {
    let dataToSave = {
        relatedModule: document.getElementById('relatedModule').value,
        specificCode: document.getElementById('specificCode').value
    };
    localStorage.setItem('questionBackgroundData', JSON.stringify(dataToSave));
}

// 直接为复制按钮绑定复制功能的事件监听器
document.getElementById('copyButton').addEventListener('click', copyAllDataToClipboard);

// 为返回按钮添加点击事件监听器
document.getElementById('backButton').addEventListener('click', function() {
    localStorage.removeItem('lastOpenedPage');
    window.location.href = '../popup.html'; // 返回到 popup.html
});
