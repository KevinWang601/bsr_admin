import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { agentPerforanceList } from '@/services/agent';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const AgentPerformanceList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [-1];
  const columns: ProColumns<DTO.AgentPerformanceItem>[] = [
    {
      title: '会员编号',
      search: false,
      dataIndex: 'number',
      width: 100,
    },
    {
      title: '购买产品',
      search: false,
      width: 120,
      ellipsis: true,
      dataIndex: 'productName',
    },
    {
      title: '订单价格',
      search: false,
      width: 80,
      dataIndex: 'orderPrice',
    },
    {
      title: '提成比例',
      width: 80,
      search: false,
      dataIndex: 'agentRatio',
    },
    {
      title: '提成金额',
      width: 80,
      search: false,
      dataIndex: 'income',
    },
    {
      title: '状态',
      search: false,
      width: 120,
      render: (dom, record) => {
        return record.status === 0 ? '待提现' : record.status === 1 ? '处理中' : '已结算';
      },
    },
    {
      title: '创建时间',
      search: false,
      width: 180,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
  ];

  return (
    <ProTable<DTO.CustomerListItem>
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
      scroll={{ x: 1500 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await agentPerforanceList(
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
export default AgentPerformanceList;
