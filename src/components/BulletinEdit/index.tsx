import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormRadio, ProFormTextArea } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const BulletinEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const contentPettern = `<div class="notice-detail-section">
    <h4>尊敬的各位搬山人：</h4>
    <p>#{消息正文}</p>
    <h4>#{列表标题}</h4>
    <ul>
        <li>#{列表项1}</li>
        <li>#{列表项2}</li>
        <li>#{列表项3}</li>
    </ul>
    <p>感谢大家一直以来的支持与反馈，我们将持续改进，为您提供更好的创作体验。</p>
</div>`;

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || 
        { publisher: '搬山人运营团队', title: '', content: contentPettern, level: 1 });
      if (record) {
        formRef.current?.setFieldsValue(record);
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
        <ProFormText
          width="md"
          name="publisher"
          label="发布人"
          placeholder="请输入发布人"
          rules={[{ required: true, message: '请输入发布人' }]}
        />
        <ProFormText
          width="md"
          name="title"
          label="标题"
          placeholder="请输入标题"
          rules={[{ required: true, message: '请输入标题' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
              width="md"
              name="level"
              label="消息级别"
              options={[
                {
                  label: '普通',
                  value: 1,
                },
                {
                  label: '重要',
                  value: 2,
                },
                {
                  label: '紧急',
                  value: 3,
                },
              ]}
              rules={[{ required: true, message: '请选择消息级别' }]}
            />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={688}
          fieldProps={{ style: { height: '460px' }, maxLength: 2000 }}
          label="公告内容"
          name="content"
          rules={[{ required: true, message: '请填写公告内容' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default BulletinEdit;
