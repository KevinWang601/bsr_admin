import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { userList } from '@/services/user';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import UserEdit from '@/components/UserEdit';
import UserAuthorizeEdit from '@/components/UserAuthorizeEdit';
import { timeZoneConverter } from '@/util';
import UserBalanceEdit from '@/components/UserBalanceEdit';
import { useParams } from 'umi';

const UserList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.UserListItem>[] = [
    {
      title: '登陆名',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'loginName',
    },
    {
      title: '真实姓名',
      search: false,
      dataIndex: 'realName',
    },
    {
      title: '角色',
      search: false,
      dataIndex: 'roleNames',
    },
    {
      title: '分销码',
      search: false,
      dataIndex: 'agentCode',
    },
    {
      title: '首单提成',
      search: false,
      dataIndex: 'agentRatio',
    },
    {
      title: '续单提成',
      search: false,
      dataIndex: 'agentRenewRatio',
    },
    {
      title: '余额',
      search: false,
      dataIndex: 'balance',
    },
    {
      title: '性别',
      search: false,
      dataIndex: 'gender',
    },
    {
      title: '电话',
      search: false,
      dataIndex: 'phone',
    },
    {
      title: '状态',
      search: false,
      dataIndex: 'statusDesc',
    },
    {
      title: '登陆时间',
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.loginTime);
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
          component={[
            { name: '编辑', component: UserEdit },
            { name: '修改余额', component: UserBalanceEdit },
            { name: '分配权限', component: UserAuthorizeEdit },
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
    <ProTable<DTO.UserListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await userList(
          menuId || '',
          params.companyId || '',
          params.roleId || '',
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
          component={[{ name: '新增', component: UserEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default UserList;
