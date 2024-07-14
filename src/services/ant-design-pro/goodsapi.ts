import { request } from '@umijs/max';

//获取商品列表
export async function GetGoods(params: any) {
  return request('/api/admin/goods', {
    method: 'GET',
    params,
  });
}

//是否上架
export async function UporDown(uid: any) {
  return request(`/api/admin/goods/${uid}/on`, {
    method: 'PATCH',
  });
}
//获取商品详情
export async function showGoods(editId: any) {
  return request(`/api/admin/goods/${editId}?include=category`, {
    method: 'GET',
  });
}

//添加商品
export async function addGoods(data: any) {
  return request('/api/admin/goods', {
    method: 'POST',
    data,
  });
}
//更新商品
export async function updateGoods(editId: any, data: any) {
  return request(`/api/admin/goods/${editId}`, {
    method: 'PUT',
    data,
  });
}
