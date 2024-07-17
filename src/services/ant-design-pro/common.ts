import { request } from '@umijs/max';

//从服务器请求oss签名，带着签名把文件上传到云存储
export async function OssConfig() {
  return request('/api/auth/oss/token', {
    method: 'GET',
  });
}
//这里不return，Network可以显示后台返回的数据，但是打印出来时是undefind
