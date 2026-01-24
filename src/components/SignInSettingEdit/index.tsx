import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const SignInSettingEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      if (record) {
        formRef.current?.setFieldsValue(record);
      } else {
        formRef.current?.setFieldsValue({
          continueDay: 0,
          integral: 0,
          continueIntegral: 0,
          sort: 0,
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
      <ProForm.Group>
        <ProFormField
          width="md"
          name="dateName"
          label="签到名称"
          rules={[{ required: true, message: '请填写签到名称' }]}
        />
        <ProFormDigit
          label="星期几"
          min={0}
          width="md"
          name="sort"
          placeholder="1-7表示周1-周日"
          rules={[{ required: true, message: '请输入星期几' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit min={0} width="md" label="签到积分" name="integral" />
        <ProFormDigit min={0} width="md" label="连续天数" name="continueDay" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit min={0} width="md" label="连续签到积分" name="continueIntegral" />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default SignInSettingEdit;
