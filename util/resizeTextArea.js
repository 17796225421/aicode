/**
 * 根据内容动态调整文本区域的大小
 * @param {HTMLElement} textarea - 要调整大小的文本区域元素
 */
function resizeTextArea(textarea) {
    // 重置高度，以便可以缩小如果文本行减少
    textarea.style.height = 'auto';
    // 根据内容的滚动高度来调整文本区域的高度
    textarea.style.height = textarea.scrollHeight + 'px';
}

// 将函数导出以便在其他模块中使用
export default resizeTextArea;