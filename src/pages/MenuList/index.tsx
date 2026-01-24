import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { menuList } from '@/services/menu';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import MenuEdit from '@/components/MenuEdit';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const MenuList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.MenuListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '菜单地址',
      search: false,
      dataIndex: 'path',
    },
    {
      title: '后台地址',
      search: false,
      dataIndex: 'url',
    },
    {
      title: '权限标识',
      search: false,
      dataIndex: 'authPattern',
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
          component={[{ name: '编辑', component: MenuEdit }]}
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
    <ProTable<DTO.MenuListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 'max-content' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await menuList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.name || '',
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
          component={[{ name: '新增', component: MenuEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default MenuList;
