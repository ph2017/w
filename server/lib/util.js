const fs = require('fs');
const path = require('path');

const read = async fileName => {
  const dataFilePath = path.join(__dirname, `../model/${fileName}.json`);
  if (fs.existsSync(dataFilePath)) {
    const data = await fs.promises.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// 封装保存data.json数据函数
const save = async (data, fileName) => {
  const dataFilePath = path.join(__dirname, `../model/${fileName}.json`);
  if (fs.existsSync(dataFilePath)) {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(dataFilePath, jsonData, 'utf-8');
  } else {
    console.log('file not found');
    throw new Error('file not found');
  }
};
exports.read = read;
exports.save = save;
