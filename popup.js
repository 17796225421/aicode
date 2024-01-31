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

    // 从 localStorage 获取最后打开的页面
    var lastOpenedPage = localStorage.getItem('lastOpenedPage');
    console.log('Trying to navigate to:', lastOpenedPage);
    // 如果存储中有页面状态，则导航到该页面
    if (lastOpenedPage) {
        window.location.href = lastOpenedPage;
    }

    // 从 localStorage 加载 projectName
    var savedProjectName = localStorage.getItem('projectName');
    if (savedProjectName) {
        document.getElementById('projectName').innerText = savedProjectName;
    }

    // 实时监听 projectName 的更改并保存到 localStorage
    document.getElementById('projectName').addEventListener('input', function() {
        var currentProjectName = document.getElementById('projectName').innerText;
        localStorage.setItem('projectName', currentProjectName);
    });

});


document.getElementById('exportButton').addEventListener('click', function() {
    // 获取数据
    var questionData = JSON.parse(localStorage.getItem('questionDetailData')) || {};
    var extraRequestData = JSON.parse(localStorage.getItem('extraRequestData')) || {};
    var questionBackgroundData = JSON.parse(localStorage.getItem('questionBackgroundData')) || {};
    var moduleData = JSON.parse(localStorage.getItem('moduleData')) || {};

    // 构建JSON对象
    var exportData = {
        specificIssues: questionData.specificIssues,
        emphasisCorrection: questionData.emphasisCorrection,
        extraRequest: extraRequestData.extraRequest,
        relatedModule: questionBackgroundData.relatedModule,
        specificCode: questionBackgroundData.specificCode,
        keyfileTree: moduleData.keyfileTree,
        classFunctionDesc: moduleData.classFunctionDesc,
        classVariable: moduleData.classVariable
    };

    // 将对象转换为JSON字符串
    var jsonStr = JSON.stringify(exportData, null, 2);

    // 创建Blob对象
    var blob = new Blob([jsonStr], { type: 'application/json' });

    // 获取项目名称
    var projectName = document.getElementById('projectName').innerText || '未命名项目';

    // 创建下载链接
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    // 使用项目名称作为文件名的一部分
    a.download = projectName + '.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
});





// 导入数据按钮点击事件
document.getElementById('importButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
    }
    fileInput.click();

    fileInput.onchange = function() {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var importedData = JSON.parse(e.target.result);

            // 存储解析后的数据到localStorage
            localStorage.setItem('questionDetailData', JSON.stringify({ specificIssues: importedData.specificIssues, emphasisCorrection: importedData.emphasisCorrection }));
            localStorage.setItem('extraRequestData', JSON.stringify({ extraRequest: importedData.extraRequest }));
            localStorage.setItem('questionBackgroundData', JSON.stringify({ relatedModule: importedData.relatedModule, specificCode: importedData.specificCode }));
            localStorage.setItem('moduleData', JSON.stringify({ keyfileTree: importedData.keyfileTree, classFunctionDesc: importedData.classFunctionDesc, classVariable: importedData.classVariable }));

            // 更新页面上显示的项目名称
            // 假设导出的文件名格式为: 项目名称.json
            var projectName = file.name.replace('.json', '');
            document.getElementById('projectName').innerText = projectName;

            // 同时更新localStorage中的项目名称
            localStorage.setItem('projectName', projectName);

            alert('数据导入成功！');
        };
        reader.readAsText(file);
    };
});
