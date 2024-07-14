import { request } from '@umijs/max';
//获取分类列表
export async function getCategory() {
  return request('/api/admin/category');
}
