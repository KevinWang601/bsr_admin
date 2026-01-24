import { novelVolume } from '@/services/nvoel';
import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDigit,
  ProFormField,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import { message } from 'antd';
import { SetStateAction, useRef } from 'react';
import { request } from 'umi';

const NovelVolumeAdd: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue({
        novelId: record.id,
        title: '',
        novelTitle: record.title,
        sort: 1,
        status: 1,
      });
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
      <ProFormField hidden={true} name="novelId" />
      <ProForm.Group>
        <ProFormText
          width="md"
          name="novelTitle"
          label="小说名称"
          placeholder="请输入小说名称"
          disabled={true}
        />
        <ProFormSelect
          showSearch
          width="md"
          label="当前卷"
          request={async () => {
            const options: SetStateAction<{ label: string; value: string }[]> = [];
            const resp = await novelVolume(record.id);
            const volumes = resp.model;
            for (let i = 0; i < volumes.length; i++) {
              const volume = volumes[i];
              const option = { label: volume.title + ' - ' + volume.sort, value: volume.id };
              options.push(option);
            }
            return options;
          }}
          debounceTime={10}
          placeholder="当前存在的卷列表"
        />
        <ProFormText
          width="md"
          name="title"
          label="卷名称"
          placeholder="请输入卷名称"
          rules={[{ required: true, message: '请输入卷名称' }]}
        />
        <ProFormDigit
          width="md"
          name="sort"
          min={1}
          label="卷序号"
          placeholder="请输入卷序号"
          rules={[{ required: true, message: '请输入卷序号' }]}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            {
              label: '上架',
              value: 1,
            },
            {
              label: '下架',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default NovelVolumeAdd;
