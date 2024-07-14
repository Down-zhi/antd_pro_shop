// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  // return request<{
  //   data: API.CurrentUser;
  // }>('/api/currentUser', {
  //   method: 'GET',
  //   ...(options || {}),
  // });
  //自己的代码
  return request<{
    data: API.CurrentUser;
  }>('/api/admin/users', {
    //应该是user写错了但是暂时不改了
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
// export async function outLogin(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/login/outLogin', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  // return request<API.LoginResult>('/api/login/account', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: body,
  //   ...(options || {}),
  // });
}
//获取统计面板数据
export async function Dashboard(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/index', {
    method: 'GET',
    ...(options || {}),
  });
}
//获取用户列表
export async function GetUsers(params: any) {
  return request('/api/admin/users', {
    method: 'GET',
    params,
  });
}
//是否启用
export async function lockUser(uid: any) {
  return request(`/api/admin/users/${uid}/lock`, {
    method: 'PATCH',
  });
}
//添加用户
export async function addUser(data: any) {
  return request('/api/admin/users', {
    method: 'POST',
    data,
  });
}
//用户详情
export async function showUser(editId: any) {
  return request(`/api/admin/users/${editId}`, {
    method: 'GET',
  });
}
//更新用户
export async function updateUser(editId: any, data: any) {
  return request(`/api/admin/users/${editId}`, {
    method: 'PUT',
    data,
  });
}
/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
