// 当页面加载完毕时，从 localStorage 中获取模块的数据并显示在输入框中
document.addEventListener('DOMContentLoaded', function() {
    let keyfileTree = document.getElementById('keyfileTree');
    let classFunctionDesc = document.getElementById('classFunctionDesc');
    let classVariable = document.getElementById('classVariable');

    // 从 localStorage 中恢复数据
    let savedData = localStorage.getItem('moduleData');
    if (savedData) {
        savedData = JSON.parse(savedData);
        keyfileTree.value = savedData.keyfileTree || '';
        classFunctionDesc.value = savedData.classFunctionDesc || '';
        classVariable.value = savedData.classVariable || '';
    }

    // 监听输入框的变化并实时保存数据
    keyfileTree.addEventListener('input', saveData);
    classFunctionDesc.addEventListener('input', saveData);
    classVariable.addEventListener('input', saveData);

    // 保存当前页面状态
    localStorage.setItem('lastOpenedPage', 'detailPages/moduleDetail.html');
});

// 保存数据到 localStorage
function saveData() {
    let dataToSave = {
        keyfileTree: document.getElementById('keyfileTree').value,
        classFunctionDesc: document.getElementById('classFunctionDesc').value,
        classVariable: document.getElementById('classVariable').value
    };
    localStorage.setItem('moduleData', JSON.stringify(dataToSave));
}

// 直接为复制按钮绑定复制功能的事件监听器
document.getElementById('copyButton').addEventListener('click', copyAllDataToClipboard);

// 为返回按钮添加点击事件监听器
document.getElementById('backButton').addEventListener('click', function() {
    localStorage.removeItem('lastOpenedPage');
    window.location.href = '../popup.html'; // 返回到 popup.html
});
