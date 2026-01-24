import type { ProFormInstance } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import { request } from 'umi';
import { getQueryString } from '@/util';
import { useRef } from 'react';

const PopularGroupEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url, ids } = props;
  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record);
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        values.ids = ids;
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
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="group"
          label="分组"
          options={[
            {
              label: '默认',
              value: 0,
            },
            {
              label: '星期一',
              value: 2,
            },
            {
              label: '星期二',
              value: 3,
            },
            {
              label: '星期三',
              value: 4,
            },
            {
              label: '星期四',
              value: 5,
            },
            {
              label: '星期五',
              value: 6,
            },
            {
              label: '星期六',
              value: 7,
            },
            {
              label: '星期日',
              value: 1,
            },
          ]}
          placeholder="请选择分组"
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default PopularGroupEdit;
