// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取菜单列表 POST /console/admin/button/list */
export async function buttonList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  parentMenuId?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/button/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      parentMenuId: parentMenuId,
    }),
    processData: false,
  });
}

/** 获取父菜单 GET /console/admin/menu/parent */
// export async function loadParent() {
//   return request<DTO.Resp<any>>(`${API_URL}/console/admin/menu/parent`, {
//     method: 'GET',
//     processData: false,
//   });
// }
