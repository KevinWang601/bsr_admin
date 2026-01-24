// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { MenuDataItem } from '@ant-design/pro-layout';
import { getQueryString } from '@/util';

/** 加载用户菜单 POST /console/admin/user/menu */
export async function loadMenus(token: string) {
  return request<DTO.Resp<MenuDataItem[]>>(`${API_URL}/console/admin/user/menu`, {
    method: 'GET',
    headers: { token: token },
    processData: false,
  });
}

/** 加载角色 POST /console/admin/common/roles */
export async function loadRoles(type: number) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/common/roles/` + type, {
    method: 'GET',
    processData: false,
  });
}

/** 获取用户列表 POST /console/admin/user/list */
export async function userList(
  menuId: string,
  companyId: string,
  roleId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/user/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      companyId: companyId,
      roleId: roleId,
      page: page,
      rows: rows,
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取用户权限列表 GET /console/admin/user/loadprivilege/{id} */
export async function loadPrivilege(userId: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/user/loadprivilege/` + userId, {
    method: 'GET',
    processData: false,
  });
}
