import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { comicAdvertisementList } from '@/services/comic_advertisement';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import ComicAdvertisementEdit from '@/components/ComicAdvertisementEdit';
import { useParams } from 'umi';

const ComicAdvertisementList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.ComicAdvertisementListItem>[] = [
    {
      title: '作用域',
      render: (dom, record) => {
        switch (record.scope) {
          case 1:
            return '全站';
          case 2:
            return '类型';
          case 3:
            return '作品';
          default:
            return '未知';
        }
      },
      width: 100,
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '作用域', name: 'scope' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '全站',
          value: '1',
        },
        {
          label: '类型',
          value: '2',
        },
        {
          label: '作品',
          value: '3',
        },
      ],
    },
    {
      title: '类型',
      search: false,
      dataIndex: 'comicTypeDesc',
    },
    {
      title: '作品',
      search: false,
      dataIndex: 'comicTitle',
    },
    {
      title: '图片',
      search: false,
      render: (dom, record) => {
        return <Image src={record.imageUrl} width={72} height={36} />;
      },
    },
    {
      title: '链接',
      search: false,
      dataIndex: 'linkUrl',
    },
    {
      title: '点击量',
      search: false,
      dataIndex: 'hit',
    },
    {
      title: '状态',
      search: false,
      render: (dom, record) => {
        return record.status == 1 ? '正常' : <span style={{ color: '#F94A29' }}>下架</span>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: ComicAdvertisementEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/comic'}
        />
      ),
    },
    {
      title: '备注',
      search: false,
      dataIndex: 'note',
    },
  ];

  return (
    <ProTable<DTO.ComicAdvertisementListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await comicAdvertisementList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.scope || -1,
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
          component={[{ name: '新增', component: ComicAdvertisementEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/comic'}
        />,
      ]}
    />
  );
};
export default ComicAdvertisementList;
