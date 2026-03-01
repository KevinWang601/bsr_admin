import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { withdrawList } from '@/services/payment';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';
import WithdrawEdit from '@/components/WithdrawEdit';
import EncryptedImage from '@/components/EncryptedImage';


const WithdrawList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.WithdrawListItem>[] = [
    {
      title: '会员',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'loginName',
    },
    {
      title: '地址',
      search: false,
      dataIndex: 'address',
      width: 260,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '提现金额',
      search: false,
      dataIndex: 'amount',
    },
    {
      title: '打款凭证',
      search: false,
      width: 80,
      render: (dom, record) => {
        if (record.proofUrl === null || record.proofUrl === '') {
          return '';
        } else {
          return <EncryptedImage src={record.proofUrl} width={32} height={32} />;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      formItemProps: { label: '状态', name: 'status' },
      render: (dom, record) => {
        return record.statusDesc;
      },
      valueType: 'select',
      request: async () => {
        return [
          { label: '全部', value: -1 },
          { label: '待下发', value: 0 },
          { label: '已下发', value: 1 },
          { label: '下发失败', value: 2 },
          { label: '未知', value: 999 },
        ];
      },
      width: 80,
    },
    {
      title: '更新时间',
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.updateTime);
      },
    },
    {
      title: '创建时间',
      valueType: 'dateRange',
      dataIndex: 'dateRagge',
      formItemProps: { label: '创建时间' },
      search: {
        transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
      },
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[
            { name: '编辑', component: WithdrawEdit },
          ]}
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
    <ProTable<DTO.WithdrawListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 'max-content' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await withdrawList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.status || -1,
          params.startTime || '',
          params.endTime || '',
          Intl.DateTimeFormat().resolvedOptions().timeZone,
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
export default WithdrawList;
