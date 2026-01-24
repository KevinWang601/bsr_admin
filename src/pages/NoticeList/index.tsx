import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { noticeList } from '@/services/notice';
import { useRef } from 'react';
import { message } from 'antd';
import { timeZoneConverter } from '@/util';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import NoticeEdit from '@/components/NoticeEdit';
import { useParams } from 'umi';

const NoticeList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.NoticeListItem>[] = [
    {
      title: '公告内容',
      search: false,
      dataIndex: 'content',
      width: 420,
      ellipsis: true,
    },
    {
      title: '链接',
      search: false,
      dataIndex: 'link',
      width: 260,
      ellipsis: true,
    },
    {
      title: '开始时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.startTime);
      },
    },
    {
      title: '截止时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.endTime);
      },
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: NoticeEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/console'}
        />
      ),
      width: 120,
    },
    {
      title: '时区',
      search: false,
      dataIndex: 'timeZone',
    },
  ];

  return (
    <ProTable<DTO.NoticeListItem>
      rowKey="id"
      columns={columns}
      rowSelection={{
        onChange: (selectedRowKeys: React.Key[]) => {
          ids.splice(0, ids.length);
          ids.push.apply(ids, selectedRowKeys);
        },
      }}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 1500 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await noticeList(
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
          component={[{ name: '新增', component: NoticeEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default NoticeList;
