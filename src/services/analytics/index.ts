// @ts-ignore
/* eslint-disable */
import { getQueryString, timeZone } from '@/util';
import { request } from 'umi';

/** 获取日用户数据 GET /console/admin/analytics/day/uniques/{offset} */
export async function dayUniques(offset: number) {
  return request<DTO.Resp<any>>(`${API_URL}/job/admin/analytics/day/uniques`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      offset: offset,
      timeZone: timeZone(),
    }),
    processData: false,
  });
}

/** 获取月用户数据 GET /console/admin/analytics/month/uniques/{offset} */
export async function monthUniques(offset: number) {
  return request<DTO.Resp<any>>(`${API_URL}/job/admin/analytics/month/uniques`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      offset: offset,
      timeZone: timeZone(),
    }),
    processData: false,
  });
}

/** 获取月订单数据 GET /console/admin/analytics/month/orders/{offset} */
export async function monthOrders(offset: number) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/analytics/month/orders/` + offset, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取月会员注册量数据 GET /console/admin/analytics/month/member/{offset} */
export async function monthMembers(offset: number) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/analytics/month/members/` + offset, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取利润数据 GET /console/admin/analytics/profit */
export async function profits() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/analytics/profit`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取订单数据 GET /console/admin/analytics/order */
export async function orders() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/analytics/order`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取订单数据 GET /console/admin/analytics/member */
export async function members() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/analytics/member`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取订单数据 GET /console/admin/analytics/vip */
export async function vips() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/analytics/vip`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取代理商利润数据 GET /console/admin/agent/analytics/income */
export async function agentIncome() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/agent/analytics/income`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取代理商订单数据 GET /console/admin/agent/analytics/order */
export async function agentOrder() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/agent/analytics/order`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取代理商订单数据 GET /console/admin/agent/analytics/member */
export async function agentMember() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/agent/analytics/member`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}
