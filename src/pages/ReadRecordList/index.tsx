import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { readRecordList } from '@/services/nvoel';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const ReadRecordList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.ComicChapterItem>[] = [
    {
      title: '封面',
      search: false,
      width: 80,
      render: (dom, record) => {
        return (
          <Image src={record.coverUrl} width={54} height={80} style={{ borderRadius: '8px' }} />
        );
      },
    },
    {
      title: '登陆名',
      formItemProps: { label: '登陆名', name: 'keyword' },
      width: 180,
      dataIndex: 'loginName',
      ellipsis: true,
      copyable: true,
    },
    {
      title: 'VIP',
      search: false,
      width: 60,
      render: (dom, record) => {
        return record.vip ? '是' : '否';
      },
    },
    {
      title: '书名',
      search: false,
      width: 280,
      dataIndex: 'comicTitle',
      ellipsis: true,
    },
    {
      title: '章节名',
      search: false,
      width: 280,
      dataIndex: 'chapterTitle',
      ellipsis: true,
    },
    {
      title: '记录时间',
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
    <ProTable<DTO.ComicChapterItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 'max-content' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await readRecordList(
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
export default ReadRecordList;
