import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { message, Image } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { Upload } from 'antd';
import { useRef, useState } from 'react';
import { request } from 'umi';
import styles from './index.module.css';

const PaymentMethodEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [iconUrl, setIconUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || { sort: 0, feeRate: 0.0, checked: 0, currency: 1, status: 1 },
      );
      if (record) {
        setIconUrl(record.iconUrl);
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
          label="支付名称"
          placeholder="请输入支付名称"
          rules={[{ required: true, message: '请输入支付名称' }]}
        />
        <ProFormText
          width="md"
          name="channel"
          label="支付标识"
          placeholder="支付标识"
          rules={[{ required: true, message: '请输入支付标识' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="feeRate"
          min={0}
          label="费率"
          placeholder="请输入费率"
          rules={[{ required: true, message: '请输入费率' }]}
        />
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
          name="currency"
          label="币种"
          options={[
            {
              label: '人民币',
              value: 1,
            },
            {
              label: '美元',
              value: 2,
            },
          ]}
        />
        <ProFormText
          width="md"
          name="note"
          label="备注"
          placeholder="请输入备注"
          rules={[{ required: true, message: '请输入备注' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          width="md"
          name="checked"
          label="默认"
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
      <ProForm.Group>
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
            <div style={{ marginTop: '8px', width: '330px' }}>
              <Image
                width={80}
                height={80}
                preview={false}
                src={iconUrl !== '' ? iconUrl : 'error'}
                fallback="https://toolb.cn/iph/80x80?t=Upload&bg=b7b7b7"
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
    </DrawerForm>
  );
};
export default PaymentMethodEdit;
