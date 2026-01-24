import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-components';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProForm, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { request } from 'umi';
import { message, Image } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useRef, useState } from 'react';
import styles from './index.module.css';

const BannerEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [bannerUrl, setBannerUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          sort: 0,
          quality: 0.85,
          appShow: 1,
          status: 1,
        },
      );
      if (record) {
        formRef.current?.setFieldsValue({ quality: 0.85 });
        setBannerUrl(record.imageUrl);
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
      setBannerUrl(src);
      return false;
    },
    onRemove: () => {
      setFileList([...[]]);
      setBannerUrl('');
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
        if ((fileList === null || fileList.length === 0) && bannerUrl === '') {
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
          setBannerUrl('');
          return true;
        } else {
          message.error(resp.msg);
          return false;
        }
      }}
    >
      <ProFormField hidden={true} name="id" />
      <ProForm.Group>
        <ProFormText width="md" name="novelId" label="小说编号" placeholder="请输入小说编号" />
        <ProFormText width="md" name="linkUrl" label="链接地址" placeholder="请输入链接地址" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="title" label="标题" placeholder="请输入标题" />
        <ProFormText width="md" name="subTitle" label="副标题" placeholder="请输入副标题" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="sort"
          min={0}
          label="排序"
          placeholder="倒序排列"
          rules={[{ required: true, message: '请输入排序' }]}
        />
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
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="appShow"
          label="APP"
          options={[
            {
              label: '显示',
              value: 1,
            },
            {
              label: '不显示',
              value: 0,
            },
          ]}
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
                上传封面
              </span>
            </div>
            <div style={{ marginTop: '8px', width: '330px' }}>
              <Image
                width={300}
                height={120}
                preview={false}
                src={bannerUrl !== '' ? bannerUrl : 'error'}
                fallback="https://toolb.cn/iph/300x120?t=Upload&bg=b7b7b7"
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
    </DrawerForm>
  );
};
export default BannerEdit;
