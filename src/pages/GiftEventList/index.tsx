import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { giftEventList } from '@/services/event';
import { useRef } from 'react';
import { message } from 'antd';
import { formatUTCDate } from '@/util';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import GiftEventEdit from '@/components/GiftEventEdit';
import { useParams } from 'umi';

const GiftEventList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.GiftEventListItem>[] = [
    {
      title: '活动名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '备注',
      search: false,
      dataIndex: 'note',
    },
    {
      title: '参与数量',
      search: false,
      dataIndex: 'limitCount',
    },
    {
      title: '开始时间',
      search: false,
      ellipsis: true,
      render: (dom, record) => {
        return formatUTCDate(record.startTime, 'YYYY-MM-DD');
      },
    },
    {
      title: '截止时间',
      search: false,
      ellipsis: true,
      render: (dom, record) => {
        return formatUTCDate(record.endTime, 'YYYY-MM-DD');
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: GiftEventEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/comic'}
        />
      ),
    },
  ];

  return (
    <ProTable<DTO.GiftEventListItem>
      rowKey="id"
      columns={columns}
      rowSelection={{
        onChange: (selectedRowKeys: React.Key[]) => {
          ids.splice(0, ids.length);
          ids.push.apply(ids, selectedRowKeys);
        },
      }}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await giftEventList(
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
          component={[{ name: '新增', component: GiftEventEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/comic'}
        />,
      ]}
    />
  );
};
export default GiftEventList;
