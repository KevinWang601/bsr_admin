import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { request } from 'umi';
import { message, Image } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useRef, useState } from 'react';

import styles from './index.module.css';

const AgentWithdrawEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [proofUrl, setProofUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record);
      if (record) {
        setProofUrl(record.proofUrl);
      }
    } else {
      if (actionRef && actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: async (file: UploadFile) => {
      setFileList([file]);
      let src = file.url as string;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file as RcFile);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      setProofUrl(src);
      return false;
    },
    onRemove: () => {
      setFileList([...[]]);
      setProofUrl('');
    },
    multiple: false,
    maxCount: 1,
    fileList,
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        if ((fileList === null || fileList.length === 0) && proofUrl === '') {
          message.error('请选择需要上传的文件');
          return;
        }
        const formData = getFormData(values);
        fileList.forEach((file) => {
          formData.append('file', file as RcFile);
        });
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
          setProofUrl('');
          return true;
        } else {
          message.error(resp.msg);
          return false;
        }
      }}
    >
      <ProFormField hidden={true} name="id" />
      <ProForm.Group>
        <Upload {...uploadProps}>
          <div>
            <div>
              <span style={{ cursor: 'pointer' }}>
                <span className={styles.redpoint} style={{ color: '#ff4d4f' }}>
                  *
                </span>{' '}
                上传凭证
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Image
                width={108}
                height={160}
                preview={false}
                src={proofUrl !== '' ? proofUrl : 'error'}
                fallback="https://toolb.cn/iph/108x160?t=Upload&bg=b7b7b7"
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
    </DrawerForm>
  );
};
export default AgentWithdrawEdit;
