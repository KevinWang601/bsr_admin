import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { appEndpointList } from '@/services/app_endpoint';
import AppEndpointEdit from '@/components/AppEndpointEdit';
import { useParams } from 'umi';

const AppEndpointList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.AppEdnpointListItem>[] = [
    {
      title: '名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'typeDesc',
      formItemProps: { label: '类型', name: 'type' },
      valueType: 'select',
      request: async () => {
        return [
          { label: '全部', value: 0 },
          { label: 'API', value: 1 },
          { label: 'CDN', value: 2 },
        ];
      },
    },
    {
      title: '地址',
      search: false,
      dataIndex: 'url',
    },
    {
      title: '图片网络',
      search: false,
      render: (dom, record) => {
        return record.network === 1 ? '全球' : '国内';
      },
    },
    {
      title: '状态',
      search: false,
      render: (dom, record) => {
        return record.status == 1 ? '正常' : <span style={{ color: '#F94A29' }}>下架</span>;
      },
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: AppEndpointEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/console'}
        />
      ),
    },
    {
      title: '说明',
      search: false,
      dataIndex: 'note',
      width: 260,
      ellipsis: true,
    },
  ];

  return (
    <ProTable<DTO.AppEdnpointListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      expandable={{ expandIconColumnIndex: -1 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await appEndpointList(
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
          component={[{ name: '新增', component: AppEndpointEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default AppEndpointList;
