import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { rechargeOrderList } from '@/services/payment';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const RechargeOrderList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.RechargeOrderListItem>[] = [
    {
      title: '订单号',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'orderNum',
    },
    {
      title: '会员',
      search: false,
      dataIndex: 'customerLoginName',
    },
    {
      title: '支付号',
      search: false,
      dataIndex: 'transactionId',
    },
    {
      title: '支付渠道',
      search: false,
      dataIndex: 'channel',
    },
    {
      title: '产品',
      search: false,
      dataIndex: 'productName',
    },
    {
      title: '产品类型',
      search: false,
      render: (dom, record) => {
        return record.orderType == 1 ? 'VIP' : '金币';
      },
    },
    {
      title: '价值',
      search: false,
      dataIndex: 'productVal',
    },
    {
      title: '原价',
      search: false,
      dataIndex: 'productPrice',
    },
    {
      title: '折扣价',
      search: false,
      dataIndex: 'productDiscountPrice',
    },
    {
      title: '订单金额',
      search: false,
      dataIndex: 'amount',
    },
    {
      title: '毛利',
      search: false,
      dataIndex: 'profit',
    },
    {
      title: '费率',
      search: false,
      dataIndex: 'feeRate',
    },
    {
      title: '手续费',
      search: false,
      dataIndex: 'flatFee',
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
          { label: '待支付', value: 0 },
          { label: '已完成', value: 1 },
          { label: '已退款', value: 101 },
          { label: '已下单', value: 102 },
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
      title: '交易号',
      search: false,
      dataIndex: 'transactionNumber',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[]}
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
    <ProTable<DTO.RechargeOrderListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 'max-content' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await rechargeOrderList(
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
export default RechargeOrderList;
