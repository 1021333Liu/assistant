const fs = require('fs');

const filePath = 'newData.json'; // JSON 文件路径
const outputFilePath = 'output.json'; // 输出文件路径

// 读取 JSON 文件并解析成对象
let data = JSON.parse(fs.readFileSync(filePath));

// 将数组转换成一连串的对象字符串，对象之间没有逗号
let result = data.map(item => JSON.stringify(item, null, 2)).join('\n');

// 将结果写入到输出文件
fs.writeFileSync(outputFilePath, result);
console.log("Done")