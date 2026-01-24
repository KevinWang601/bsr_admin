import { getQueryString, formatUTCDate } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDateRangePicker } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const GiftEventEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      if (record) {
        record.startTime = formatUTCDate(record.startTime, 'YYYY-MM-DD');
        record.endTime = formatUTCDate(record.endTime, 'YYYY-MM-DD');
        record.limitTime = [record.startTime, record.endTime];
      }
      formRef.current?.setFieldsValue(record || { limitCount: 1, note: '每月免费拆1次' });
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
        <ProFormField
          width="md"
          label="活动名称"
          name="name"
          rules={[{ required: true, message: '请输入活动名称' }]}
        />
        <ProFormField
          width="md"
          label="活动备注"
          name="note"
          rules={[{ required: true, message: '请输入活动备注' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          label="参与次数"
          width="md"
          name="limitCount"
          min={1}
          placeholder="请输入参与次数"
        />
        <ProFormDateRangePicker
          width="md"
          name="limitTime"
          label="活动时间"
          fieldProps={{
            format: (value) => value.format('YYYY-MM-DD'),
          }}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default GiftEventEdit;
