import http from './axios'
/**
 * 这里统一处理项目中所有的 api 接口
 */

// demo 某功能比如获取一个列表
export const login = data => http.post('/login', data)
// 人脸分析
export const faceAnalyze = data => http.post('/face/analyze', data)
