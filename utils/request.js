import { requestUrl, getToken } from '@/utils/config';
import md5 from 'md5';

let isShowModal = false
const request = async (url, { data, method, requestType }) => {
  data && Object.keys(data).forEach(key => [undefined,null].includes(data[key]) && delete data[key])
  if (url.substr(0, 4) != 'http') url = requestUrl + url
  console.log(url, data)
  const timestamp = new Date().getTime()
  const rand = Math.floor(Math.random() * 100) //0-100随机整数
  try {
  	const res = await uni.request({
  		url,
  		data,
  		method: method?.toUpperCase() || 'GET',
  		header: {
  			'Content-Type': requestType == 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
  			'token': getToken() || '',
  			'api-version': 1,
  			timestamp,
  			rand,
  			apiSecret: md5(md5(timestamp + "ccys" + rand)),
  		}
  	})
  	if (res.statusCode == 200) {
  	  return res.data
  	} else if (res.statusCode == 401) {
  	  uni.removeStorageSync('unionuser');
  	  uni.removeStorageSync('token');
  	  uni.hideLoading() //清除有可能存在的showLoading效果
  	  uni.hideToast() //清除有可能存在的showTaost效果
  	  if (!isShowModal) {
  	    isShowModal = true
  	    uni.showModal({
  	      title: '注意',
  	      content: '您的登录信息已过期，请重新登录！',
  	      showCancel: false,
  	      success: res => {
  	        if (res.confirm) {
  	          console.log('用户点击确定')
  	          isShowModal = false
  	        }
  	      }
  	    })
  	  }
  	  throw res // 401抛除异常，页面上要catch到做业务处理 比如在我的页面401之后要catch做页面刷新处理
  	} else {
  	  if (!isShowModal) {
  	    isShowModal = true
  	    uni.showModal({
  	      title: String(res.data.status),
  	      content: res.data.error,
  	      showCancel: false,
  	      confirmText: '知道了',
  	      success: res => {
  	        if (res.confirm) {
  	          isShowModal = false
  	        }
  	      }
  	    })
  	  }
  	}
  } catch (res) {
  	console.log(res, 'catchRes')
  	if (!isShowModal && !res.statusCode) {
  	  isShowModal = true
  	  uni.showModal({
  	    title: '网络错误',
  	    content: 'net::ERR_FAILED',
  	    showCancel: false,
  	    confirmText: '知道了',
  	    success: res => {
  	      if (res.confirm) {
  	        isShowModal = false
  	      }
  	    }
  	  })
  	}
  	throw res
  }
};

export default request