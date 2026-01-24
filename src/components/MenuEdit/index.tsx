import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-components';
import { loadParent } from '@/services/menu';
import { message } from 'antd';
import { request } from 'umi';
import { getQueryString } from '@/util';
import { useRef } from 'react';

const MenuEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;
  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(record || { status: 1, nameDesc: '系统管理员' });
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
        <ProFormSelect
          width="md"
          name="parentNumber"
          label="上级菜单"
          request={async () => {
            const resp = await loadParent();
            if (resp.result === 'success') {
              return [...resp.model];
            }
            return [];
          }}
          debounceTime={10}
          placeholder="请选择上级菜单"
          rules={[{ required: true, message: '请选则上级菜单' }]}
        />
        <ProFormText
          width="md"
          name="name"
          label="菜单名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="path"
          label="菜单地址"
          placeholder="请输入菜单地址"
          rules={[
            { required: true, message: '请输入地址' },
            { pattern: new RegExp('^/.*', 'g'), message: '必须以 / 开头' },
          ]}
        />
        <ProFormText
          width="md"
          name="url"
          label="后台地址"
          placeholder="请输入后台地址"
          rules={[{ pattern: new RegExp('^/.*', 'g'), message: '必须以 / 开头' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="authPattern"
          label="权限标识"
          placeholder="请输入权限标识"
          rules={[
            { required: true, message: '请输入权限标识' },
            {
              pattern: new RegExp('^.+:.+:.+', 'g'),
              message: '请输入正确的权限配置，*:*:*',
            },
          ]}
        />
        <ProFormText width="md" name="menuDesc" label="备注信息" placeholder="备注信息" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="icon"
          label="图标"
          valueEnum={{
            smile: '笑脸',
            heart: '爱心',
            user: '用户',
            menu: '菜单',
            book: '图书',
            bars: '类型',
            image: '图片',
            audio: '声音',
            video: '视频',
            order: '支付',
            team: '团队',
            bank: '银行',
          }}
          placeholder="请选择图标"
        />
        <ProFormRadio.Group
          name="status"
          label="菜单状态"
          options={[
            {
              label: '正常',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default MenuEdit;
