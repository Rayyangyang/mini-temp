import request from '@/utils/request.js';


// 获取系统参数
export async function getSysParams(data) {
  return request('/common/getCode', { data });
}

// 获取时间戳
export async function getTimestamp(data) {
  return request('/user/getCurSysTimestamp', { data });
}

// 获取验证码
export async function getMsgCode(data) {
  return request('/user/msgCode', { data });
}

// 登录
export async function login(data) {
  return request('/user/login', { data });
}

// 意见反馈
export async function feedback(data) {
  return request('/user/feedback', { data, method: 'POST' });
}
// 联系客服
export async function contact(data) {
  return request('/user/staff', { data });
}

// 修改手机号
export async function changePhone(data) {
  return request('/user/updateAccount', { data, method: 'POST' });
}


// 检测安卓更新
export async function checkAndroidUpdate(data) {
  return request('/common/checkUpdate', { data });
}