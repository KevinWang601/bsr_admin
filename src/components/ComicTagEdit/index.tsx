import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit, ProFormRadio } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const ComicTagEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      console.log(record);
      formRef.current?.setFieldsValue(record || { tag: 1, type: 2, show: 1, sort: 0 });
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
        <ProFormDigit
          width="md"
          name="sort"
          label="排序"
          placeholder="请输入排序(降序排列)"
          rules={[{ required: true, message: '请输入排序' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          width="md"
          name="type"
          label="分类"
          options={[
            {
              label: '全部',
              value: 0,
            },
            {
              label: '少男',
              value: 1,
            },
            {
              label: '少女',
              value: 2,
            },
            {
              label: '图库',
              value: 3,
            },
            {
              label: '绅士',
              value: 4,
            },
          ]}
        />
        <ProFormRadio.Group
          width="md"
          name="show"
          label="显示状态"
          options={[
            {
              label: '显示',
              value: 1,
            },
            {
              label: '不显示',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default ComicTagEdit;
