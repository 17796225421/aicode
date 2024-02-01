function copyAllDataToClipboard() {
    // 获取localStorage中的所有数据
    let questionData = JSON.parse(localStorage.getItem('questionDetailData')) || {};
    let extraRequestData = JSON.parse(localStorage.getItem('extraRequestData')) || {};
    let questionBackgroundData = JSON.parse(localStorage.getItem('questionBackgroundData')) || {};
    let moduleData = JSON.parse(localStorage.getItem('moduleData')) || {};

    let classFile = '';
    // 遍历 moduleData 对象中的每个 op
    for (const fileName in moduleData) {
        if (moduleData.hasOwnProperty(fileName) && fileName !== 'keyfileTree') {
            const fileDesc = moduleData[fileName];

            // 将 functionDesc 和 variableDesc 添加到结果字符串
            classFile += `${fileName}:\n`;
            classFile += `函数描述:\n ${fileDesc.functionDesc}\n`;
            classFile += `变量描述:\n ${fileDesc.variableDesc}\n\n`;
        }
    }

    // 组合成一段带有子标题的文本
    let combinedData =
`【question】
question=具体问题+强调修正
具体问题: 
${questionData.specificIssues || ''}
强调修正: 
${questionData.emphasisCorrection || ''}

【extra request】
extra request=额外请求
额外请求: 
${extraRequestData.extraRequest || ''}

【question background】
question background=相关模块+具体代码
相关模块: 
${questionBackgroundData.relatedModule || ''}
具体代码: 
${questionBackgroundData.specificCode || ''}

【module】
module=关键文件树+类文件描述
关键文件树: 
${moduleData.keyfileTree || ''}

类文件描述：
${classFile || ""}`;

    // 复制到剪贴板
    navigator.clipboard.writeText(combinedData).then(function () {
        console.log('内容已复制到粘贴板');

        openAndArrangeWindows(); // 假设这就是您想要执行的函数

    }, function (err) {
        console.error('无法复制内容: ', err);
    });
}

function openAndArrangeWindows() {
    let window1, window2;

    const outerWidth = screen.width;
    const outerHeight = screen.height;

    // 创建第一个窗口，并保存引用
    chrome.windows.create({
        url: 'https://chatkit.app/',
        type: 'popup',
        left:outerWidth/2,
        top: 0,
        width: outerWidth / 4 * 1.05,
        height: outerHeight
    }, function (win) {
        window1 = win;
    });

    // 创建第二个窗口，并保存引用
    chrome.windows.create({
        url: 'https://chatkit.app/',
        type: 'popup',
        left: outerWidth/4*3,
        top: 0,
        width: outerWidth / 4 * 1.05,
        height: outerHeight
    }, function (win) {
        window2 = win;
    });

    // 监听第一个窗口的关闭事件
    chrome.windows.onRemoved.addListener(function (windowId) {
        if (windowId === window1.id && window2) {
            chrome.windows.remove(window2.id);
        }
    });

    // 监听第二个窗口的关闭事件
    chrome.windows.onRemoved.addListener(function (windowId) {
        if (windowId === window2.id && window1) {
            chrome.windows.remove(window1.id);
        }
    });
}
