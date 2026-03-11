import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import BulletinEdit from '@/components/BulletinEdit';
import { useParams } from 'umi';
import { bulletinList } from '@/services/bulletin';


const BulletinList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.BulletinListItem>[] = [
    {
      title: '标题',
      formItemProps: { label: '关键字', name: 'keyword' },
      width: 200,
      ellipsis: true,
      dataIndex: 'title',
      copyable: true,
    },
    {
      title: '消息内容',
      width: 400,
      ellipsis: true,
      search: false,
      dataIndex: 'content',
      copyable: true,
    },
    {
      title: '发布人',
      width: 100,
      search: false,
      dataIndex: 'publisher',
    },
    {
      title: '消息级别',
      width: 100,
      search: false,
      render: (dom, record) => {
        return record.level === 1 ? '普通' : record.level === 2 ? '重要' : '紧急';
      },
    },
    {
      title: '创建时间',
      width: 180,
      ellipsis: true,
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '操作',
      width: 180,
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: BulletinEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/workbench'}
        />
      ),
    },
  ];

  return (
    <ProTable<DTO.MessageListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await bulletinList(
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
          component={[{ name: '新增', component: BulletinEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/workbench'}
        />,
      ]}
    />
  );
};
export default BulletinList;
