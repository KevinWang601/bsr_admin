import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { balanceRecordList, loadBalanceOperates } from '@/services/payment';
import type { SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { message, Select } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import { useParams } from 'umi';

const OperateSelect: React.FC<{
  value?: string;
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
      const resp = await loadBalanceOperates();
      if (resp.result !== 'success') return;
      const operates = resp.model;
      const options: SetStateAction<{ label: string; value: string }[]> = [];
      for (let i = 0; i < operates.length; i++) {
        const operate = operates[i];
        const option = { label: operate.label, value: operate.value };
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

const BalanceRecordList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const columns: ProColumns<DTO.BalanceRecordListItem>[] = [
    {
      title: '操作类型',
      key: 'operate',
      dataIndex: 'operate',
      hideInTable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return <OperateSelect {...rest} />;
      },
    },
    {
      title: '会员名称',
      formItemProps: { label: '会员名', name: 'keyword' },
      dataIndex: 'loginName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '关联编号',
      search: false,
      dataIndex: 'transactionIdDesc',
      width: 260,
      ellipsis: true,
    },
    {
      title: '操作',
      search: false,
      dataIndex: 'operateDesc',
      width: 100,
    },
    {
      title: '金额',
      search: false,
      dataIndex: 'amount',
      width: 100,
    },
    {
      title: '余额',
      search: false,
      dataIndex: 'balance',
      width: 100,
    },
    {
      title: '创建时间',
      search: false,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
      width: 180,
    },
    {
      title: '备注',
      search: false,
      dataIndex: 'note',
      width: 500,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[]}
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
    <ProTable<DTO.BalanceRecordListItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      scroll={{ x: 1500 }}
      request={async (params = {}, sort, filter) => {
        console.log(params, sort, filter);
        const result = await balanceRecordList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.operate || '',
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
export default BalanceRecordList;
