import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-components';
import { ProForm, ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import { request } from 'umi';
import { message } from 'antd';
import { useRef } from 'react';

const PopularNovelEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          sort: 0,
        },
      );
    } else {
      if (actionRef && actionRef.current) {
        actionRef.current.reload();
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
        const formData = getFormData(values);
        const resp = await request<DTO.Resp<any>>(url, {
          method: 'POST',
          data: formData,
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
        <ProFormDigit
          width="md"
          name="sort"
          min={0}
          label="排序"
          placeholder="倒序排列"
          rules={[{ required: true, message: '请输入排序' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default PopularNovelEdit;
