import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { novelPopularList } from '@/services/novel';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import PopularNovelEdit from '@/components/PopularNovelEdit';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const PopularNovelList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.PopularComicListItem>[] = [
    {
      title: '书名',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'novelTitle',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '类型',
      ellipsis: true,
      initialValue: 0,
      valueType: 'select',
      render: (dom, record) => {
        return record.type === 1 ? '热门' : '推荐';
      },
      formItemProps: { label: '类型', name: 'type' },
      request: async () => [
        {
          label: '请选择',
          value: 0,
        },
        {
          label: '热门',
          value: 1,
        },
        {
          label: '推荐',
          value: 2,
        },
      ],
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: PopularNovelEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/novel'}
        />
      ),
    },
  ];

  return (
    <ProTable<DTO.PopularComicListItem>
      rowKey="id"
      columns={columns}
      rowSelection={{
        onChange: (selectedRowKeys: React.Key[]) => {
          ids.splice(0, ids.length);
          ids.push.apply(ids, selectedRowKeys);
        },
      }}
      onReset={() => {
        ids.splice(0, ids.length);
      }}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await novelPopularList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.type || 0,
          params.host || 0,
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
          module={'/novel'}
        />,
      ]}
    />
  );
};
export default PopularNovelList;
