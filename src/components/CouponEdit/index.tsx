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
import type { SetStateAction } from 'react';
import { useRef, useState } from 'react';
import { rechargeProductAll } from '@/services/payment';
import styles from './index.module.css';

const CouponEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          registerAward: 0,
          sort: 0,
          status: 1,
        },
      );
      if (record) {
        record.productIds = [];
        if (record.products !== null) {
          for (let i = 0; i < record.products.length; i++) {
            record.productIds.push(record.products[i].id);
          }
        }
        formRef.current?.setFieldsValue({ ...record, quality: 0.85 });
        setImageUrl(record.imageUrl);
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
      setImageUrl(src);
      return false;
    },
    onRemove: () => {
      setFileList([...[]]);
      setImageUrl('');
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
        if ((fileList === null || fileList.length === 0) && imageUrl === '') {
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
          setImageUrl('');
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
          label="券名称"
          placeholder="请输入券名称"
          rules={[{ required: true, message: '请输入券名称' }]}
        />
        <ProFormSelect
          width="md"
          name="type"
          label="券类型"
          options={[
            {
              label: 'VIP体验券',
              value: 1,
            },
            {
              label: '金币兑换券',
              value: 2,
            },
            {
              label: 'VIP折扣券',
              value: 3,
            },
          ]}
          placeholder="请选择券类型"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          mode="multiple"
          name="productIds"
          label="可用产品"
          request={async () => {
            const options: SetStateAction<{ label: string; value: string }[]> = [];
            const resp = await rechargeProductAll();
            if (resp.result !== 'success') return options;
            const products = resp.model;
            for (let i = 0; i < products.length; i++) {
              const product = products[i];
              const option = { label: product.name, value: product.id };
              options.push(option);
            }
            return options;
          }}
          debounceTime={10}
          placeholder="请选择可用产品"
        />
        <ProFormDigit
          width="md"
          name="integral"
          label="所需积分"
          min={0}
          placeholder="请填写所需积分"
          rules={[{ required: true, message: '请输入券名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="val"
          label="券价值"
          min={0}
          placeholder="请填写券价值"
          rules={[{ required: true, message: '请填写券价值' }]}
        />
        <ProFormDigit
          width="md"
          name="stock"
          label="库存"
          min={0}
          placeholder="请填写库存"
          rules={[{ required: true, message: '请输入库存' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="fixedStock"
          label="固定库存"
          min={0}
          placeholder="请填写固定库存"
          rules={[{ required: true, message: '请填写固定库存' }]}
        />
        <ProFormDigit
          width="md"
          name="validDay"
          label="有效期"
          min={0}
          placeholder="请填写有效期"
          rules={[{ required: true, message: '请填写有效期' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="registerAward"
          label="注册赠送"
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
        <ProFormDigit
          width="md"
          name="sort"
          min={0}
          label="排序"
          placeholder="倒序排列"
          rules={[{ required: true, message: '请输入排序' }]}
        />
        <Upload {...uploadProps}>
          <div>
            <div>
              <span style={{ cursor: 'pointer' }}>
                <span className={styles.redpoint} style={{ color: '#ff4d4f' }}>
                  *
                </span>{' '}
                上传图标
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Image
                width={205}
                height={125}
                preview={false}
                src={imageUrl !== '' ? imageUrl : 'error'}
                fallback="https://toolb.cn/iph/205x155?t=Upload&bg=b7b7b7"
              />
            </div>
          </div>
        </Upload>
      </ProForm.Group>
    </DrawerForm>
  );
};
export default CouponEdit;
