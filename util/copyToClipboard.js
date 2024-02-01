function copyAllDataToClipboard() {
    // 获取localStorage中的所有数据
    let questionData = JSON.parse(localStorage.getItem('questionDetailData')) || {};
    let extraRequestData = JSON.parse(localStorage.getItem('extraRequestData')) || {};
    let questionBackgroundData = JSON.parse(localStorage.getItem('questionBackgroundData')) || {};
    let moduleData = JSON.parse(localStorage.getItem('moduleData')) || {};

    let classFile = '';
    let i=1;
    // 遍历 moduleData 对象中的每个 op
    for (const fileName in moduleData) {
        if (moduleData.hasOwnProperty(fileName) && fileName !== 'keyfileTree') {
            const fileDesc = moduleData[fileName];

            // 将 functionDesc 和 variableDesc 添加到结果字符串
            classFile += `4.3.${i}.${fileName}:\n`;
            classFile += `4.3.${i}.1.函数描述:\n ${fileDesc.functionDesc}\n`;
            classFile += `4.3.${i}.2.变量描述:\n ${fileDesc.variableDesc}\n\n`;
            i++;
        }
    }

    // 组合成一段带有子标题的文本
    let combinedData =
`接下来我会给你question，紧接着会给你一些背景信息，比如extra request、question background、module background，你的任务是解决我给你的question
1.【question】
1.1.question=具体问题+强调修正
1.2.具体问题: 
${questionData.specificIssues || ''}
1.3.强调修正: 
${questionData.emphasisCorrection || ''}

2.【extra request】
2.1.extra request=额外请求
2.2.额外请求: 
${extraRequestData.extraRequest || ''}

3.【question background】
3.1.question background=相关模块+具体代码
3.2.相关模块: 
${questionBackgroundData.relatedModule || ''}
3.3.具体代码: 
${questionBackgroundData.specificCode || ''}

4.【module background】
4.1.module=关键文件树+类文件描述
4.2.关键文件树: 
${moduleData.keyfileTree || ''}

4.3.类文件描述：
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
