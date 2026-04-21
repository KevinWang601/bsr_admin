import { loadRoles } from '@/services/user';
import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { ProFormDateTimePicker } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import type { SetStateAction } from 'react';
import { useRef } from 'react';
import { request } from 'umi';

const CustomerEdit: React.FC<EditType> = (props) => {
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
        formRef.current?.setFieldsValue(record);
        if (record.authTimeFormat === '') {
          formRef.current?.setFieldsValue({ authTimeFormat: null });
        }
        if (record.silentTimeFormat === '') {
          formRef.current?.setFieldsValue({ silentTimeFormat: null });
        }
      } else {
        formRef.current?.setFieldsValue({
          gender: '男',
          status: 1,
          balance: 0,
          authorRate: 0,
          shareRate: 0,
        });
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
        console.log(values);
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
          rules={[
            { required: true, message: '请输入登录名称' },
            {
              pattern: new RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$', 'g'),
              message: '请输入正确的邮箱地址',
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="password"
          label="登录密码"
          placeholder="请输入登录密码"
          rules={[
            {
              min: 6,
              message: '密码不能少于6位',
            },
            {
              max: 18,
              message: '密码不能大于18位',
            },
          ]}
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
            const resp = await loadRoles(2);
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
        <ProFormText width="md" name="nickName" label="昵称" placeholder="请输入昵称" />
      </ProForm.Group>
      <ProForm.Group>
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
            {
              label: '保密',
              value: '保密',
            },
          ]}
        />
        <ProFormDateTimePicker
          width="md"
          name="authTimeFormat"
          label="VIP截止日期"
          fieldProps={{
            format: (value) => value.format('YYYY-MM-DD HH:mm:ss'),
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDateTimePicker
          width="md"
          name="silentTimeFormat"
          label="禁言日期"
          fieldProps={{
            format: (value) => value.format('YYYY-MM-DD HH:mm:ss'),
          }}
        />
        <ProFormDigit
          width="md"
          name="balance"
          label="金币"
          placeholder="请输入点券"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入点券' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="authorRate"
          label="创作提成"
          placeholder="请输入提成比例"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入提成比例' }]}
        />
        <ProFormDigit
          width="md"
          name="shareRate"
          label="推广提成"
          placeholder="请输入提成比例"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入提成比例' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="limiting"
          label="限流"
          options={[
            {
              label: '是',
              value: 1,
            },
            {
              label: '否',
              value: 0,
            },
          ]}
        />
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
export default CustomerEdit;
