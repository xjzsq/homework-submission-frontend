// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户名可用性检查接口 GET /api/register/checkUsername */
export async function checkUsername(
  body: API.CheckUsernameParams,
  options?: { [key: string]: any },
) {
  return request<{
    data: boolean;
  }>('/api/register/checkUsername', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 密码注册接口 POST /api/register/password */
export async function passwordRegister(
  params: API.PasswordRegisterParams,
  options?: { [key: string]: any },
) {
  return request('/api/register/password', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 验证器注册接口 POST /api/register/auth */
export async function authRegister(
  params: API.AuthRegisterParams,
  options?: { [key: string]: any },
) {
  return request('/api/register/auth', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 验证器代码验证接口 POST /api/register/checkToken */
export async function checkToken(params: API.TokenCheckParams, options?: { [key: string]: any }) {
  return request('/api/register/checkToken', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 通知获取端口 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
