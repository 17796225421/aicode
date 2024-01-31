// 当页面加载完毕时，从 localStorage 中获取数据并显示在输入框中
document.addEventListener('DOMContentLoaded', function() {
    var specificIssues = document.getElementById('specificIssues');
    var emphasisCorrection = document.getElementById('emphasisCorrection');

    // 从 localStorage 中恢复数据
    var savedData = localStorage.getItem('questionDetailData');
    if (savedData) {
        savedData = JSON.parse(savedData);
        specificIssues.value = savedData.specificIssues || '';
        emphasisCorrection.value = savedData.emphasisCorrection || '';
    }

    // 监听输入框的变化并实时保存数据
    specificIssues.addEventListener('input', saveData);
    emphasisCorrection.addEventListener('input', saveData);

    // 保存当前页面状态
    localStorage.setItem('lastOpenedPage', 'detailPages/questionDetail.html');
});

// 保存数据到 localStorage
function saveData() {
    var dataToSave = {
        specificIssues: document.getElementById('specificIssues').value,
        emphasisCorrection: document.getElementById('emphasisCorrection').value
    };
    localStorage.setItem('questionDetailData', JSON.stringify(dataToSave));
}

// 直接为复制按钮绑定复制功能的事件监听器
document.getElementById('copyButton').addEventListener('click', copyAllDataToClipboard);

// 为返回按钮添加点击事件监听器
document.getElementById('backButton').addEventListener('click', function() {
    localStorage.removeItem('lastOpenedPage');
    window.location.href = '../popup.html'; // 返回到 popup.html
});
