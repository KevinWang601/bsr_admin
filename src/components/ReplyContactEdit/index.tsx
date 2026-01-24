import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormTextArea } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const ReplyContactEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { status: 0 });
      if (record) {
        formRef.current?.setFieldsValue({
          ...record,
          customerId: record.customer?.id,
          title:
            record.content.length > 10
              ? '关于' + record.content.substring(0, 10) + '...的回复'
              : '关于' + record.content + '的回复',
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
      <ProFormField hidden={true} name="customerId" />
      <ProForm.Group>
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
        />
        <ProFormText
          width="md"
          name="title"
          label="标题"
          placeholder="请输入标题"
          rules={[{ required: true, message: '请输入标题' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={500}
          fieldProps={{ style: { height: '160px' }, maxLength: 1000 }}
          label="消息内容"
          name="content"
          rules={[{ required: true, message: '请填写消息内容' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default ReplyContactEdit;
