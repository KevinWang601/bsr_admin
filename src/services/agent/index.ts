// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取用户列表 POST /console/admin/agent/customer/list */
export async function agentCustomerList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  roleId?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/agent/customer/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      roleId: roleId,
    }),
    processData: false,
  });
}

/** 获取分销订单列表 POST /console/admin/agent/performance/list */
export async function agentPerforanceList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  roleId?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/agent/performance/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      roleId: roleId,
    }),
    processData: false,
  });
}

/** 获取分销提现列表 POST /console/admin/agent/withdraw/list */
export async function agentWithdrawList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  roleId?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/agent/withdraw/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      roleId: roleId,
    }),
    processData: false,
  });
}

/** 获取余额 POST /console/admin/agent/withdraw/balance */
export async function agentBalance(agentId: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console//admin/agent/withdraw/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      agentId: agentId,
    }),
    processData: false,
  });
}
