import request from '@/utils/request.js'

// 获取STS认证信息
export async function getSTSInfo(data) {
  return request('/commonApi/sys/getOssInfo', { data })
}