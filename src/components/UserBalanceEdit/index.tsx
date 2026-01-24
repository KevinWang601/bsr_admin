import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormField,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const UserBalanceEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      if (record) {
        formRef.current?.setFieldsValue({
          ...record,
          balance: 0,
        });
      } else {
        formRef.current?.setFieldsValue({ balance: 0 });
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
        <ProFormDigit
          width="md"
          name="balance"
          label="账户余额"
          min={-Infinity}
          placeholder="请输入账户余额"
          rules={[{ required: true, message: '请输入账户余额' }]}
        />
        <ProFormText width="md" name="note" label="备注" placeholder="请输入备注" />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default UserBalanceEdit;
