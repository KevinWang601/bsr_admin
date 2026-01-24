// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取刷卡订单列表 POST /v3/admin/card/order/list */
export async function cardOrderList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  startTime?: string,
  endTime?: string,
  status?: number,
  timeZone?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/v3/admin/card/order/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      startTime: startTime,
      endTime: endTime,
      status: status,
      timeZone: timeZone,
    }),
    processData: false,
  });
}
