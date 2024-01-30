// 当页面加载完毕时，从 localStorage 中获取额外请求的数据并显示在输入框中
document.addEventListener('DOMContentLoaded', function() {
    var extraRequest = document.getElementById('extraRequest');

    // 从 localStorage 中恢复数据
    var savedData = localStorage.getItem('extraRequestData');
    if (savedData) {
        savedData = JSON.parse(savedData);
        extraRequest.value = savedData.extraRequest || '';
    }

    // 监听输入框的变化并实时保存数据
    extraRequest.addEventListener('input', saveData);
});

// 保存数据到 localStorage
function saveData() {
    var dataToSave = {
        extraRequest: document.getElementById('extraRequest').value
    };
    localStorage.setItem('extraRequestData', JSON.stringify(dataToSave));
}

// 为复制按钮添加点击事件监听器
document.getElementById('copyButton').addEventListener('click', function() {
});

// 为返回按钮添加点击事件监听器
document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = '../popup.html'; // 返回到 popup.html
});
