import { getNovel, randomEmployeeBsr, searchBsr } from '@/services/nvoel';
import { novelTags, novelTagIds } from '@/services/tag';
import { novelCategories } from '@/services/category';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormDigit, ProFormTextArea } from '@ant-design/pro-components';
import { ProFormCheckbox } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProForm,
  ProFormField,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import type { UploadFile, UploadProps } from 'antd';
import { message, Upload, Image, AutoComplete } from 'antd';
import type { ReactNode, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import { useRef } from 'react';
import { request } from 'umi';
import type { RcFile } from 'antd/es/upload/interface';
import { getFormData } from '@/util';
import { SyncOutlined } from '@ant-design/icons';
import EncryptedImage from '../EncryptedImage';
import styles from './index.module.css';
import './theme.css';

const NovelEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const [edit, setEdit] = useState<boolean>(false);

  const [randomBsrLoading, setRandomBsrLoading] = useState<boolean>(false);

  const [searching, setSearching] = useState(false);

  const [randomValue, setRandomValue] = useState<string>('');

  const [bsrOptions, setBsrOptions] = useState<any[]>([]);

  const [tagOptions, setTagOptions] = useState<
    { label: ReactNode; value: string; disabled: boolean }[]
  >([]);

  // 用来存储用户勾选的顺序
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [coverUrl, setCoverUrl] = useState<string>('');

  const [cover, setCover] = useState<string>('');

  const uploadProps: UploadProps = {
    beforeUpload: async (file: UploadFile) => {
      setFileList([file]);
      let src = file.url as string;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file as RcFile);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      setCoverUrl(src);
      return false;
    },
    onRemove: () => {
      setFileList([...[]]);
      setCoverUrl('');
    },
    multiple: false,
    maxCount: 1,
    fileList,
  };

  /**
   * 随机平台搬山人信息
   */
  const loadRandomEmployeeBsr = async () => {
    setRandomBsrLoading(true);
    const result = await randomEmployeeBsr();
    if (result.result !== 'success') {
      message.error('未获取到平台搬山人');
      setRandomBsrLoading(false);
      return;
    }
    const bsr = result.model;
    const option = { label: bsr.loginName, value: bsr.loginName, id: bsr.id };
    setBsrOptions([option]);
    setRandomValue(option.value);
    formRef.current?.setFieldsValue({
      customerName: option.label,
      customerId: option.id,
    });
    setRandomBsrLoading(false);
  };

  /**
   * 获取小说标签
   */
  const getTags = async (gender: number, adults: number) => {
    debugger
    const result = await novelTags(gender, adults);
    if (result.result !== 'success') {
      message.error('获取小说标签失败');
      return;
    }
    const tagList: { label: ReactNode; value: string; disabled: boolean }[] = [];
    for (let i = 0; i < result.model.length; i++) {
      const tag = result.model[i];
      tagList.push({
        label: <div style={{ width: '70px' }}>{tag.name}</div>,
        value: tag.id,
        disabled: false,
      });
    }
    setTagOptions([...tagList]);
  };

  /**
   * 获取搬山人列表
   * @param
   */
  const getBsrs = useMemo(() => {
    let timer: NodeJS.Timeout;

    return async (keyword: string) => {
      if (!keyword) {
        setBsrOptions([]);
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(async () => {
        setSearching(true);
        const resp = await searchBsr(keyword);
        if (!resp || resp.result !== 'success') {
          setSearching(false);
          return;
        }
        const bsrs = resp.model;
        for (let i = 0; i < bsrs.length; i++) {
          const bsr = bsrs[i];
          const option = { label: bsr.loginName, value: bsr.loginName, id: bsr.id };
          setBsrOptions([...bsrOptions, option]);
        }
        setSearching(false);
      }, 300);
    };
  }, []);

  const visibleChange = async (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue(
        record || {
          finished: 0,
          comment: 1,
          space: 1,
          viewCount: 0,
          hot: 0,
          recommend: 0,
          top: 0,
          adults: 0,
          gender: 1,
          autoUpdate: 1,
          startMemberChapter: 0,
          startPriceChapter: 0,
          chapterPrice: 0,
          loginName: '',
          password: '',
          status: 0,
        },
      );
      if (record) {
        setEdit(true);
        setRandomValue(record.novelCustomer?.loginName || '');
        formRef.current?.setFieldsValue({ customerName: record.novelCustomer?.loginName || '' });
        let result = await novelTagIds(record.id);
        if (result.result !== 'success') {
          message.error('获取标签失败');
        }
        debugger;
        formRef.current?.setFieldsValue({ tag: result.model });
        setSelectedTags(result.model);
        await getTags(record.gender, record.adults);
        result = await getNovel(record.id);
        if (result.result !== 'success') {
          message.error('获取作品信息失败');
        }
        formRef.current?.setFieldsValue({
          brief: result.model.brief,
          description: result.model.description,
        });
        setCoverUrl(record.coverUrl);
        setCover(record.cover);
      } else {
        setCover('');
        setCoverUrl('');
        setSelectedTags([]);
        await getTags(1, 0);
      }
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      width={window.innerWidth}
      onFinish={async (values) => {
        // if ((fileList === null || fileList.length === 0) && cover === '') {
        //   message.error('请选择需要上传的封面');
        //   return;
        // }
        values.cover = cover;
        values.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formData = getFormData(values);
        formData.set('tag', selectedTags.join(','));
        if(fileList != null && fileList.length > 0){
          fileList.forEach((file) => {
            formData.append('file', file as RcFile);
          });
        }
        const resp = await request<DTO.Resp<any>>(url, {
          method: 'POST',
          data: formData,
          processData: false,
        });
        if (resp.result === 'success') {
          message.success('操作成功');
          if (actionRef && actionRef.current) {
            actionRef.current.reload();
          }
          formRef.current?.resetFields();
          return true;
        } else {
          message.error(resp.msg);
          return false;
        }
      }}
    >
      <ProFormField hidden={true} name="id" />
      <ProFormField hidden={true} name="customerId" />
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '0 auto', textAlign: 'left', width: '1430px' }}>
          <ProForm.Group>
            <ProForm.Item name="customerName" label="所属用户" rules={[{ required: true }]}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AutoComplete
                  style={{ width: 306 }}
                  value={randomValue}
                  options={bsrOptions}
                  notFoundContent={searching ? '搜索中...' : '暂无数据'}
                  onSearch={getBsrs}
                  onChange={(value) => {
                    setRandomValue(value); // 允许用户输入/删除
                    formRef.current?.setFieldsValue({ customerName: value }); // 同步表单
                  }}
                  onSelect={(value: any, option: any) => {
                    formRef.current?.setFieldsValue({
                      customerId: option.id,
                    });
                  }}
                  placeholder="请输入所属用户"
                />
                <SyncOutlined
                  spin={randomBsrLoading}
                  style={{ color: '#1990FF', cursor: 'pointer' }}
                  onClick={loadRandomEmployeeBsr}
                />
              </div>
            </ProForm.Item>
            <ProFormText width="md" name="sourceUrl" label="源地址" placeholder="请输入源地址" />
            <ProFormSelect
              showSearch
              width="md"
              name="categoryId"
              label="小说分类"
              request={async () => {
                const options: SetStateAction<{ label: string; value: string }[]> = [];
                const resp = await novelCategories();
                const categories = resp.model;
                for (let i = 0; i < categories.length; i++) {
                  const category = categories[i];
                  const option = { label: category.name, value: category.id };
                  options.push(option);
                }
                return options;
              }}
              debounceTime={10}
              placeholder="请选择小说分类"
            />
            <ProFormText
              width="md"
              name="title"
              label="书名"
              placeholder="请输入书名"
              fieldProps={{ maxLength: 255 }}
              rules={[{ required: true, message: '请输入书名' }]}
            />
            <ProFormText
              width="md"
              name="titleAlias"
              label="别名"
              fieldProps={{ maxLength: 255 }}
              placeholder="请输入别名,多别名用,号分隔"
            />
            <ProFormText
              width="md"
              name="slug"
              label="标识"
              placeholder="请输入标识，全局唯一"
              fieldProps={{ maxLength: 255 }}
              rules={[{ required: true, message: '请输入标识' }]}
            />
            <ProFormText
              width="md"
              name="keywords"
              label="关键字"
              fieldProps={{ maxLength: 255 }}
              placeholder="请输入关键字,多关键字用,号分隔"
            />
            <ProFormText
              width="md"
              name="authors"
              label="作者"
              placeholder="请输入作者,多作者用,号分隔"
              rules={[{ required: true, message: '请输入作者' }]}
            />
            <ProFormDigit
              width="md"
              name="startMemberChapter"
              label="会员章节"
              placeholder="从第几话开始设置会员,0不设置"
              min={0}
              rules={[{ required: true, message: '请输入会员章节' }]}
            />
            <ProFormDigit
              width="md"
              name="startPriceChapter"
              label="收费章节"
              placeholder="从第几话开始收费,0不设置"
              min={0}
              rules={[{ required: true, message: '请输入收费章节' }]}
            />
            <ProFormDigit
              width="md"
              name="chapterPrice"
              label="章节价格"
              placeholder="请设置章节价格,0不收费"
              min={0}
              rules={[{ required: true, message: '请输入章节价格' }]}
            />
            <ProFormDigit
              width="md"
              name="viewCount"
              label="浏览量"
              placeholder="请输入浏览量"
              min={0}
            />

            <ProFormRadio.Group
              width="md"
              name="hot"
              label="热门"
              options={[
                {
                  label: '是',
                  value: 1,
                },
                {
                  label: '否',
                  value: 0,
                },
              ]}
              rules={[{ required: true, message: '请选择热门' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="recommend"
              label="推荐"
              options={[
                {
                  label: '是',
                  value: 1,
                },
                {
                  label: '否',
                  value: 0,
                },
              ]}
              rules={[{ required: true, message: '请选择是否推荐' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="top"
              label="首页"
              options={[
                {
                  label: '是',
                  value: 1,
                },
                {
                  label: '否',
                  value: 0,
                },
              ]}
              rules={[{ required: true, message: '请选择是否首页' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="adults"
              label="大人系"
              options={[
                {
                  label: '是',
                  value: 1,
                },
                {
                  label: '否',
                  value: 0,
                },
              ]}
              fieldProps={{
                onChange: (item) => {
                  getTags(formRef.current?.getFieldValue('gender'), item.target.value);
                },
              }}
              rules={[{ required: true, message: '请选择是否限制级' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="gender"
              label="适合性别"
              options={[
                {
                  label: '男频',
                  value: 1,
                },
                {
                  label: '女频',
                  value: 2,
                },
              ]}
              fieldProps={{
                onChange: (item) => {
                  getTags(item.target.value, formRef.current?.getFieldValue('adults'));
                },
              }}
              rules={[{ required: true, message: '请选择适合性别' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="space"
              label="篇幅"
              options={[
                {
                  label: '连载',
                  value: 1,
                },
                {
                  label: '短篇',
                  value: 0,
                },
              ]}
              rules={[{ required: true, message: '请选择篇幅' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="comment"
              label="支持评论"
              options={[
                {
                  label: '是',
                  value: 1,
                },
                {
                  label: '否',
                  value: 0,
                },
              ]}
              rules={[{ required: true, message: '请选择是否支持评论' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="finished"
              label="是否完结"
              options={[
                {
                  label: '是',
                  value: 1,
                },
                {
                  label: '否',
                  value: 0,
                },
              ]}
              rules={[{ required: true, message: '请选择是否完结' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="autoUpdate"
              label="自动更新"
              options={[
                {
                  label: '开启',
                  value: 1,
                },
                {
                  label: '关闭',
                  value: 0,
                },
              ]}
              rules={[{ required: true, message: '请选择是否支持评论' }]}
            />
            <ProFormRadio.Group
              width="md"
              name="status"
              label="状态"
              options={[
                {
                  label: '上架',
                  value: 1,
                },
                {
                  label: '下架',
                  value: 0,
                },
                {
                  label: '瑕疵',
                  value: 2,
                },
              ]}
              rules={[{ required: true, message: '请选择状态' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormCheckbox.Group
              name="tag"
              label="标签"
              options={tagOptions}
              fieldProps={{
                value: selectedTags,
                onChange: (checkedValues: any[]) => {
                  setSelectedTags((prev) => {
                    // 保留之前顺序，新增的排在后面
                    const newOrder = [
                      ...prev.filter((v) => checkedValues.includes(v)),
                      ...checkedValues.filter((v) => !prev.includes(v)),
                    ];
                    return newOrder;
                  });
                },
              }}
            />
          </ProForm.Group>
          <ProForm.Group>
            <Upload {...uploadProps}>
              <div>
                <div>
                  <span style={{ cursor: 'pointer' }}>
                    上传封面
                  </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  {edit ? (
                    <EncryptedImage
                      width={108}
                      height={160}
                      preview={false}
                      src={coverUrl !== '' ? coverUrl : 'error'}
                      fallback="https://toolb.cn/iph/108x160?t=Upload&bg=b7b7b7"
                    />
                  ) : (
                    <Image
                      width={108}
                      height={160}
                      preview={false}
                      src={coverUrl !== '' ? coverUrl : 'error'}
                      fallback="https://toolb.cn/iph/108x160?t=Upload&bg=b7b7b7"
                    />
                  )}
                </div>
              </div>
            </Upload>
            <ProFormTextArea
              width={545}
              fieldProps={{ style: { height: '160px' } }}
              label="作品简介"
              name="brief"
            />
            <ProFormTextArea
              width={545}
              fieldProps={{ style: { height: '160px' } }}
              label="描述信息"
              name="description"
            />
          </ProForm.Group>
        </div>
      </div>
    </DrawerForm>
  );
};
export default NovelEdit;
