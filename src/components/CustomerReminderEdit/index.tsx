import { getQueryString, timeZoneConverter } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormTextArea } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { customerReminderItemList } from '@/services/customer';
import { Avatar, List, message } from 'antd';
import { useRef, useState } from 'react';
import { request } from 'umi';

const CustomerReminderEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const [items, setItem] = useState<DTO.CustomerReminderItemListItem[]>([]);

  const visibleChange = async (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue({ ...record, status: 1 });
      const resp = await customerReminderItemList(record.id);
      if (resp.result === 'success') {
        setItem(resp.model);
      }
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        console.log(values);
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
        <ProFormTextArea
          width={545}
          fieldProps={{ style: { height: '160px' } }}
          label="备注"
          name="note"
        />
        <ProFormTextArea
          width={545}
          fieldProps={{ style: { height: '80px' } }}
          label="更新源"
          name="source"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            {
              label: '暂无更新',
              value: 1,
            },
            {
              label: '已更新',
              value: 2,
            },
            {
              label: '已太监',
              value: 3,
            },
          ]}
        />
      </ProForm.Group>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={<Avatar src={item.customer?.avatarUrl} />}
              title={item.customer?.nickName}
              description={item.customer?.loginName}
            />
            <div>{timeZoneConverter(item.createTime)}</div>
          </List.Item>
        )}
      />
    </DrawerForm>
  );
};
export default CustomerReminderEdit;
