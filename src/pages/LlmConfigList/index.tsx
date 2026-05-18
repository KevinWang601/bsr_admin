import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { llmConfigList } from '@/services/llm_config';
import { useRef } from 'react';
import { message } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import LlmConfigEdit from '@/components/LlmConfigEdit';
import { useParams } from 'umi';

const LlmConfigList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);

  const columns: ProColumns<DTO.LlmConfigListItem>[] = [
    {
      title: '模型名称',
      formItemProps: { label: '关键字', name: 'keyword' },
      width: 120,
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: '提供商',
      width: 120,
      ellipsis: true,
      search: false,
      dataIndex: 'provider',
    },
    {
      title: '模型编号',
      width: 120,
      ellipsis: true,
      search: false,
      dataIndex: 'modelId',
    },
    {
      title: 'API KEY',
      width: 120,
      ellipsis: true,
      search: false,
      dataIndex: 'apiKey',
    },
    {
      title: 'API URL',
      width: 120,
      ellipsis: true,
      search: false,
      dataIndex: 'baseUrl',
    },
    {
      title: '参数',
      width: 120,
      ellipsis: true,
      search: false,
      dataIndex: 'parameters',
    },
    {
      title: '最大上下文',
      width: 100,
      ellipsis: true,
      search: false,
      dataIndex: 'maxContextTokens',
    },
    {
      title: '破限词',
      width: 100,
      ellipsis: true,
      search: false,
      dataIndex: 'jailbreakPrefix',
    },
    {
      title: '创建时间',
      width: 180,
      ellipsis: true,
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '更新时间',
      width: 180,
      ellipsis: true,
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.updateTime);
      },
    },
    {
      title: '状态',
      width: 80,
      search: false,
      render: (dom, record) => {
        return record.status == 1 ? '正常' : '禁用';
      },
    },
    {
      title: '操作',
      width: 180,
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[{ name: '编辑', component: LlmConfigEdit }]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/chat'}
        />
      ),
    },
  ];

  return (
    <ProTable<DTO.LlmConfigListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 1500 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await llmConfigList(
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
          component={[{ name: '新增', component: LlmConfigEdit }]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/chat'}
        />,
      ]}
    />
  );
};
export default LlmConfigList;
