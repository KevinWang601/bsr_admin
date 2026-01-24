import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { customerReminderList } from '@/services/customer';
import { message } from 'antd';
import { useRef, useState } from 'react';
import OperationView from '@/components/OperationView';
import CustomerReminderEdit from '@/components/CustomerReminderEdit';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const CustomerReminderList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const columns: ProColumns<DTO.CustomerReminderListItem>[] = [
    {
      title: '名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'contentName',
      width: 120,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '作者名',
      dataIndex: 'author',
      width: 120,
      ellipsis: true,
      search: false,
    },
    {
      title: '最新章节',
      dataIndex: 'latestChapter',
      width: 120,
      ellipsis: true,
      search: false,
    },
    {
      title: '类型',
      formItemProps: { label: '类型', name: 'type' },
      dataIndex: 'typeDesc',
      width: 60,
      valueType: 'select',
      initialValue: '1',
      valueEnum: {
        1: {
          text: '小说',
        },
        2: {
          text: '有声',
        },
        3: {
          text: '漫画',
        },
        4: {
          text: '视频',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 260,
      ellipsis: true,
      search: false,
    },
    {
      title: '采集源',
      dataIndex: 'source',
      width: 260,
      ellipsis: true,
      search: false,
    },
    {
      title: '待处理',
      dataIndex: 'waitProcessCount',
      search: false,
      width: 80,
      ellipsis: true,
    },
    {
      title: '共计',
      dataIndex: 'totalCount',
      search: false,
      width: 80,
      ellipsis: true,
    },
    {
      title: '状态',
      formItemProps: { label: '状态', name: 'status' },
      width: 80,
      dataIndex: 'statusDesc',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '待处理',
        },
        1: {
          text: '暂无更新',
        },
        2: {
          text: '已更新',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 120,
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: CustomerReminderEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/console'}
        />
      ),
    },
    {
      title: '创建时间',
      search: false,
      width: 180,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '更新时间',
      search: false,
      width: 180,
      render: (dom, record) => {
        return timeZoneConverter(record.updateTime);
      },
    },
  ];

  return (
    <ProTable<DTO.CustomerListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 'max-content' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await customerReminderList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.type || '',
          params.status || '',
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
          component={[]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default CustomerReminderList;
