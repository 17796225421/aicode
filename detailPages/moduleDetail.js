import resizeTextArea from '../util/resizeTextArea.js';

// 当页面加载完毕时，从 localStorage 中获取模块的数据并显示在输入框中
document.addEventListener('DOMContentLoaded', function() {
    let keyfileTree = document.getElementById('keyfileTree');
    let classFunctionDesc = document.getElementById('classFunctionDesc');
    let classVariable = document.getElementById('classVariable');
    let classFileSelect = document.getElementById('classFileSelect');

    // 动态调整输入框大小
    [keyfileTree, classFunctionDesc, classVariable].forEach(textarea => {
        textarea.addEventListener('focus', () => resizeTextArea(textarea));
        textarea.addEventListener('input', () => resizeTextArea(textarea));
    });

    // 初始化下拉选择条和按钮的事件
    initializeSelectOptions();

    // 从 localStorage 中恢复数据
    let savedData = localStorage.getItem('moduleData');
    if (savedData) {
        savedData = JSON.parse(savedData);
        keyfileTree.value = savedData.keyfileTree || '';

        // 设置下拉选项
        Object.keys(savedData).forEach(key => {
            if (key !== 'keyfileTree') {
                const option = new Option(key, key);
                classFileSelect.add(option);
            }
        });

        // 根据选中的下拉选项设置类函数描述和类变量
        const selectedOption = classFileSelect.value;
        if (selectedOption && savedData[selectedOption]) {
            classFunctionDesc.value = savedData[selectedOption].functionDesc || '';
            classVariable.value = savedData[selectedOption].variableDesc || '';
        }
    }

    // 监听输入框的变化并实时保存数据
    keyfileTree.addEventListener('input', saveData);
    classFunctionDesc.addEventListener('input', saveData);
    classVariable.addEventListener('input', saveData);

    // 保存当前页面状态
    localStorage.setItem('lastOpenedPage', 'detailPages/moduleDetail.html');
});

function initializeSelectOptions() {
    const select = document.getElementById('classFileSelect');
    const deleteBtn = document.getElementById('deleteOptionButton');
    const addBtn = document.getElementById('addOptionButton');

    // 删除选项事件
    deleteBtn.addEventListener('click', () => {
        const selectedOptionIndex = select.selectedIndex;
        const selectedOption = select.options[selectedOptionIndex].value;
        select.remove(selectedOptionIndex);

        let dataToSave = JSON.parse(localStorage.getItem('moduleData')) || {};
        delete dataToSave[selectedOption]; // 从数据对象中删除选中项
        localStorage.setItem('moduleData', JSON.stringify(dataToSave)); // 更新localStorage

        // 检查是否有下一个选项，并自动选中
        if (select.options.length > selectedOptionIndex) {
            select.selectedIndex = selectedOptionIndex;
        } else if (select.options.length > 0) {
            select.selectedIndex = selectedOptionIndex - 1;
        }

        // 触发 change 事件来更新 classFunctionDesc 和 classVariable
        select.dispatchEvent(new Event('change'));
    });



    // 添加选项事件
    addBtn.addEventListener('click', () => {
        const newOption = prompt("请输入新的类选项:");
        if (newOption) {
            const option = new Option(newOption, newOption);
            select.add(option);
            select.value = newOption; // 选择新添加的选项

            // 清空描述和变量输入框
            classFunctionDesc.value = '';
            classVariable.value = '';

            // 保存新添加的选项（没有描述和变量）
            saveData();
        }
    });


    // 当选择变化时更新 textarea
    document.getElementById('classFileSelect').addEventListener('change', () => {
        // 当用户更改选择时，更新对应的描述和变量
        const classFunctionDesc = document.getElementById('classFunctionDesc');
        const classVariable = document.getElementById('classVariable');
        const selectedOption = document.getElementById('classFileSelect').value;

        const savedData = JSON.parse(localStorage.getItem('moduleData')) || {};
        classFunctionDesc.value = savedData[selectedOption]?.functionDesc || '';
        classVariable.value = savedData[selectedOption]?.variableDesc || '';

        // 继续监听 input 事件
        classFunctionDesc.addEventListener('input', saveData);
        classVariable.addEventListener('input', saveData);
    });


}

// 保存数据到 localStorage
function saveData() {
    const select = document.getElementById('classFileSelect');
    let dataToSave = JSON.parse(localStorage.getItem('moduleData')) || {};

    // 保存关键文件树
    dataToSave.keyfileTree = document.getElementById('keyfileTree').value;

    // 仅保存当前选中的选项
    const selectedOption = select.value;
    dataToSave[selectedOption] = {
        functionDesc: document.getElementById('classFunctionDesc').value,
        variableDesc: document.getElementById('classVariable').value
    };

    localStorage.setItem('moduleData', JSON.stringify(dataToSave));
}

// 直接为复制按钮绑定复制功能的事件监听器
document.getElementById('copyButton').addEventListener('click', copyAllDataToClipboard);

// 为返回按钮添加点击事件监听器
document.getElementById('backButton').addEventListener('click', function() {
    localStorage.removeItem('lastOpenedPage');
    window.location.href = '../popup.html'; // 返回到 popup.html
});
