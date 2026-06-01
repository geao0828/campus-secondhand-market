/**
 * Axios 请求封装
 * @description 统一处理请求拦截、响应拦截、错误处理等
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * 创建 axios 实例
 * - baseURL: 空字符串，请求路径使用绝对路径（Vite 代理处理）
 * - timeout: 10秒超时
 * - headers: 默认 Content-Type 为 application/json
 */
const request = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

/**
 * 请求拦截器
 * - 自动添加 token 到请求头
 * - 处理 FormData 上传时删除 Content-Type（让浏览器自动设置）
 */
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token')
    if (token) {
      // 携带 token 进行身份验证
      config.headers.Authorization = `Bearer ${token}`
    }
    // 文件上传时删除默认 Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * 响应拦截器
 * - 统一处理业务错误码
 * - 处理 HTTP 状态码错误
 */
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 如果业务代码不是 200，提示错误信息
    if (res.code && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    // 根据 HTTP 状态码处理不同错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请登录')
          // 清除本地 token
          localStorage.removeItem('token')
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(error.message || '请求失败')
      }
    } else {
      // 网络错误（请求超时、网络断开等）
      ElMessage.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  }
)

export default request
