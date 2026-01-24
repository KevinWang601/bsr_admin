import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { couponList } from '@/services/coupon';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import CouponEdit from '@/components/CouponEdit';
import { useParams } from 'umi';

const CoverList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.CouponListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: { label: '关键字', name: 'keyword' },
    },
    {
      title: '图片',
      search: false,
      render: (dom, record) => {
        return <Image src={record.imageUrl} width={90} height={68} />;
      },
    },
    {
      title: '类型',
      search: false,
      render: (dom, record) => {
        return record.type === 1 ? 'VIP体验券' : record.type === 2 ? '金币兑换券' : 'VIP折扣券';
      },
    },
    {
      title: '关联产品',
      search: false,
      render: (dom, record) => {
        return record.productNames;
      },
    },
    {
      title: '所需积分',
      search: false,
      dataIndex: 'integral',
    },
    {
      title: '券价值',
      search: false,
      dataIndex: 'val',
    },
    {
      title: '库存',
      search: false,
      dataIndex: 'stock',
    },
    {
      title: '固定库存',
      search: false,
      dataIndex: 'fixedStock',
    },
    {
      title: '有效期',
      search: false,
      render: (dom, record) => {
        return record.validDay + '天';
      },
    },
    {
      title: '注册赠送',
      search: false,
      render: (dom, record) => {
        return record.registerAward === 0 ? '否' : '是';
      },
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
    },
    {
      title: '状态',
      search: false,
      render: (dom, record) => {
        return record.status == 1 ? '正常' : '下架';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: CouponEdit }]}
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
    <ProTable<DTO.CouponListItem>
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
        const result = await couponList(
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
          component={[{ name: '新增', component: CouponEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default CoverList;
