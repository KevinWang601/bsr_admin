import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const RoleEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { status: 1, type: 1 });
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
        <ProFormText
          width="md"
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormText
          width="md"
          name="roleDesc"
          label="角色描述"
          placeholder="请输入角色描述"
          rules={[{}]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="type"
          label="类型"
          options={[
            {
              label: '后台',
              value: 1,
            },
            {
              label: '前台',
              value: 2,
            },
          ]}
        />
        <ProFormRadio.Group
          width="lg"
          name="status"
          label="状态"
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
export default RoleEdit;
