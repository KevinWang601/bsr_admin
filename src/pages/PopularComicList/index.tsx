import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { comicPopularList } from '@/services/nvoel';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import PopularComicEdit from '@/components/PopularComicEdit';
import PopularGroupEdit from '@/components/PopularGroupEdit ';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const PopularComicList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.PopularComicListItem>[] = [
    {
      title: '书名',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'comicTitle',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '域',
      ellipsis: true,
      initialValue: 0,
      valueType: 'select',
      render: (dom, record) => {
        switch (record.host) {
          case 1:
            return '全部';
          case 2:
            return 'FAV';
          case 3:
            return '51';
          default:
            return '未知';
        }
      },
      formItemProps: { label: '域', name: 'host' },
      request: async () => [
        {
          label: '请选择',
          value: 0,
        },
        {
          label: 'FAV',
          value: 2,
        },
        {
          label: '51',
          value: 3,
        },
      ],
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
      title: '分组',
      search: false,
      dataIndex: 'showGroupDesc',
    },
    {
      title: '推荐图',
      search: false,
      width: 180,
      render: (dom, record) => {
        if (record.imageUrl) {
          return (
            <Image src={record.imageUrl} width={160} height={70} style={{ borderRadius: '8px' }} />
          );
        }
      },
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
          component={[{ name: '编辑', component: PopularComicEdit }]}
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
        const result = await comicPopularList(
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
          component={[{ name: '分组', component: PopularGroupEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/comic'}
        />,
      ]}
    />
  );
};
export default PopularComicList;
