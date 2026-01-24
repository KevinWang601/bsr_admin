import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { seometaList } from '@/services/seometa';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import SeoMetaEdit from '@/components/SeoMetaEdit';
import { useParams } from 'umi';

const SeoMetaList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.SeoMetaListItem>[] = [
    {
      title: '域名',
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
      width: 100,
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '域', name: 'host' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: 'FAV',
          value: '2',
        },
        {
          label: '51',
          value: '3',
        },
      ],
    },
    {
      title: '栏目',
      search: false,
      dataIndex: 'section',
      width: 100,
    },
    {
      title: '栏目地址',
      search: false,
      dataIndex: 'sectionUrl',
      width: 100,
    },
    {
      title: '类型',
      search: false,
      render: (dom, record) => {
        return record.type == 1 ? 'title' : record.type == 2 ? 'name' : 'property';
      },
      width: 100,
    },
    {
      title: '属性名',
      search: false,
      dataIndex: 'key',
      width: 100,
    },
    {
      title: '属性值',
      search: false,
      dataIndex: 'content',
      width: 740,
      ellipsis: true,
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: SeoMetaEdit }]}
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
    <ProTable<DTO.SeoMetaListItem>
      rowKey="id"
      columns={columns}
      // rowSelection={{
      //   onChange: (selectedRowKeys: React.Key[]) => {
      //     ids.splice(0, ids.length);
      //     ids.push.apply(ids, selectedRowKeys);
      //   },
      // }}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await seometaList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.host || -1,
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
          component={[{ name: '新增', component: SeoMetaEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default SeoMetaList;
