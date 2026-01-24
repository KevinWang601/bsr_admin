// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取充值产品列表 POST /console/admin/recharge/product/list */
export async function rechargeProductList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/recharge/product/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取充值产品列表 GET /console/admin/recharge/product/all */
export async function rechargeProductAll() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/recharge/product/all`, {
    method: 'GET',
    processData: false,
  });
}

/** 获取支付方式列表 POST /console/admin/payment/method/list */
export async function paymentMethodList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/payment/method/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取充值订单列表 POST /console/admin/recharge/order/list */
export async function rechargeOrderList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  status?: number,
  startTime?: string,
  endTime?: string,
  timeZone?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/recharge/order/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      startTime: startTime,
      endTime: endTime,
      timeZone: timeZone,
      status: status,
    }),
    processData: false,
  });
}

/** 获取余额记录列表 POST /console/admin/balance/record/list */
export async function balanceRecordList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  operate?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/balance/record/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      operate: operate,
    }),
    processData: false,
  });
}

/** 获取余额操作列表 POST /console/admin/balance/record/operates */
export async function loadBalanceOperates() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/balance/record/operates`, {
    method: 'GET',
    processData: false,
  });
}

/** 获取薪资记录列表 POST /console/admin/salary/record/list */
export async function salaryRecordList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  operate?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/salary/record/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      operate: operate,
    }),
    processData: false,
  });
}

/** 获取薪资操作列表 POST /console/admin/salary/record/operates */
export async function loadSalaryOperates() {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/salary/record/operates`, {
    method: 'GET',
    processData: false,
  });
}

/** 获取打赏商品列表 POST /console/admin/reward/product/list */
export async function rewardProductList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/reward/product/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取官方钱包列表 POST /console/admin/meaty/bones/list */
export async function meatyBonesList(menuId: string, page: number, rows: number, keyword?: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/meaty/bones/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
    }),
    processData: false,
  });
}
