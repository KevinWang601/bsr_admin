import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { nanoid } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { novelList } from '@/services/nvoel';
import type { SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { message, Select } from 'antd';
import { useState } from 'react';
import OperationView from '@/components/OperationView';
import { timeZoneConverter } from '@/util';
import NovelEdit from '@/components/NovelEdit';
import NovelChapterAdd from '@/components/NovelChapterAdd';
import ComicBatchSync from '@/components/ComicBatchSync';
import ComicMigrateEdit from '@/components/ComicMigrateEdit';
import { useParams } from 'umi';
import EncryptedImage from '@/components/EncryptedImage';
import { novelCategories } from '@/services/category';
import { novelTags } from '@/services/tag';
import NovelVipEdit from '@/components/NovelVipEdit';
import NovelVolumeAdd from '@/components/NovelVolumeAdd';

const CategorySelect: React.FC<{
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
      const resp = await novelCategories();
      if (resp.result !== 'success') return;
      const categories = resp.model;
      const options: SetStateAction<{ label: string; value: string }[]> = [
        { label: '请选择', value: '-1' },
      ];
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const option = { label: category.name, value: category.id };
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

const TagSelect: React.FC<{
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
      const resp = await novelTags();
      if (resp.result !== 'success') return;
      const tags = resp.model;
      const options: SetStateAction<{ label: string; value: string }[]> = [
        { label: '请选择', value: '-1' },
      ];
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const option = { label: tag.name, value: tag.id };
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

const NovelList: React.FC = () => {
  const queryParams = useParams<{ id: string }>();
  const menuId = queryParams.id;

  const actionRef = useRef<ActionType>();
  const [operations, setOperations] = useState<Operation[]>([]);
  const ids: any[] = [];

  const columns: ProColumns<DTO.NovelListItem>[] = [
    {
      title: '封面',
      search: false,
      width: 80,
      render: (dom, record) => {
        return (
          <EncryptedImage
            src={record.thumbUrl}
            width={54}
            height={80}
            style={{ borderRadius: '8px' }}
          />
        );
      },
    },
    {
      title: '书名',
      formItemProps: { label: '关键字', name: 'keyword' },
      dataIndex: 'title',
      width: 180,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '分类',
      width: 100,
      ellipsis: true,
      render: (dom, record) => {
        return record.novelCategory != null ? record.novelCategory.name : '暂无分类';
      },
      formItemProps: { label: '所属分类', name: 'categoryId' },
      initialValue: '-1',
      valueType: 'select',
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return <CategorySelect {...rest} />;
      },
    },
    {
      title: '标签',
      width: 100,
      ellipsis: true,
      dataIndex: 'tagNames',
      formItemProps: { label: '所属标签', name: 'tagId' },
      initialValue: '-1',
      valueType: 'select',
      renderFormItem: (item, { type, defaultRender, ...rest }) => {
        return <TagSelect {...rest} />;
      },
    },
    {
      title: '关键字',
      search: false,
      width: 100,
      ellipsis: true,
      dataIndex: 'keywords',
    },
    {
      title: '篇幅',
      search: false,
      width: 60,
      ellipsis: true,
      render: (dom, record) => {
        return record.space === 0 ? '短篇' : '连载';
      },
    },
    {
      title: '作者',
      search: false,
      width: 100,
      ellipsis: true,
      dataIndex: 'authors',
    },
    {
      title: '热门',
      width: 60,
      ellipsis: true,
      render: (dom, record) => {
        return record.hot === 0 ? '否' : '是';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '是否热门', name: 'hot' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '0',
        },
      ],
    },
    {
      title: '推荐',
      width: 60,
      ellipsis: true,
      render: (dom, record) => {
        return record.recommend === 0 ? '否' : '是';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '是否推荐', name: 'recommend' },
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
          label: '否',
          value: '0',
        },
      ],
    },
    {
      title: '首页',
      width: 60,
      ellipsis: true,
      render: (dom, record) => {
        return record.top === 0 ? '否' : '是';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '是否首页', name: 'top' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '0',
        },
      ],
    },
    {
      title: '适合年龄',
      width: 80,
      render: (dom, record) => {
        return record.adults === 0 ? '全年龄' : '大人系';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '适合年龄', name: 'adults' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '全年龄',
          value: '0',
        },
        {
          label: '大人系',
          value: '1',
        },
      ],
    },
    {
      title: '性别倾向',
      width: 80,
      render: (dom, record) => {
        return record.gender === 1 ? '男频' : '女频';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '性别倾向', name: 'gender' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '男频',
          value: '1',
        },
        {
          label: '女频',
          value: '2',
        },
      ],
    },
    {
      title: '章节',
      search: false,
      width: 60,
      ellipsis: true,
      dataIndex: 'chapterCount',
    },
    {
      title: '总字数',
      search: false,
      width: 60,
      ellipsis: true,
      dataIndex: 'wordCount',
    },
    {
      title: '浏览量',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'viewCount',
      sorter: true,
    },
    {
      title: '收藏量',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'collectCount',
      sorter: true,
    },
    {
      title: '完结',
      width: 80,
      ellipsis: true,
      render: (dom, record) => {
        return record.finished === 1 ? '是' : '否';
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '完结状态', name: 'finished' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '已完结',
          value: '1',
        },
        {
          label: '连载中',
          value: '0',
        },
      ],
    },
    {
      title: '状态',
      width: 60,
      ellipsis: true,
      render: (dom, record) => {
        return record.status === 0 ? (
          <span style={{ color: '#F94A29' }}>下架</span>
        ) : record.status === 2 ? (
          '瑕疵'
        ) : (
          '上架'
        );
      },
      initialValue: '-1',
      valueType: 'select',
      formItemProps: { label: '状态', name: 'status' },
      request: async () => [
        {
          label: '请选择',
          value: '-1',
        },
        {
          label: '上架',
          value: '1',
        },
        {
          label: '下架',
          value: '0',
        },
        {
          label: '瑕疵',
          value: '2',
        },
      ],
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
            { name: '编辑', component: NovelEdit },
            { name: '新增卷', component: NovelVolumeAdd },
            { name: '新增章', component: NovelChapterAdd },
            { name: '付费', component: NovelVipEdit },
            { name: '迁移', component: ComicMigrateEdit },
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
      title: '会员起始',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'startMemberChapter',
    },
    {
      title: '付费起始',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'startPriceChapter',
    },
    {
      title: '单章价格',
      search: false,
      width: 80,
      ellipsis: true,
      dataIndex: 'chapterPrice',
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
    {
      title: '创建时间',
      search: false,
      width: 180,
      ellipsis: true,
      render: (dom, record) => {
        return timeZoneConverter(record.createTime);
      },
    },
  ];

  return (
    <ProTable<DTO.NovelListItem>
      rowKey="id"
      columns={columns}
      search={{
        span: 4,
      }}
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
        let orderBy = '';
        if (sort) {
          const key = Object.keys(sort)[0];
          const val = sort[key];
          if (key === 'viewCount') {
            orderBy = 'view_count';
          }
          if (key === 'collectCount') {
            orderBy = 'collect_count';
          }
          if (orderBy != '' && val === 'descend') {
            orderBy += ' desc';
          }
        }
        const result = await novelList(
          menuId || '',
          params.current || 1,
          params.pageSize || 20,
          params.keyword || '',
          params.categoryId || '-1',
          params.tagId || '-1',
          params.hot || '-1',
          params.recommend || '-1',
          params.top || '-1',
          params.adults || '-1',
          params.gender || '-1',
          params.finished || '-1',
          params.status || '-1',
          orderBy,
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
          component={[
            { name: '新增', component: NovelEdit },
            { name: '批量同步', component: ComicBatchSync },
          ]}
          operations={operations}
          actionRef={actionRef}
          position={1}
          module={'/novel'}
        />,
      ]}
    />
  );
};
export default NovelList;
