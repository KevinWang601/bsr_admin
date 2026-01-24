import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { request } from 'umi';
import { getQueryString } from '@/util';
import { useRef } from 'react';

const AppEndpointEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;
  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { type: 0, network: 0, sort: 0, status: 1 });
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
          name="type"
          label="类型"
          options={[
            {
              label: '请选择类型',
              value: 0,
            },
            {
              label: 'API',
              value: 1,
            },
            {
              label: 'CDN',
              value: 2,
            },
          ]}
          placeholder="请选择类型"
        />
        <ProFormText
          width="md"
          name="name"
          label="名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="url"
          label="地址"
          placeholder="请输入地址"
          rules={[{ required: true, message: '请输入地址' }]}
        />
        <ProFormSelect
          width="md"
          name="network"
          label="CDN网络"
          options={[
            {
              label: '请标注CDN网络',
              value: 0,
            },
            {
              label: '全球加速',
              value: 1,
            },
            {
              label: '香港加速',
              value: 2,
            },
            {
              label: '国内加速',
              value: 3,
            },
          ]}
          placeholder="CDN网络"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit width="md" name="sort" label="排序" placeholder="排序" />
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
      <ProForm.Group>
        <ProFormTextArea
          width={688}
          fieldProps={{ style: { height: '120px' } }}
          label="说明"
          name="note"
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default AppEndpointEdit;
