import { loadRoles } from '@/services/user';
import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormField,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import type { SetStateAction } from 'react';
import { useRef } from 'react';
import { request } from 'umi';

const UserEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      if (record) {
        record.password = '';
        record.roleIds = [];
        if (record.roles !== null) {
          for (let i = 0; i < record.roles.length; i++) {
            record.roleIds.push(record.roles[i].id);
          }
        }
        formRef.current?.setFieldsValue({
          ...record,
          ratio: record.agentRatio,
          renewRatio: record.agentRenewRatio,
        });
      } else {
        formRef.current?.setFieldsValue({ gender: '男', status: 1 });
      }
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
          name="loginName"
          label="登录名称"
          placeholder="请输入登录名称"
          rules={[{ required: true, message: '请输入登录名称' }]}
        />
        <ProFormText.Password
          width="md"
          name="password"
          label="登录密码"
          placeholder="请输入登录密码"
          rules={[{}]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          mode="multiple"
          name="roleIds"
          label="分配角色"
          request={async () => {
            const options: SetStateAction<{ label: string; value: string }[]> = [];
            const resp = await loadRoles(1);
            if (resp.result !== 'success') return options;
            const roles = resp.model;
            for (let i = 0; i < roles.length; i++) {
              const role = roles[i];
              const option = { label: role.roleDesc, value: role.id };
              options.push(option);
            }
            return options;
          }}
          debounceTime={10}
          placeholder="请选择所属角色"
          rules={[{ required: true, message: '请选择所属角色' }]}
        />
        <ProFormText
          width="md"
          name="realName"
          label="真实姓名"
          placeholder="请输入真实姓名"
          rules={[{ required: true, message: '请输入真实姓名' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="phone"
          label="联系电话"
          placeholder="请输入联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        />
        <ProFormRadio.Group
          name="gender"
          label="性别"
          options={[
            {
              label: '男',
              value: '男',
            },
            {
              label: '女',
              value: '女',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="ratio"
          label="首单提成"
          placeholder="请输入首单提成比例"
          min={0}
          max={1}
          rules={[{ required: true, message: '请输入首单提成比例' }]}
        />
        <ProFormDigit
          width="md"
          name="renewRatio"
          label="续单提成"
          placeholder="请输入续单提成比例"
          min={0}
          max={1}
          rules={[{ required: true, message: '请输入续单提成比例' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="status"
          label="用户状态"
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
export default UserEdit;
