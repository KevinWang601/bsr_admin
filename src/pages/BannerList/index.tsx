import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { bannerList } from '@/services/banner';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import BannerEdit from '@/components/BannerEdit';
import EncryptedImage from '@/components/EncryptedImage';
import { useParams } from 'umi';

const BannerList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.BannerListItem>[] = [
    {
      title: '小说编号',
      search: false,
      dataIndex: 'novelId',
    },
    {
      title: 'APP',
      search: false,
      render: (dom, record) => {
        return record.appShow == 1 ? '显示' : '不显示';
      },
    },
    {
      title: '图片',
      search: false,
      render: (dom, record) => {
        return <EncryptedImage src={record.imageUrl} width={72} height={36} />;
      },
    },
    {
      title: '链接',
      search: false,
      dataIndex: 'linkUrl',
    },
    {
      title: '标题',
      search: false,
      dataIndex: 'title',
    },
    {
      title: '副标题',
      search: false,
      dataIndex: 'subTitle',
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
          component={[{ name: '编辑', component: BannerEdit }]}
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
    <ProTable<DTO.BannerListItem>
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
      scroll={{ x: '1500' }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await bannerList(
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
          component={[{ name: '新增', component: BannerEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/console'}
        />,
      ]}
    />
  );
};
export default BannerList;
