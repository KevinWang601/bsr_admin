import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { rewardProductList } from '@/services/payment';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import RewardProductEdit from '@/components/RewardProductEdit';
import { useParams } from 'umi';

const RewardProductList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.RewardProductListItem>[] = [
    {
      title: '图标',
      search: false,
      render: (dom, record) => {
        return <Image src={record.iconUrl} width={36} height={36} />;
      },
    },
    {
      title: '名称',
      search: false,
      dataIndex: 'name',
    },
    {
      title: '金额',
      search: false,
      dataIndex: 'amount',
    },
    {
      title: '状态',
      search: false,
      render: (dom, record) => {
        return record.status == 1 ? '正常' : <span style={{ color: '#F94A29' }}>禁用</span>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: RewardProductEdit }]}
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
    <ProTable<DTO.RewardProductListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await rewardProductList(
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
          component={[{ name: '新增', component: RewardProductEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default RewardProductList;
