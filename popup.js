// 获取按钮的DOM元素
var questionButton = document.getElementById('questionButton');
var extraRequestButton = document.getElementById('extraRequestButton');
var questionBackgroundButton = document.getElementById('questionBackgroundButton');
var moduleButton = document.getElementById('moduleButton');
var copyButton = document.getElementById('copyButton');

// 设置按钮的点击事件监听器，用于改变当前页面的地址
questionButton.addEventListener('click', function() {
    window.location.href = 'detailPages/questionDetail.html';
});

extraRequestButton.addEventListener('click', function() {
    window.location.href = 'detailPages/extraRequestDetail.html';
});

questionBackgroundButton.addEventListener('click', function() {
    window.location.href = 'detailPages/questionBackgroundDetail.html';
});

moduleButton.addEventListener('click', function() {
    window.location.href = 'detailPages/moduleDetail.html';
});

// 直接为复制按钮绑定复制功能的事件监听器
document.getElementById('copyButton').addEventListener('click', copyAllDataToClipboard);

// 页面加载时，从存储中恢复数据
document.addEventListener('DOMContentLoaded', function() {
    restoreInputs();

    // 从 localStorage 获取最后打开的页面
    var lastOpenedPage = localStorage.getItem('lastOpenedPage');
    console.log('Trying to navigate to:', lastOpenedPage);
    // 如果存储中有页面状态，则导航到该页面
    if (lastOpenedPage) {
        window.location.href = lastOpenedPage;
    }
});

// 监听输入框内容变化
document.getElementById('projectName').addEventListener('input', saveInputs);

// 保存输入数据到本地存储
function saveInputs() {
    var inputs = {
        projectName: document.getElementById('projectName').innerText, // 获取并保存数据命名
        question: document.getElementById('question').value,
        extraRequest: document.getElementById('extraRequest').value,
        questionBackground: document.getElementById('questionBackground').value,
        module: document.getElementById('module').value
    };
    chrome.storage.local.set({inputs: inputs});
}

// 从存储中恢复输入数据
function restoreInputs() {
    chrome.storage.local.get('inputs', function(data) {
        if (data.inputs) {
            document.getElementById('projectName').innerText = data.inputs.projectName || '未命名'; // 恢复数据命名
        }
    });
}

// 导出数据
document.getElementById('exportButton').addEventListener('click', function() {
    chrome.storage.local.get('inputs', function(data) {
        if (data.inputs) {
            var fileName = data.inputs.projectName ? data.inputs.projectName + '.json' : 'exported_data.json'; // 使用数据命名作为文件名
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data.inputs));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", fileName);
            document.body.appendChild(downloadAnchorNode); // Firefox需要这一步
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    });
});


// 导入数据
document.getElementById('importButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.onchange = function() {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var importedData = JSON.parse(e.target.result);
            chrome.storage.local.set({inputs: importedData}, function() {
                restoreInputs(); // 更新UI
            });
        };
        reader.readAsText(file);
    };
});
