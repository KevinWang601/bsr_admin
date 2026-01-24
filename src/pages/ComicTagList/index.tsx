import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { comicTagList } from '@/services/tag';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import ComicTagEdit from '@/components/ComicTagEdit';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const ComicTagList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.ComicTagListItem>[] = [
    {
      title: '名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'name',
    },
    {
      title: '板块',
      dataIndex: 'typeDesc',
      formItemProps: { label: '分类', name: 'type' },
      valueType: 'select',
      request: async () => {
        return [
          { label: '全部', value: 0 },
          { label: '少男', value: 1 },
          { label: '少女', value: 2 },
          { label: '图库', value: 3 },
          { label: '绅士', value: 4 },
        ];
      },
    },
    {
      title: '是否显示',
      search: false,
      render: (dom, record) => {
        return record.show === 1 ? '是' : '否';
      },
    },
    {
      title: '更新时间',
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.updateTime);
      },
    },
    {
      title: '创建时间',
      search: false,
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
          component={[{ name: '编辑', component: ComicTagEdit }]}
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
    <ProTable<DTO.ComicTagListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      expandable={{ expandIconColumnIndex: -1 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await comicTagList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.type || 0,
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
          component={[{ name: '新增', component: ComicTagEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/comic'}
        />,
      ]}
    />
  );
};
export default ComicTagList;
