import axios from 'axios';

axios.defaults.withCredentials = false;
axios.interceptors.request.use(function (config) {
    config.timeout = 3000;
    // 若是有做鉴权token , 就给头部带上token
    let token = sessionStorage.getItem("token")
    if (token) {
        config.headers.Authorization = token;
    }    
    return config;
}, function (error) {
    // 当请求异常时做一些处理
    return Promise.reject(error);
});

export default axios;