import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { agentCustomerList } from '@/services/agent';
import { loadRoles } from '@/services/user';
import type { SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { message, Select } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import CustomerEdit from '@/components/CustomerEdit ';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const RoleSelect: React.FC<{
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const [innerOptions, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const resp = await loadRoles(2);
      console.log(resp);
      if (resp.result !== 'success') return;
      const roles = resp.model;
      const options: SetStateAction<{ label: string; value: string }[]> = [];
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        const option = { label: role.roleDesc, value: role.id };
        options.push(option);
      }
      setOptions(options);
    }
    fetchData();
  }, []);

  return (
    <Select
      options={innerOptions}
      placeholder="请选择"
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
    />
  );
};

const AgentCustomerList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [-1];
  const columns: ProColumns<DTO.CustomerListItem>[] = [
    {
      title: '所属角色',
      key: 'roleId',
      dataIndex: 'roleId',
      hideInTable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return <RoleSelect {...rest} />;
      },
    },
    {
      title: '编号',
      search: false,
      dataIndex: 'number',
      width: 100,
    },
    {
      title: '昵称',
      search: false,
      width: 120,
      ellipsis: true,
      dataIndex: 'nickName',
    },
    {
      title: '头像',
      search: false,
      width: 80,
      ellipsis: true,
      render: (dom, record) => {
        if (record.avatarUrl === null || record.avatarUrl === '') {
          return '暂无头像';
        } else {
          return <img src={record.avatarUrl} width={16} height={16} alt="" />;
        }
      },
    },
    {
      title: '金币',
      search: false,
      width: 80,
      dataIndex: 'balance',
    },
    {
      title: '性别',
      width: 80,
      search: false,
      dataIndex: 'gender',
    },
    {
      title: '状态',
      width: 80,
      search: false,
      dataIndex: 'statusDesc',
    },
    {
      title: 'VIP截止',
      search: false,
      width: 180,
      dataIndex: 'authTimeFormat',
    },
    {
      title: '创建时间',
      search: false,
      width: 180,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
  ];

  return (
    <ProTable<DTO.CustomerListItem>
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
        const result = await agentCustomerList(
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
          component={[{ name: '新增', component: CustomerEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default AgentCustomerList;
