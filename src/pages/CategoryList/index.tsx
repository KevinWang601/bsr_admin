import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import CategoryEdit from '@/components/CategoryEdit';
import { novelCategoryList } from '@/services/category';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { useParams } from 'umi';

const CategoryList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.CategoryListItem>[] = [
    {
      title: '名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'name',
    },
    {
      title: '标识',
      search: false,
      dataIndex: 'slug',
    },
    {
      title: '是否热门',
      width: 80,
      render: (dom, record) => {
        return record.hot === 1 ? '是' : '否';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '是否热门', name: 'hot' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '0',
        },
      ],
    },
    {
      title: '适合性别',
      width: 80,
      render: (dom, record) => {
        return record.gender === 0 ? '均可' : record.gender === 1 ? '男频' : '女频';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '适合性别', name: 'gender' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '男频',
          value: '1',
        },
        {
          label: '女频',
          value: '2',
        },
      ],
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
          component={[{ name: '编辑', component: CategoryEdit }]}
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
    <ProTable<DTO.CategoryListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      expandable={{ expandIconColumnIndex: -1 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await novelCategoryList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.hot || -1,
          params.gender || -1,
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
          component={[{ name: '新增', component: CategoryEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/novel'}
        />,
      ]}
    />
  );
};
export default CategoryList;
