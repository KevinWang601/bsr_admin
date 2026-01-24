import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField, ProFormTextArea } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { ProForm, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import { request } from 'umi';
import { message } from 'antd';
import { useRef } from 'react';

const SeoMetaEdit: React.FC<EditType> = (props) => {
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
        <ProFormSelect
          width="md"
          name="host"
          label="域"
          options={[
            {
              label: 'FAV',
              value: 2,
            },
            {
              label: '51',
              value: 3,
            },
          ]}
          placeholder="请选择域名"
          rules={[{ required: true, message: '请选择域名' }]}
        />
        <ProFormText
          width="md"
          name="section"
          label="栏目名称"
          placeholder="请输入栏目名称"
          rules={[{ required: true, message: '请输入栏目名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="sectionUrl"
          label="栏目地址"
          placeholder="请输入栏目地址"
          rules={[{ required: true, message: '请输入栏目地址' }]}
        />
        <ProFormSelect
          width="md"
          name="type"
          label="属性类型"
          options={[
            {
              label: 'title',
              value: 1,
            },
            {
              label: 'name',
              value: 2,
            },
            {
              label: 'property',
              value: 3,
            },
          ]}
          placeholder="请选择类型"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="key" label="属性名" placeholder="请输入属性名" />
        <ProFormDigit
          width="md"
          name="sort"
          min={0}
          label="排序"
          placeholder="倒序排列"
          rules={[{ required: true, message: '请输入排序' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={500}
          fieldProps={{ style: { height: '160px' }, maxLength: 512 }}
          label="属性值"
          name="content"
          rules={[{ required: true, message: '请填写属性值' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default SeoMetaEdit;
