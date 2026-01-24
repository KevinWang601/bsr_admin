// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取用户列表 POST /console/admin/role/list */
export async function roleList(menuId: string, page: number, rows: number, keyword?: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/role/list`, {
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

/** 获取用户权限列表 GET /console/admin/role/loadprivilege/{id} */
export async function loadPrivilege(roleId: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/role/loadprivilege/` + roleId, {
    method: 'GET',
    processData: false,
  });
}
