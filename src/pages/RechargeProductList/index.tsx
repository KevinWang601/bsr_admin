import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { rechargeProductList } from '@/services/payment';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import RechargeProductEdit from '@/components/RechargeProductEdit';
import { format } from '@happys/money-format';
import { useParams } from 'umi';

const RechargeProductList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.RechargeProductListItem>[] = [
    {
      title: '名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'name',
    },
    {
      title: '类型',
      search: false,
      render: (dom, record) => {
        return record.type === 1 ? 'VIP' : '金币';
      },
    },
    {
      title: '价值',
      search: false,
      render: (dom, record) => {
        return record.val + (record.type === 1 ? '天' : '个');
      },
    },
    {
      title: '原价',
      search: false,
      render: (dom, record) => {
        return format(record.price!);
      },
    },
    {
      title: '折扣价',
      search: false,
      render: (dom, record) => {
        return format(record.discountPrice!);
      },
    },
    {
      title: '赠送积分',
      search: false,
      dataIndex: 'giftIntegral',
    },
    {
      title: '推荐',
      search: false,
      render: (dom, record) => {
        return record.recommend === 1 ? '是' : '否';
      },
    },
    {
      title: '状态',
      search: false,
      render: (dom, record) => {
        return record.status === 1 ? '正常' : '失效';
      },
    },
    {
      title: '创建时间',
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '简介',
      search: false,
      dataIndex: 'brief',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: RechargeProductEdit }]}
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
    <ProTable<DTO.RechargeProductListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await rechargeProductList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
        );
        console.log(result.model.operations);
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
          component={[{ name: '新增', component: RechargeProductEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default RechargeProductList;
