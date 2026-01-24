// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 登录接口 POST /console/admin/ */
export async function login(body: DTO.LoginParams, options?: { [key: string]: any }) {
  return request<DTO.Resp<DTO.Login>>(`${API_URL}/console/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString(body),
    processData: false,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /console/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<void>(`${API_URL}/console/logout`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取验证码 POST /console/code */
export async function code(id: string) {
  return request<string>(`${API_URL}/console/code?cur=` + id, {
    method: 'GET',
    responseType: 'blob',
  }).then((res) => {
    const blob = new Blob([res]);
    return URL.createObjectURL(blob);
  });
}
