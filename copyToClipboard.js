function copyAllDataToClipboard() {
    // 获取localStorage中的所有数据
    let questionData = JSON.parse(localStorage.getItem('questionDetailData')) || {};
    let extraRequestData = JSON.parse(localStorage.getItem('extraRequestData')) || {};
    let questionBackgroundData = JSON.parse(localStorage.getItem('questionBackgroundData')) || {};
    let moduleData = JSON.parse(localStorage.getItem('moduleData')) || {};

    // 组合成一段带有子标题的文本
    let combinedData =
`prompt=question+extra request+question background+module

【question】
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
module=关键文件树+类函数描述+类变量
关键文件树: 
${moduleData.keyfileTree || ''}
类函数描述: 
${moduleData.classFunctionDesc || ''}
类变量: 
${moduleData.classVariable || ''}`;

    // 复制到剪贴板
    navigator.clipboard.writeText(combinedData).then(function() {
        console.log('内容已复制到粘贴板');
    }, function(err) {
        console.error('无法复制内容: ', err);
    });
}
