import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { contactList } from '@/services/contact';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import { timeZoneConverter } from '@/util';
import OperationView from '@/components/OperationView';
import ReplyContactEdit from '@/components/ReplyContactEdit';
import { useParams } from 'umi';
import EncryptedImage from '@/components/EncryptedImage';

const ContactList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.ContactListItem>[] = [
    {
      title: '邮箱',
      width: 180,
      ellipsis: true,
      search: false,
      dataIndex: 'email',
    },
    {
      title: '是否会员',
      search: false,
      width: 180,
      render: (dom, record) => {
        return record.customer != null ? (record.customer.isVip ? 'VIP' : '是') : '否';
      },
    },
    {
      title: '问题描述',
      width: 'auto',
      search: false,
      ellipsis: true,
      dataIndex: 'content',
    },
    {
      title: '图片',
      width: 200,
      search: false,
      render: (dom, record) => {
        if (record.imageUrl === '') return '';
        return <EncryptedImage src={record.imageUrl} width={72} height={36} />;
      },
    },
    {
      title: '创建时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '是否回复',
      search: false,
      width: 180,
      render: (dom, record) => {
        return record.status == 1 ? '是' : '否';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '回复', component: ReplyContactEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/console'}
        />
      ),
    },
  ];

  return (
    <ProTable<DTO.ContactListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await contactList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
        );
        setOperations([...result.model.operations]);
        return {
          data: result.model.rows,
          success: result.result === 'success',
          total: result.model.total,
        };
      }}
      columnEmptyText={false}
      pagination={{
        // pageSize: 20,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      onRequestError={(error) => {
        message.error('网络请求失败：' + error);
      }}
      toolBarRender={() => [
        <OperationView
          key={nanoid()}
          ids={ids.join(',')}
          component={[]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default ContactList;
