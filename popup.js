// 获取提交按钮的DOM元素
var commitButton = document.getElementById('commitButton');

// 页面加载时，从存储中恢复数据
document.addEventListener('DOMContentLoaded', function() {
    restoreInputs();
});

// 设置提交按钮的点击事件监听器
commitButton.addEventListener('click', function() {
    var promptContent = combineInputPrompt();
    copyPromptToClipboard(promptContent);
    saveInputs(); // 保存输入数据到本地存储
});

// 监听输入框内容变化
document.getElementById('dataName').addEventListener('input', saveInputs);
document.getElementById('request').addEventListener('input', saveInputs);
document.getElementById('module').addEventListener('input', saveInputs);
document.getElementById('question').addEventListener('input', saveInputs);
document.getElementById('questionBackground').addEventListener('input', saveInputs);

function combineInputPrompt() {
    var requestContent = document.getElementById('request').value;
    var moduleContent = document.getElementById('module').value;
    var questionContent = document.getElementById('question').value;
    var questionBackgroundContent = document.getElementById('questionBackground').value;

    return [
        'request：' + requestContent,
        'module：' + moduleContent,
        'question：' + questionContent,
        'question background：' + questionBackgroundContent
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
        dataName: document.getElementById('dataName').innerText, // 获取并保存数据命名
        request: document.getElementById('request').value,
        module: document.getElementById('module').value,
        question: document.getElementById('question').value,
        questionBackground: document.getElementById('questionBackground').value
    };
    chrome.storage.local.set({inputs: inputs});
}

// 从存储中恢复输入数据
function restoreInputs() {
    chrome.storage.local.get('inputs', function(data) {
        if (data.inputs) {
            document.getElementById('dataName').innerText = data.inputs.dataName || '未命名'; // 恢复数据命名
            document.getElementById('request').value = data.inputs.request || '';
            document.getElementById('module').value = data.inputs.module || '';
            document.getElementById('question').value = data.inputs.question || '';
            document.getElementById('questionBackground').value = data.inputs.questionBackground || '';
        }
    });
}

// 导出数据
document.getElementById('exportButton').addEventListener('click', function() {
    chrome.storage.local.get('inputs', function(data) {
        if (data.inputs) {
            var fileName = data.inputs.dataName ? data.inputs.dataName + '.json' : 'exported_data.json'; // 使用数据命名作为文件名
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
