export const requestUrl = 'http://47.106.228.230:8080/yijie'
export const ossHost = 'https://yijiechuangda.oss-cn-chengdu.aliyuncs.com'
export const ossSuffix = '?x-oss-process=video/snapshot,t_1000,m_fast' //oss视频链接拼接此后缀即为视频封面图
export const getToken = () => {
  try {
    return uni.getStorageSync('token')
  } catch (e) { }
  return null;
}
export const setToken = token => {
  try {
    return uni.setStorageSync('token', token)
  } catch (e) { }
  return null;
}
export const getUnionuser = () => {
  try {
    return uni.getStorageSync('unionuser')
  } catch (e) { }
  return null;
}
export const setUnionuser = unionuser => {
  try {
    return uni.setStorageSync('unionuser', unionuser)
  } catch (e) { }
  return null;
}