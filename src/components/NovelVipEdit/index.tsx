import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const NovelVipEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          startMemberChapter: 0,
          startVipChapter: 0,
          startPriceChapter: 0,
          chapterPrice: 0,
        },
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
        <ProFormDigit
          width="md"
          name="startMemberChapter"
          label="会员章节"
          placeholder="从第几话开始设置会员,0不设置"
          min={0}
          rules={[{ required: true, message: '请输入会员章节' }]}
        />
        <ProFormDigit
          width="md"
          name="startPriceChapter"
          label="收费章节"
          placeholder="从第几话开始收费,0不设置"
          min={0}
          rules={[{ required: true, message: '请输入收费章节' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="chapterPrice"
          label="章节价格"
          placeholder="请设置章节价格,0不收费"
          min={0}
          rules={[{ required: true, message: '请输入章节价格' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default NovelVipEdit;
