import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { messageList } from '@/services/message';
import { useRef } from 'react';
import { Typography, message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import MessageEdit from '@/components/MessageEdit';
import { useParams } from 'umi';

const MessageList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.MessageListItem>[] = [
    {
      title: '会员编号',
      formItemProps: { label: '关键字', name: 'keyword' },
      width: 160,
      ellipsis: true,
      dataIndex: 'customerId',
      copyable: true,
    },
    {
      title: '登陆名称',
      width: 160,
      ellipsis: true,
      search: false,
      copyable: true,
      render: (dom, record) => {
        return (
          <Typography.Text copyable={true} ellipsis={true}>
            {record.customer !== null ? record.customer?.loginName : ''}
          </Typography.Text>
        );
      },
    },
    {
      title: '标题',
      width: 200,
      ellipsis: true,
      search: false,
      dataIndex: 'title',
    },
    {
      title: '消息内容',
      width: 'auto',
      ellipsis: true,
      search: false,
      dataIndex: 'content',
    },
    {
      title: '状态',
      width: 80,
      search: false,
      render: (dom, record) => {
        return record.status === 0 ? '未读' : '已读';
      },
    },
    {
      title: '创建时间',
      width: 180,
      ellipsis: true,
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '更新时间',
      width: 180,
      ellipsis: true,
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.updateTime);
      },
    },
    {
      title: '操作',
      width: 180,
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: MessageEdit }]}
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
    <ProTable<DTO.MessageListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await messageList(
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
          component={[{ name: '新增', component: MessageEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default MessageList;
