import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { novelChapterList, loadNovel } from '@/services/nvoel';
import type { SetStateAction } from 'react';
import { useRef } from 'react';
import { message, Select } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import ChapterVipEdit from '@/components/ChapterVipEdit';
import { useParams } from 'umi';
import NovelChapterEdit from '@/components/NovelChapterEdit';
import NovelVolumeEdit from '@/components/NovelVolumeEdit';
import ChapterRemove from '@/components/ChapterRemove';

const NovelSelect: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const [innerOptions, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const handleSearch = (value: string) => {
    if (!value || value.length <= 0) return;
    async function fetchData() {
      const novels = await loadNovel(value);
      const options: SetStateAction<{ label: string; value: string }[]> = [];
      for (let i = 0; i < novels.length; i++) {
        const novel = novels[i];
        const option = { label: novel.title, value: novel.id };
        options.push(option);
      }
      setOptions([...options]);
    }
    fetchData();
  };

  return (
    <Select
      showSearch={true}
      options={innerOptions}
      placeholder="请选择"
      value={props.value}
      filterOption={false}
      showArrow={false}
      onChange={props.onChange}
      onSearch={handleSearch}
      notFoundContent={null}
    />
  );
};

const NovelChapterList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.NovelChapterItem>[] = [
    {
      title: '所属小说',
      key: 'novelId',
      dataIndex: 'novelId',
      hideInTable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return <NovelSelect {...rest} />;
      },
    },
    {
      title: '书名',
      search: false,
      width: 180,
      ellipsis: true,
      copyable: true,
      render: (dom, record) => {
        return record.novel === null ? '' : record.novel!.title;
      },
    },
    {
      title: '所属卷',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'parentTitle',
    },
    {
      title: '章节名',
      formItemProps: { label: '关键字', name: 'keyword' },
      width: 260,
      ellipsis: true,
      dataIndex: 'title',
    },
    {
      title: '类型',
      search: false,
      width: 60,
      ellipsis: true,
      render: (dom, record) => {
        return record.type === 1 ? '章' : '卷';
      },
    },
    {
      title: '会员',
      search: false,
      width: 80,
      ellipsis: true,
      render: (dom, record) => {
        return record.member === 0 ? '否' : '是';
      },
    },
    {
      title: '价格',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'price',
    },
    {
      title: '卷章节数',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'chapterCount',
    },
    {
      title: '排序',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'sort',
    },
    {
      title: '状态',
      search: false,
      width: 60,
      ellipsis: true,
      render: (dom, record) => {
        return record.status === 0 ? <span style={{ color: '#F94A29' }}>下架</span> : '上架';
      },
    },
    {
      title: '上架时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.onlineTime);
      },
    },
    {
      title: '创建时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      ellipsis: true,
      key: 'option',
      render: (dom, record, index) => (
        <OperationView
          key={index}
          component={[
            ...(record.type === 1 ? [{ name: '付费', component: ChapterVipEdit }] : []),
            record.type == 1 ? { name: '编辑章', component: NovelChapterEdit } : { name: '编辑卷', component: NovelVolumeEdit },
            {name: '删除', component: ChapterRemove}
          ]}
          operations={operations}
          record={record}
          actionRef={actionRef}
          position={2}
          module={'/novel'}
        />
      ),
    },
    {
      title: '下架时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.offlineTime);
      },
    },
    {
      title: '更新时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.updateTime);
      },
    },
  ];

  return (
    <ProTable<DTO.NovelChapterItem>
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
        const result = await novelChapterList(
          menuId || '',
          params.novelId || '',
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
          component={[]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/novel'}
        />,
      ]}
    />
  );
};
export default NovelChapterList;
