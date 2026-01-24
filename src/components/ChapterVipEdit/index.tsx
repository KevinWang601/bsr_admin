import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const ChapterVipEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { status: 1, type: 1 });
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
      <ProFormField hidden={true} name="novelId" />
      <ProForm.Group>
        <ProFormRadio.Group
          width="lg"
          name="member"
          label="会员章节"
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
        <ProFormDigit
          width="md"
          name="price"
          label="价格"
          placeholder="请设置价格,0不收费"
          min={0}
          rules={[{ required: true, message: '请输入章节价格' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default ChapterVipEdit;
