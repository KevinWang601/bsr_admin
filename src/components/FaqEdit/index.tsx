import { getQueryString, timeZoneConverter } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormTextArea } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const FaqEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      if (record) {
        record.endTime = timeZoneConverter(record.endTime);
      }
      formRef.current?.setFieldsValue(record || { sort: 0, timeZone: 'America/Los_Angeles' });
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        values.startTime =
          values.limitTime && values.limitTime.length > 0 ? values.limitTime[0] : '';
        values.endTime = values.limitTime && values.limitTime.length > 1 ? values.limitTime[1] : '';
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
        <ProFormTextArea
          width={580}
          fieldProps={{ style: { height: '120px' }, maxLength: 255 }}
          label="问题内容"
          name="question"
          rules={[{ required: true, message: '请输入问题内容' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={580}
          fieldProps={{ style: { height: '120px' }, maxLength: 500 }}
          label="答案内容"
          name="answer"
          rules={[{ required: true, message: '请输入答案内容' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={580}
          fieldProps={{ style: { height: '120px' }, maxLength: 500 }}
          label="操作内容"
          name="manual"
          rules={[{ required: true, message: '请输入操作内容' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit width="md" name="sort" min={0} label="排序" />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default FaqEdit;
