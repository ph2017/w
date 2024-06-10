import axios from 'axios';
import { message } from 'antd';


const instance = axios.create({});

// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        // 异常处理
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        return response && response.data;
    },
    function (error) {
        // 异常处理
        message.error(error?.response?.data?.msg || '系统繁忙，请稍后再试');
        return Promise.reject(error);
    }
);

export default instance;
