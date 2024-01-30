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

// 设置复制按钮的点击事件监听器
copyButton.addEventListener('click', function() {
    var promptContent = combineInputPrompt();
    copyPromptToClipboard(promptContent);
    saveInputs(); // 保存输入数据到本地存储
});

// 页面加载时，从存储中恢复数据
document.addEventListener('DOMContentLoaded', function() {
    restoreInputs();
});

// 监听输入框内容变化
document.getElementById('projectName').addEventListener('input', saveInputs);

function combineInputPrompt() {
    var questionContent = document.getElementById('question').value;
    var extraRequestContent = document.getElementById('extraRequest').value;
    var questionBackgroundContent = document.getElementById('questionBackground').value;
    var moduleContent = document.getElementById('module').value;

    return [
        'question：' + questionContent,
        'extraRequest：' + extraRequestContent,
        'question background：' + questionBackgroundContent,
        'module：' + moduleContent
    ].join('\n');
}

function copyPromptToClipboard(prompt) {
    navigator.clipboard.writeText(prompt).then(function() {
        console.log('内容已复制到粘贴板');
    }, function(err) {
        console.error('无法复制内容: ', err);
    });
}

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
