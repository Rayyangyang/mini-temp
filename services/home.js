import request from '@/utils/request.js';


export async function query(data) {
  return request('/home/home', { data });
}

// 专区商品列表
export async function queryGoodsList(data) {
  return request('/goods/goodsZone', { data });
}

// 查询热词
export async function queryHotWordList(data) {
  return request('/home/hotWord', { data });
}
