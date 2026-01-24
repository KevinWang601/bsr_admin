import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-components';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProForm, ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { request } from 'umi';
import styles from './index.module.css';
import { message, Image } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useRef, useState } from 'react';

const RewardProductEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [iconUrl, setIconUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          status: 1,
        },
      );
      if (record) {
        setIconUrl(record.iconUrl);
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
      setIconUrl(src);
      return false;
    },
    onRemove: () => {
      setFileList([...[]]);
      setIconUrl('');
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
        if ((fileList === null || fileList.length === 0) && iconUrl === '') {
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
          setIconUrl('');
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
          label="名称"
          placeholder="请输入打赏产品名称"
          rules={[{ required: true, message: '请输入打赏产品名称' }]}
        />
        <ProFormDigit
          width="md"
          name="amount"
          min={0}
          label="金额"
          placeholder="请输入打赏金额"
          rules={[{ required: true, message: '请输入打赏金额' }]}
        />
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
              label: '下架',
              value: 0,
            },
          ]}
        />
        <Upload {...uploadProps}>
          <div>
            <div>
              <span style={{ cursor: 'pointer' }}>
                <span className={styles.redpoint} style={{ color: '#ff4d4f' }}>
                  *
                </span>{' '}
                上传封面
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Image
                width={100}
                height={100}
                preview={false}
                src={iconUrl !== '' ? iconUrl : 'error'}
                fallback="https://toolb.cn/iph/100x100?t=Upload&bg=b7b7b7"
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
    </DrawerForm>
  );
};
export default RewardProductEdit;
