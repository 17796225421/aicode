function copyAllDataToClipboard() {
    // 获取 localStorage 中的所有数据
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
${classFile || ""}

最后再次强调我的问题是：
5.【question】
5.1.question=具体问题+强调修正
5.2.具体问题: 
${questionData.specificIssues || ''}
5.3.强调修正: 
${questionData.emphasisCorrection || ''}
`;

    // 复制到剪贴板
    navigator.clipboard.writeText(combinedData).then(function () {
        console.log('内容已复制到粘贴板');

        // 注意：这里仍然调用了原先第一份代码的这个函数名
        // 但函数内部逻辑已替换为多窗口版本
        openAndArrangeWindows();

    }, function (err) {
        console.error('无法复制内容: ', err);
    });
}


// 你可以自由添加或修改这里的 URL 数组，来决定要打开哪些窗口
const URL_LIST = [
    'https://chatshare.xyz/?model=o1-pro',
    'https://chatshare.xyz/?model=o1-pro',
    'https://chatshare.xyz/?model=o1-pro',
    'https://chatshare.xyz/?model=o3-mini-high',
    'https://chatshare.xyz/?model=o3-mini-high',
];

// 用来保存所有已创建窗口的 ID
let createdWindowIds = new Set();
// 用来标记是否正在进行互斥关闭，防止重复触发
let isClosingWindows = false;

/**
 * 多窗口打开与同时关闭主函数
 * 注意：函数名保持为 openAndArrangeWindows，供 copyAllDataToClipboard 调用
 */
function openAndArrangeWindows() {
    // 每次新打开前，先清除上一次的记录
    createdWindowIds.clear();
    isClosingWindows = false;

    // 先关闭那些已经打开的、且在 URL_LIST 之内的窗口
    chrome.windows.getAll({ populate: true }, async function(existingWindows) {
        const closePromises = [];
        existingWindows.forEach((win) => {
            const hasOurUrl = win.tabs.some(tab => {
                return URL_LIST.includes(tab.url);
            });
            if (hasOurUrl) {
                // 说明这个窗口是之前我们打开的，需要关闭
                closePromises.push(new Promise(resolve => {
                    chrome.windows.remove(win.id, resolve);
                }));
            }
        });

        // 等待所有相关旧窗口都关闭完毕
        await Promise.all(closePromises);

        // 现在正式创建新窗口
        createNewWindows(URL_LIST);
    });
}

/**
 * 逐个创建多窗口
 */
function createNewWindows(urls) {
    // 计算一下屏幕上的布局
    const screenMetrics = calculateScreenMetrics(urls.length);

    urls.forEach((url, index) => {
        const position = calculateWindowPosition(index, screenMetrics);
        chrome.windows.create({
            url: url,
            type: 'popup',
            ...position
        }, function(newWindow) {
            if (newWindow) {
                // 记录下来该窗口的 id
                createdWindowIds.add(newWindow.id);
                setupWindowListeners(newWindow.id);
            }
        });
    });
}

/**
 * 根据 URL 数量，计算窗口大小和偏移
 */
function calculateScreenMetrics(urlCount) {
    const outerWidth = screen.width;
    const outerHeight = screen.height;
    // 以 urlCount 等分屏幕
    const baseWidth = Math.round(outerWidth / urlCount);
    // 这里设置一个可自行调整的重叠或边距
    const extraWidth = Math.round(baseWidth * 0.3);

    return {
        windowWidth: baseWidth + extraWidth,
        overlap: extraWidth,
        height: outerHeight
    };
}

/**
 * 第 i 个窗口摆放的位置
 */
function calculateWindowPosition(index, metrics) {
    return {
        left: index * (metrics.windowWidth - metrics.overlap),
        top: 0,
        width: metrics.windowWidth,
        height: metrics.height
    };
}

/**
 * 每个新窗口都要监听其关闭事件
 */
function setupWindowListeners(windowId) {
    // 监听事件：如果用户关闭了其中一个窗口，就关闭全部
    chrome.windows.onRemoved.addListener(handleWindowRemoval);
}

/**
 * 处理窗口被关闭的回调
 */
function handleWindowRemoval(closedWindowId) {
    // 若当前没在执行互斥关闭，且确实是我们管理的窗口，那么触发互斥
    if (!isClosingWindows && createdWindowIds.has(closedWindowId)) {
        isClosingWindows = true;
        closeAllRelatedWindows(closedWindowId);
    }
}

/**
 * 关闭剩余所有已创建的窗口
 */
async function closeAllRelatedWindows(excludeWindowId) {
    // 先获取所有窗口
    const allWindows = await new Promise(resolve => {
        chrome.windows.getAll({ populate: true }, resolve);
    });

    // 找到本次创建的且没有被排除的所有窗口
    const closePromises = [];
    for (let id of createdWindowIds) {
        if (id !== excludeWindowId) {
            closePromises.push(new Promise(resolve => {
                chrome.windows.remove(id, resolve);
            }));
        }
    }
    await Promise.all(closePromises);

    // 重置状态，方便下一次正常打开
    createdWindowIds.clear();
    isClosingWindows = false;
}
