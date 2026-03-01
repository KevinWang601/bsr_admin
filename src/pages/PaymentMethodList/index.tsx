import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { paymentMethodList } from '@/services/payment';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import PaymentMethodEdit from '@/components/PaymentMethodEdit';
import { useParams } from 'umi';
import EncryptedImage from '@/components/EncryptedImage';

const PaymentMethodList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.PaymentMethodListItem>[] = [
    {
      title: '名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'name',
    },
    {
      title: '图标',
      search: false,
      render: (dom, record) => {
        return <EncryptedImage src={record.iconUrl} width={36} height={36}/>;
      },
    },
    {
      title: '标识',
      search: false,
      dataIndex: 'channel',
    },
    {
      title: '费率',
      search: false,
      dataIndex: 'feeRate',
    },
    {
      title: '备注',
      search: false,
      dataIndex: 'note',
    },
    {
      title: '币种',
      search: false,
      render: (dom, record) => {
        return record.currency === 1 ? '人民币' : '美元';
      },
    },
    {
      title: '默认',
      search: false,
      render: (dom, record) => {
        return record.checked === 1 ? '是' : '否';
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: PaymentMethodEdit }]}
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
    <ProTable<DTO.PaymentMethodListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 'max-content' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await paymentMethodList(
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
          component={[{ name: '新增', component: PaymentMethodEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default PaymentMethodList;
