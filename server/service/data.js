const { read, save } = require('../lib/util');

const FILE_NAME = 'data';

/**
 * 新增数据函数
 * @param {object} newData - 新数据对象
 */
async function addData(newData) {
  try {
    const dataList = await read(FILE_NAME);
    save([...dataList, newData], FILE_NAME);
  } catch (error) {
    throw error;
  }
}

/**
 * 查询数据函数
 * @param {number} pageNo - 页码
 * @param {number} pageSize - 每页数据数量
 * @param {string} name - 名称
 * @param {string[]} tags - 标签数组
 * @param {Date} startTime - 开始时间
 * @param {Date} endTime - 结束时间
 * @returns {object} - 包含查询结果的对象
 */
/* eslint-disable */  
async function getData(pageNo, pageSize, name, tags, startTime, endTime) {
  try {
    // 读取data.json文件中的数据
    const dataList = await read(FILE_NAME);

    let filteredData = dataList.reverse(); //倒叙排列

    // console.log('dataList', dataList);
    // 根据名称进行过滤
    if (name) {
      filteredData = filteredData.filter(item => item.name.includes(name));
    }
    // 根据标签进行过滤
    if (tags) {
      const tagsArr = tags.split(',')
      filteredData = filteredData.filter(item => item.tags.some(tag => tagsArr.indexOf(tag) > -1));
    }
    // 根据时间范围过滤
    if (startTime && endTime) {
      filteredData = filteredData.filter(item => item.time <= endTime && item.time >= startTime);
    }
    // 计算总数
    const count = filteredData.length;

    if (pageNo && pageSize) {
      // 根据分页信息进行分页
      const startIdx = (pageNo - 1) * pageSize;
      const endIdx = pageNo * pageSize;
      filteredData = filteredData.slice(startIdx, endIdx);
    }
    // 返回查询结果
    return { count, data: filteredData };
  } catch (error) {
    throw error;
  }
}

/**
 * 修改数据函数
 * @param {string} id - 数据ID
 * @param {string} name - 名称
 * @param {string} description - 描述
 * @param {string[]} tags - 标签数组
 */
/* eslint-disable */  
async function editData(id, name, description, tags) {
  try {
    const dataList = await read(FILE_NAME);
    const matchData = dataList.find(item => item.id === id)
    matchData.name = name;
    matchData.description = description;
    matchData.tags = tags;
    save(dataList, FILE_NAME);
  } catch (error) {
    throw error;
  }
}

/**
 * 删除数据函数
 * @param {string} id - 数据ID
 */
async function delData(id) {
  try {
    const dataList = await read(FILE_NAME);

    const isDataExists = dataList.some(data => data.id === id);
    if (!isDataExists) {
      throw { status: 400, message: '数据不存在' };
    }
    const newDataList = dataList.filter(data => data.id !== id);
    save(newDataList, FILE_NAME);
  } catch (error) {
    throw error;
  }
}

/**
 * 根据id查数据
 * @param {string} id id字符串
 * @returns 
 */
async function getDataById(id) {
  try {
    // 读取data.json文件中的数据
    const dataList = await read(FILE_NAME);
    const matchData = dataList.find(item => item.id === id)
    // 返回查询结果
    return matchData;
  } catch (error) {
    throw error;
  }
}

// 导出数据查询服务函数
module.exports = {
  getData,
  addData,
  editData,
  delData,
  getDataById
};
