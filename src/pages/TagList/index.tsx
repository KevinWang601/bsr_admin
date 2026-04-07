import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import TagEdit from '@/components/TagEdit';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { useParams } from 'umi';
import { novelTagList } from '@/services/tag';

const TagList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.TagListItem>[] = [
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
      title: '性别偏好',
      width: 80,
      render: (dom, record) => {
        return record.gender === 0 ? '均可' : record.gender === 1 ? '男频' : '女频';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '性别偏好', name: 'gender' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '均可',
          value: '0',
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
      title: '适合年龄',
      width: 80,
      render: (dom, record) => {
        return record.adults === 2 ? '均可' : record.adults === 0 ? '全年龄' : '大人系';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '适合年龄', name: 'adults' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '均可',
          value: '2',
        },
        {
          label: '全年龄',
          value: '0',
        },
        {
          label: '大人系',
          value: '1',
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
          component={[{ name: '编辑', component: TagEdit }]}
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
    <ProTable<DTO.TagListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      expandable={{ expandIconColumnIndex: -1 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await novelTagList(
          menuId || '',
          params.current || 1,
          params.pageSize || 100,
          params.keyword || '',
          params.adults || -1,
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
          component={[{ name: '新增', component: TagEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/novel'}
        />,
      ]}
    />
  );
};
export default TagList;
