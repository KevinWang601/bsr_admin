import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { readRecordCountList } from '@/services/nvoel';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { useParams } from 'umi';

const ReadRecordCountList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.ReadRecordCountItem>[] = [
    {
      title: '登陆名',
      formItemProps: { label: '登陆名', name: 'keyword' },
      width: 180,
      dataIndex: 'loginName',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '阅读数量',
      search: false,
      width: 280,
      dataIndex: 'readCount',
      ellipsis: true,
    },
    {
      title: '是否限流',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return record.limited == 0 ? '否' : '是';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      ellipsis: true,
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/comic'}
        />
      ),
    },
  ];

  return (
    <ProTable<DTO.ReadRecordCountItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 'max-content' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await readRecordCountList(
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
          module={'/comic'}
        />,
      ]}
    />
  );
};
export default ReadRecordCountList;
