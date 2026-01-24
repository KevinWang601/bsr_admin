import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { agentWithdrawList } from '@/services/agent';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import AgentWithdrawAdd from '@/components/AgentWithdrawAdd';
import AgentWithdrawEdit from '@/components/AgentWithdrawEdit';
import { useParams } from 'umi';

const AgentWithdrawList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [-1];
  const columns: ProColumns<DTO.AgentWithdrawItem>[] = [
    {
      title: '提现金额',
      search: false,
      dataIndex: 'amount',
      width: 100,
    },
    {
      title: '收款地址',
      search: false,
      width: 260,
      ellipsis: true,
      copyable: true,
      dataIndex: 'address',
    },
    {
      title: '打款凭证',
      search: false,
      width: 80,
      render: (dom, record) => {
        if (record.proofUrl === null || record.proofUrl === '') {
          return '';
        } else {
          return <Image src={record.proofUrl} width={32} height={32} />;
        }
      },
    },
    {
      title: '状态',
      search: false,
      width: 120,
      render: (dom, record) => {
        return record.status === 1 ? '处理中' : '已结算';
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
    {
      title: '操作',
      width: 180,
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '处理', component: AgentWithdrawEdit }]}
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
        const result = await agentWithdrawList(
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
          component={[{ name: '立即提现', component: AgentWithdrawAdd }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default AgentWithdrawList;
