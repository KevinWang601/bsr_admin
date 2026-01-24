import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const RechargeProductEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || { type: 1, recommend: 0, sort: 0, price: 0.0, discountPrice: 0.0, status: 1 },
      );
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        values.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
          label="商品名称"
          placeholder="请输入商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        />
        <ProFormRadio.Group
          width="md"
          name="type"
          label="类型"
          options={[
            {
              label: 'VIP',
              value: 1,
            },
            {
              label: '金币',
              value: 2,
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="val"
          min={0}
          label="价值"
          placeholder="请输入价值"
          rules={[{ required: true, message: '请输入价值' }]}
        />
        <ProFormDigit
          width="md"
          name="price"
          min={0}
          label="原价"
          placeholder="请输入原价"
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入原价' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="discountPrice"
          min={0}
          label="折扣价"
          placeholder="请输入折扣价"
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入折扣价' }]}
        />
        <ProFormDigit
          width="md"
          name="giftIntegral"
          min={0}
          label="赠送积分"
          placeholder="请输入赠送积分"
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: '请输入赠送积分' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="brief" label="简介" placeholder="请输入简介" />
        <ProFormDigit
          width="md"
          name="sort"
          min={0}
          label="排序"
          placeholder="请输入排序"
          rules={[{ required: true, message: '请输入排序' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          width="md"
          name="recommend"
          label="推荐"
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
        <ProFormRadio.Group
          width="md"
          name="status"
          label="状态"
          options={[
            {
              label: '正常',
              value: 1,
            },
            {
              label: '失效',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default RechargeProductEdit;
