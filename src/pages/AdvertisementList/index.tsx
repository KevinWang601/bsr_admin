import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { advertisementList } from '@/services/advertisement';
import { useRef } from 'react';
import { message, Image } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import AdvertisementEdit from '@/components/AdvertisementEdit';
import { useParams } from 'umi';

const AdvertisementList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.AdvertisementListItem>[] = [
    {
      title: '编号',
      search: false,
      dataIndex: 'num',
    },
    {
      title: '域',
      render: (dom, record) => {
        switch (record.host) {
          case 1:
            return '全部';
          case 2:
            return 'FAV';
          case 3:
            return '51';
          default:
            return '未知';
        }
      },
      width: 100,
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '域', name: 'host' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '全部',
          value: '1',
        },
        {
          label: 'FAV',
          value: '2',
        },
        {
          label: '51',
          value: '3',
        },
      ],
    },
    {
      title: '设备',
      search: false,
      render: (dom, record) => {
        return record.device == 0 ? 'PC' : 'H5';
      },
    },
    {
      title: '栏目',
      search: false,
      dataIndex: 'section',
    },
    {
      title: '栏目地址',
      search: false,
      dataIndex: 'sectionUrl',
    },
    {
      title: '类型',
      search: false,
      render: (dom, record) => {
        return record.type == 1 ? '横幅' : '图标';
      },
    },
    {
      title: '图片',
      search: false,
      render: (dom, record) => {
        return <Image src={record.imageUrl} width={72} height={36} />;
      },
    },
    {
      title: '链接',
      search: false,
      dataIndex: 'linkUrl',
    },
    {
      title: '广告',
      search: false,
      render: (dom, record) => {
        return record.hint == 1 ? '是' : '否';
      },
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
    },
    {
      title: '状态',
      search: false,
      render: (dom, record) => {
        return record.status == 1 ? '正常' : <span style={{ color: '#F94A29' }}>下架</span>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: AdvertisementEdit }]}
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
    <ProTable<DTO.AdvertisementListItem>
      rowKey="id"
      columns={columns}
      // rowSelection={{
      //   onChange: (selectedRowKeys: React.Key[]) => {
      //     ids.splice(0, ids.length);
      //     ids.push.apply(ids, selectedRowKeys);
      //   },
      // }}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await advertisementList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.host || -1,
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
          component={[{ name: '新增', component: AdvertisementEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default AdvertisementList;
