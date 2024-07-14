import { request } from '@umijs/max';

//从服务器请求oss签名，带着签名把文件上传到云存储
export async function OssConfig() {
  request('/api/auth/oss/token', {
    method: 'GET',
  });
}
