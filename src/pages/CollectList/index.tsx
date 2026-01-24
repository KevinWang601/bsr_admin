import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { collectList } from '@/services/collect';
import { useRef } from 'react';
import { message } from 'antd';
import { timeZoneConverter } from '@/util';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { useParams } from 'umi';

const CollectList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.CollectListItem>[] = [
    {
      title: '名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      width: 680,
      dataIndex: 'title',
    },
    {
      title: '类型',
      formItemProps: { label: '类型', name: 'type' },
      dataIndex: 'typeDesc',
      width: 160,
      valueType: 'select',
      initialValue: '1',
      valueEnum: {
        1: {
          text: '漫画',
        },
      },
    },

    {
      title: '会员',
      search: false,
      dataIndex: 'loginName',
    },
    {
      title: '收藏时间',
      search: false,
      width: 180,
      ellipsis: true,
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
    <ProTable<DTO.CollectListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await collectList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.type || 1,
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
export default CollectList;
