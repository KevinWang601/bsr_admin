import { getFormData } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-components';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProForm, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import { request } from 'umi';
import { loadSection } from '@/services/advertisement';
import styles from './index.module.css';
import { message, Image } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import type { SetStateAction } from 'react';
import { useRef, useState } from 'react';

const AdvertisementEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [advertisementUrl, setAdvertisementUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const [imageWidth, setImageWith] = useState<number>(328);

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          sort: 0,
          quality: 0.85,
          type: 1,
          status: 1,
          hint: 0,
        },
      );
      if (record) {
        formRef.current?.setFieldsValue({ quality: 0.85 });
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

  const changeType = (val: number) => {
    if (val == 1) {
      // 横幅广告
      setImageWith(328);
    } else {
      setImageWith(120);
    }
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
          name="device"
          label="投放设备"
          options={[
            {
              label: 'PC',
              value: 0,
            },
            {
              label: 'H5',
              value: 1,
            },
            {
              label: 'ALL',
              value: 2,
            },
          ]}
          placeholder="请选择投放设备"
        />
        <ProFormSelect
          width="md"
          name="host"
          label="域"
          options={[
            {
              label: '全部',
              value: 1,
            },
            {
              label: 'FAV',
              value: 2,
            },
            {
              label: '51',
              value: 3,
            },
          ]}
          placeholder="请选择域名"
          rules={[{ required: true, message: '请选择域名' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="section"
          label="所属栏目"
          request={async () => {
            const sections = await loadSection();
            const options: SetStateAction<{ label: string; value: string }[]> = [];
            for (let i = 0; i < sections.length; i++) {
              const section = sections[i];
              const option = { label: section.label, value: section.value };
              options.push(option);
            }
            return options;
          }}
          debounceTime={10}
          placeholder="请选择所属栏目"
          rules={[{ required: true, message: '请选则所属栏目' }]}
        />
        <ProFormSelect
          width="md"
          name="type"
          label="广告类型"
          options={[
            {
              label: '横幅',
              value: 1,
            },
            {
              label: '图标',
              value: 2,
            },
          ]}
          placeholder="请选择广告类型"
          rules={[{ required: true, message: '请选择广告类型' }]}
          fieldProps={{
            onChange: (val) => {
              changeType(val);
            },
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="num"
          label="广告编号"
          placeholder="请输入广告编号"
          rules={[{ required: true, message: '请输入广告编号' }]}
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
          name="hint"
          label="广告"
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
                width={imageWidth}
                height={120}
                preview={false}
                src={advertisementUrl !== '' ? advertisementUrl : 'error'}
                fallback={
                  imageWidth == 328
                    ? 'https://toolb.cn/iph/328x120?t=Upload&bg=b7b7b7'
                    : 'https://toolb.cn/iph/120x120?t=Upload&bg=b7b7b7'
                }
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
    </DrawerForm>
  );
};
export default AdvertisementEdit;
