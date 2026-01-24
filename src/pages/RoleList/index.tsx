import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { roleList } from '@/services/role';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import RoleEdit from '@/components/RoleEdit';
import RoleAuthorizeEdit from '@/components/RoleAuthorizeEdit';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const RoleList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.RoleListItem>[] = [
    {
      title: '角色名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'roleName',
    },
    {
      title: '角色描述',
      search: false,
      dataIndex: 'roleDesc',
    },
    {
      title: '角色类型',
      search: false,
      dataIndex: 'typeDesc',
    },
    {
      title: '状态',
      search: false,
      dataIndex: 'statusDesc',
    },
    {
      title: '创建人',
      search: false,
      dataIndex: 'creatorName',
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
          component={[
            { name: '编辑', component: RoleEdit },
            { name: '分配权限', component: RoleAuthorizeEdit },
          ]}
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
    <ProTable<DTO.RoleListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await roleList(
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
          component={[{ name: '新增', component: RoleEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default RoleList;
