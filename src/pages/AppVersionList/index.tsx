import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import { appVersionList } from '@/services/app_version';
import AppVersionEdit from '@/components/AppVersionEdit';
import { useParams } from 'umi';

const AppVersionList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.AppVersionListItem>[] = [
    {
      title: '平台',
      render: (dom, record) => {
        return record.platform === 1 ? '安卓' : '苹果';
      },
      formItemProps: { label: '平台', name: 'platform' },
      valueType: 'select',
      request: async () => {
        return [
          { label: '全部', value: 0 },
          { label: '安卓', value: 1 },
          { label: '苹果', value: 2 },
        ];
      },
    },
    {
      title: '版本名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'versionName',
    },
    {
      title: '版本说明',
      search: false,
      dataIndex: 'versionNote',
      width: 260,
      ellipsis: true,
    },
    {
      title: '下载地址',
      search: false,
      dataIndex: 'downloadUrl',
      width: 260,
      ellipsis: true,
    },
    {
      title: '强制升级',
      search: false,
      render: (dom, record) => {
        return record.forceUpgrade == 1 ? '是' : '否';
      },
    },
    {
      title: '状态',
      search: false,
      render: (dom, record) => {
        return record.status == 1 ? '正常' : <span style={{ color: '#F94A29' }}>下架</span>;
      },
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: AppVersionEdit }]}
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
    <ProTable<DTO.AppEdnpointListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      expandable={{ expandIconColumnIndex: -1 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await appVersionList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.platform || 0,
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
          component={[{ name: '新增', component: AppVersionEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default AppVersionList;
