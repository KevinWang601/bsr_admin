import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { comicCommentList } from '@/services/nvoel';
import { useRef } from 'react';
import { message } from 'antd';
import { timeZoneConverter } from '@/util';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { useParams } from 'umi';

const ComicCommentList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.CommentListItem>[] = [
    {
      title: '用户编号',
      formItemProps: { label: '关键字', name: 'keyword' },
      width: 200,
      ellipsis: true,
      copyable: true,
      dataIndex: 'customerId',
    },
    {
      title: '用户邮箱',
      search: false,
      width: 180,
      ellipsis: true,
      copyable: true,
      dataIndex: 'loginName',
    },
    {
      title: '评论作品',
      search: false,
      width: 200,
      ellipsis: true,
      copyable: true,
      dataIndex: 'title',
    },
    // {
    //   title: '评论集数',
    //   search: false,
    //   width: 180,
    //   ellipsis: true,
    //   dataIndex: 'chapterTitle',
    // },
    {
      title: '评论内容',
      search: false,
      width: 300,
      ellipsis: true,
      dataIndex: 'content',
    },
    {
      title: '回复数量',
      search: false,
      width: 80,
      dataIndex: 'replyCount',
    },
    {
      title: '点赞数量',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'awesome',
    },
    {
      title: '评分',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'score',
    },
    {
      title: '创建时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '状态',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'status',
      render: (dom, record) => {
        return record.status === 1 ? '显示' : <span style={{ color: '#F94A29' }}>隐藏</span>;
      },
    },
    {
      title: '操作',
      width: 120,
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
          module={'/comic'}
        />
      ),
    },
  ];

  return (
    <ProTable<DTO.BannerListItem>
      rowKey="id"
      childrenColumnName="none"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 1500 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await comicCommentList(
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
export default ComicCommentList;
