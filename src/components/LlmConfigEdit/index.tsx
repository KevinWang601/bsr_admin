import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit, ProFormRadio, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const LlmConfigEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { status: 0 });
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
          name="name"
          label="模型名称"
          placeholder="请输入模型名称"
          rules={[{ required: true, message: '请输入模型名称' }]}
        />
        <ProFormSelect
          width="md"
          name="provider"
          label="提供商"
          options={[
            {
              label: 'DEEPSEEK',
              value: 'DEEPSEEK',
            },
            {
              label: 'GROK',
              value: 'GROK',
            },
            {
              label: 'ANTHROPIC',
              value: 'ANTHROPIC',
            },
          ]}
          placeholder="请选择供应商"
          rules={[{ required: true, message: '请选择供应商' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="modelId"
          label="模型编号"
          placeholder="请输入模型编号"
          rules={[{ required: true, message: '请输入模型名称' }]}
        />
        <ProFormText
          width="md"
          name="baseUrl"
          label="访问地址"
          placeholder="请输入访问地址"
          rules={[{ required: true, message: '请输入模型访问地址' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width={688}
          name="apiKey"
          label="APIKey"
          placeholder="请输入APIKey"
          rules={[{ required: true, message: '请输入模型APIKey' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="lg"
          name="parameters"
          label="推理参数"
          placeholder="请输入推理参数"
          rules={[{ required: true, message: '请输入推理参数' }]}
        />
        <ProFormDigit
          width="sm"
          name="maxContextTokens"
          label="上下文"
          placeholder="请输入上下文长度"
          min={0}
          rules={[{ required: true, message: '请输入上下文长度' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={688}
          fieldProps={{ style: { height: '100px' } }}
          label="破限词"
          name="jailbreakPrefix"
          rules={[{ required: true, message: '请填写破限词' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
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
    </DrawerForm>
  );
};
export default LlmConfigEdit;
