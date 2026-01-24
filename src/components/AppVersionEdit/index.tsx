import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { request } from 'umi';
import { getQueryString } from '@/util';
import { useRef } from 'react';

const AppVersionEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;
  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { platform: 1, forceUpgrade: 0, status: 1 });
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
          name="platform"
          label="平台"
          options={[
            {
              label: '请选择平台',
              value: 0,
            },
            {
              label: '安卓',
              value: 1,
            },
            {
              label: '苹果',
              value: 2,
            },
          ]}
          placeholder="请选择平台"
        />
        <ProFormText
          width="md"
          name="versionName"
          label="版本名称"
          placeholder="请输入版本名称"
          rules={[
            { required: true, message: '请输入版本名称' },
            {
              pattern: new RegExp('^\\d+\\.\\d+\\.\\d+', 'g'),
              message: '请输入正确的版本名称，数字.数字.数字',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width={688}
          name="downloadUrl"
          label="下载地址"
          placeholder="请输入下载地址"
          rules={[{ required: true, message: '请输入下载地址' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="forceUpgrade"
          label="强制更新"
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

      <ProForm.Group>
        <ProFormTextArea
          width={688}
          fieldProps={{ style: { height: '120px' } }}
          label="版本说明"
          name="versionNote"
          rules={[{ required: true, message: '请输入版本说明' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default AppVersionEdit;
