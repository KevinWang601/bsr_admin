import { getQueryString } from '@/util';
import { SyncOutlined } from '@ant-design/icons';
import { ProFormField, ProFormInstance } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { message, Image } from 'antd';
import { useRef, useState } from 'react';
import { request } from 'umi';
import styles from './index.module.css';

const ComicChapterSync: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const [codeUrl, setCodeUrl] = useState<string>('');

  const loadCode = () => {
    const requetCodeUrl =
      API_URL + '/comic/comic/code?comicId=' + record.comicId + '&ran=' + Math.random();
    setCodeUrl(requetCodeUrl);
  };

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record);
      loadCode();
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
        <div style={{ marginTop: '20px' }}>
          <Image
            width={144}
            height={45}
            placeholder={
              <div className={styles.loadingDiv}>
                <span>正在加载</span>&nbsp;&nbsp;
                <SyncOutlined spin={true} style={{ color: '#1990FF' }} />
              </div>
            }
            preview={false}
            src={codeUrl}
            onClick={loadCode}
          />
        </div>
        <ProFormText
          width="md"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
          rules={[{ required: true, message: '请输入验证码' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="url"
          label="章节地址"
          placeholder="请输入章节地址"
          rules={[{ required: true, message: '请输入章节地址' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default ComicChapterSync;
