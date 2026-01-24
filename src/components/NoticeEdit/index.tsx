import { getQueryString, timeZoneConverter } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const NoticeEdit: React.FC<EditType> = (props) => {
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
          label="公告内容"
          name="content"
          rules={[{ required: true, message: '请输入公告内容' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormField label="链接" width="md" name="link" placeholder="请输入链接地址" />
        <ProFormDateTimeRangePicker
          width="md"
          name="limitTime"
          label="日期时间"
          fieldProps={{
            format: (value) => value.format('YYYY-MM-DD HH:mm:ss'),
          }}
        />
        <ProFormSelect
          width="md"
          name="timeZone"
          label="时区"
          options={[
            {
              value: 'Asia/Shanghai',
              label: '上海',
            },
            {
              value: 'America/Los_Angeles',
              label: '洛杉矶',
            },
          ]}
        />
        <ProFormDigit width="md" name="sort" min={0} label="排序" />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default NoticeEdit;
