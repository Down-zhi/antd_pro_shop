import { request } from '@umijs/max';
//获取分类列表
export async function getCategory(type: any) {
  return request('/api/admin/category', {
    type,
  });
}
//不需要params ,如果不需要查询就
export async function getcategory(type: string) {
  return request('/api/admin/category?type,', {
    method: 'GET',
    params: {
      type,
    },
  });
}
//添加
export async function addCategory(data: any) {
  return request('/api/admin/category', {
    method: 'POST',
    data,
  });
}
//是否启用
//是否上架
export async function UseorBan(uid: any) {
  return request(`/api/admin/category/${uid}/status`, {
    method: 'PATCH',
  });
}
