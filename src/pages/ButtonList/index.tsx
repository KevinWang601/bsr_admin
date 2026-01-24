import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { buttonList } from '@/services/button';
import { loadMenu } from '@/services/menu';
import type { SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { message, Select } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import ButtonEdit from '@/components/ButtonEdit';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const MenuSelect: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const [innerOptions, setOptions] = useState<
    {
      label: string;
      options: any[];
    }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const menus = await loadMenu();
      const options: SetStateAction<{ label: string; options: any[] }[]> = [];
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        if (menu.children === null || menu.children.length === 0) continue;
        const children: any = [];
        const option = { label: menu.name, options: children };
        for (let j = 0; j < menu.children.length; j++) {
          const child = menu.children[j];
          children.push({
            label: child.name,
            value: child.id,
          });
        }
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
      onChange={props.onChange}
    />
  );
};

const ButtonList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.ButtonListItem>[] = [
    {
      title: '所属菜单',
      key: 'parentMenuId',
      dataIndex: 'parentMenuId',
      hideInTable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return <MenuSelect {...rest} />;
      },
    },
    {
      title: '菜单',
      dataIndex: 'menu',
      search: false,
      render: (dom, record) => record.menu.name,
    },
    {
      title: '名称',
      dataIndex: 'name',
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
          component={[{ name: '编辑', component: ButtonEdit }]}
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
    <ProTable<DTO.ButtonListItem>
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
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await buttonList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.name || '',
          params.parentMenuId || '',
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
          component={[{ name: '新增', component: ButtonEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default ButtonList;
