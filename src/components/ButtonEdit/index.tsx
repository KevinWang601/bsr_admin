import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-components';
import { loadMenu } from '@/services/menu';
import { message } from 'antd';
import { request } from 'umi';
import { getQueryString } from '@/util';
import type { SetStateAction } from 'react';
import { useRef } from 'react';

const ButtonEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;
  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { status: 1, nameDesc: '系统管理员' });
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        const resp = await request<DTO.Resp<any>>(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: getQueryString(values),
          processData: false,
        });

        if (resp.result === 'success') {
          message.success('操作成功');
          if (actionRef && actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        } else {
          message.error(resp.msg);
          return false;
        }
      }}
    >
      <ProFormField hidden={true} name="id" />
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="menuId"
          label="所属菜单"
          request={async () => {
            const menus = await loadMenu();
            const options: SetStateAction<{ label: string; options: any[] }[]> = [];
            for (let i = 0; i < menus.length; i++) {
              const menu = menus[i];
              if (menu.children === null || menu.children.length === 0) continue;
              const children: any = [];
              const option = { label: menu.name, value: menu.id, options: children };
              for (let j = 0; j < menu.children.length; j++) {
                const child = menu.children[j];
                children.push({
                  label: child.name,
                  value: child.id,
                });
              }
              options.push(option);
            }
            return options;
          }}
          debounceTime={10}
          placeholder="请选择所属菜单"
          rules={[{ required: true, message: '请选则所属菜单' }]}
        />
        <ProFormText
          width="md"
          name="name"
          label="按钮名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="url"
          label="按钮地址"
          placeholder="请输入后台地址"
          rules={[{ required: true, message: '请输入后台地址' }]}
        />
        <ProFormText
          width="md"
          name="authPattern"
          label="权限标识"
          placeholder="请输入权限标识"
          rules={[{ required: true, message: '请输入权限标识' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="position"
          label="位置"
          options={[
            {
              label: '全局',
              value: 1,
            },
            {
              label: '列表',
              value: 2,
            },
            {
              label: '隐藏',
              value: 3,
            },
          ]}
          placeholder="请选择位置"
        />
        <ProFormSelect
          width="md"
          name="notify"
          label="提示"
          options={[
            {
              label: '表单提交',
              value: 0,
            },
            {
              label: '确认提示',
              value: 1,
            },
            {
              label: '不提示',
              value: 2,
            },
          ]}
          placeholder="请选择提示类型"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="nameDesc" label="备注信息" placeholder="备注信息" />
        <ProFormRadio.Group
          name="status"
          label="菜单状态"
          options={[
            {
              label: '正常',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default ButtonEdit;
