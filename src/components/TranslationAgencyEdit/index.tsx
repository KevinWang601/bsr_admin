import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField, ProFormTextArea } from '@ant-design/pro-components';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { request } from 'umi';
import styles from './index.module.css';
import { message, Image } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useRef, useState } from 'react';

const TranslationAgencyEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [logoUrl, setLogoUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          status: 1,
        },
      );
      if (record) {
        setLogoUrl(record.logoUrl);
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
      setLogoUrl(src);
      return false;
    },
    onRemove: () => {
      setFileList([...[]]);
      setLogoUrl('');
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
        if ((fileList === null || fileList.length === 0) && logoUrl === '') {
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
          setLogoUrl('');
          return true;
        } else {
          message.error(resp.msg);
          return false;
        }
      }}
    >
      <ProFormField hidden={true} name="id" />
      <ProForm.Group>
        <ProFormText width="md" name="name" label="名称" placeholder="请输入名称" />
        <ProFormText width="md" name="contact" label="联系方式" placeholder="请输入联系方式" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width={480}
          fieldProps={{ style: { height: '160px' }, maxLength: 500 }}
          label="简介"
          name="brief"
        />
        <Upload {...uploadProps}>
          <div>
            <div>
              <span style={{ cursor: 'pointer' }}>
                <span className={styles.redpoint} style={{ color: '#ff4d4f' }}>
                  *
                </span>{' '}
                上传logo
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Image
                width={120}
                height={120}
                preview={false}
                src={logoUrl !== '' ? logoUrl : 'error'}
                fallback="https://toolb.cn/iph/120x120?t=Upload&bg=b7b7b7"
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            {
              label: '正常',
              value: 1,
            },
            {
              label: '隐藏',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default TranslationAgencyEdit;
