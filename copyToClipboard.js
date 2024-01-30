function copyAllDataToClipboard() {
    // 获取localStorage中的所有数据
    var questionData = JSON.parse(localStorage.getItem('questionDetailData')) || {};
    var extraRequestData = JSON.parse(localStorage.getItem('extraRequestData')) || {};
    var questionBackgroundData = JSON.parse(localStorage.getItem('questionBackgroundData')) || {};
    var moduleData = JSON.parse(localStorage.getItem('moduleData')) || {};

    // 组合成一段文本
    var combinedData = `
        Question: ${questionData.specificIssues || ''} ${questionData.emphasisCorrection || ''}
        Extra Request: ${extraRequestData.extraRequest || ''}
        Question Background: ${questionBackgroundData.relatedModule || ''} ${questionBackgroundData.specificCode || ''}
        Module: ${moduleData.keyfileTree || ''} ${moduleData.classFunctionDesc || ''} ${moduleData.classVariable || ''}
    `;

    // 复制到剪贴板
    navigator.clipboard.writeText(combinedData).then(function() {
        console.log('内容已复制到粘贴板');
    }, function(err) {
        console.error('无法复制内容: ', err);
    });
}
