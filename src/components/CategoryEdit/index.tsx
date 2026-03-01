import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit, ProFormRadio } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const CategoryEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { hot: 0, gender: 1, sort: 0 });
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        console.log(values);
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
          label="类型名称"
          placeholder="请输入类型名称"
          rules={[{ required: true, message: '请输入类型名称' }]}
        />
        <ProFormText
          width="md"
          name="slug"
          label="类型标识"
          placeholder="请输入类型标识"
          rules={[{ required: true, message: '请输入类型标识' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          width="md"
          name="gender"
          label="适合性别"
          options={[
            {
              label: '均可',
              value: 0,
            },
            {
              label: '男频',
              value: 1,
            },
            {
              label: '女频',
              value: 2,
            },
          ]}
          rules={[{ required: true, message: '请选择适合性别' }]}
        />
        <ProFormRadio.Group
          width="md"
          name="hot"
          label="是否热门"
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
          rules={[{ required: true, message: '请选择是否热门' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="sort"
          label="排序"
          placeholder="请输入排序(降序排列)"
          rules={[{ required: true, message: '请输入排序' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default CategoryEdit;
