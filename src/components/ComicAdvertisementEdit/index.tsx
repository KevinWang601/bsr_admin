import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-components';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { request } from 'umi';
import styles from './index.module.css';
import { message, Image } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useRef, useState } from 'react';

const ComicAdvertisementEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [advertisementUrl, setAdvertisementUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const [scope, setScope] = useState<number>(0);

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          quality: 0.85,
          status: 1,
        },
      );
      if (record) {
        formRef.current?.setFieldsValue({ quality: 0.85 });
        setScope(record.scope);
        setAdvertisementUrl(record.imageUrl);
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
      setAdvertisementUrl(src);
      return false;
    },
    onRemove: () => {
      setFileList([...[]]);
      setAdvertisementUrl('');
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
        if ((fileList === null || fileList.length === 0) && advertisementUrl === '') {
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
          setAdvertisementUrl('');
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
          name="scope"
          label="投放范围"
          options={[
            {
              label: '全站',
              value: 1,
            },
            {
              label: '类型',
              value: 2,
            },
            {
              label: '单本',
              value: 3,
            },
          ]}
          placeholder="请选择投放范围"
          fieldProps={{
            onChange: (val) => {
              setScope(val);
            },
          }}
        />
        <ProFormSelect
          width="md"
          disabled={scope != 2}
          name="comicType"
          label="类型"
          options={[
            {
              label: '少年',
              value: 1,
            },
            {
              label: '少女',
              value: 2,
            },
            {
              label: '图库',
              value: 3,
            },
            {
              label: '绅士',
              value: 4,
            },
          ]}
          placeholder="请选择类型"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="comicId"
          disabled={scope != 3}
          label="作品编号"
          placeholder="请输入作品编号"
        />
        <ProFormText
          width="md"
          name="linkUrl"
          label="链接地址"
          placeholder="请输入链接地址"
          rules={[{ required: true, message: '请输入链接地址' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="quality"
          label="压缩比例"
          options={[
            {
              label: '不压缩',
              value: 1.0,
            },
            {
              label: '高质量',
              value: 0.85,
            },
            {
              label: '中质量',
              value: 0.5,
            },
            {
              label: '低质量',
              value: 0.3,
            },
          ]}
          placeholder="请选择压缩比例"
        />
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
      </ProForm.Group>
      <ProForm.Group>
        <Upload {...uploadProps}>
          <div>
            <div>
              <span style={{ cursor: 'pointer' }}>
                <span className={styles.redpoint} style={{ color: '#ff4d4f' }}>
                  *
                </span>{' '}
                上传广告图片
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Image
                width={328}
                height={120}
                preview={false}
                src={advertisementUrl !== '' ? advertisementUrl : 'error'}
                fallback={'https://toolb.cn/iph/328x120?t=Upload&bg=b7b7b7'}
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
    </DrawerForm>
  );
};
export default ComicAdvertisementEdit;
