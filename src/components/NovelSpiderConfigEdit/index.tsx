import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { request } from 'umi';

const NovelSpiderConfigEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      let configData = {}
      if(record.spiderConfig != ''){
        configData = JSON.parse(record.spiderConfig);
      }
      formRef.current?.setFieldsValue(
       {
          titlePattern: "",
          deleteIndex: -1,
          deletePattern: "",
          onlineVolumeId: 0,
          onlineVolumeName: "",
          onlineChapterTitle: "",
          websiteVolumeName: "",
          websiteChapterTitle: "",
          ...configData
        },
      );
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
        <ProFormField
          width="md"
          name="titlePattern"
          label="标题正则"
          placeholder="判定标题的正则"
        />
        <ProFormDigit
          width="md"
          name="deleteIndex"
          label="删除行"
          placeholder="删除行索引"
          min={-1}
          rules={[{ required: true, message: '删除行索引' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
         <ProFormField
          width="md"
          name="deletePattern"
          label="删除正则"
          placeholder="判定删除的正则"
        />
        <ProFormField
          width="md"
          name="onlineVolumeId"
          label="卷编号"
          placeholder="本站当前卷编号"
        />
      </ProForm.Group>
      <ProForm.Group>
         <ProFormField
          width="md"
          name="onlineVolumeName"
          label="卷名"
          placeholder="本站当前卷名"
        />
        <ProFormDigit
          width="md"
          name="onlineVolumeSort"
          label="卷序列"
          placeholder="本站当前卷序列"
          min={0}
          rules={[{ required: true, message: '本站当前卷序列' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
         <ProFormField
          width="md"
          name="onlineChapterTitle"
          label="章节名"
          placeholder="本站当前章节名"
        />
        <ProFormDigit
          width="md"
          name="onlineChapterSort"
          label="章节序列"
          placeholder="本站当前章节序列"
          min={0}
          rules={[{ required: true, message: '本站当前章节序列' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
         <ProFormField
          width="md"
          name="websiteVolumeName"
          label="对应卷名"
          placeholder="对应网站卷名"
        />
        <ProFormField
          width="md"
          name="websiteChapterTitle"
          label="对应章节名"
          placeholder="本站网站章节名"
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default NovelSpiderConfigEdit;
