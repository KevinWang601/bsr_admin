import { getQueryString } from "@/util";
import type { ProFormInstance } from "@ant-design/pro-components";
import {
  ProForm,
  ProFormDigit,
  ProFormField,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { DrawerForm } from "@ant-design/pro-components";
import { Col, message, Row } from "antd";
import type { SetStateAction } from "react";
import { useRef } from "react";
import { request } from "umi";
import { novelVolume } from "@/services/nvoel";

const NovelChapterAdd: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const visibleChange = (visible: boolean) => {
    if (visible) {
      formRef.current?.setFieldsValue({
        novelId: record.id,
        title: "第" + (record.chapterCount + 1) + "章",
        novelTitle: record.title,
        member: 0,
        price: 0,
        sort: record.chapterCount + 1,
        status: 1,
      });
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? "" : record.id)}
      formRef={formRef}
      trigger={trigger}
      width={"80%"}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        const resp = await request<DTO.Resp<any>>(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          data: getQueryString(values),
          processData: false,
        });
        if (resp.result === "success") {
          message.success("操作成功");
          if (actionRef && actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        } else {
          message.error(resp.msg);
          return false;
        }
      }}
    >
      <ProFormField hidden={true} name="novelId" />
      <ProForm.Group>
        <ProFormText
          width="md"
          name="novelTitle"
          label="小说名称"
          placeholder="请输入小说名称"
          disabled={true}
        />
        <ProFormSelect
          showSearch
          width="md"
          name="parentId"
          label="所属卷"
          request={async () => {
            const options: SetStateAction<{ label: string; value: string }[]> =
              [];
            const resp = await novelVolume(record.id);
            const volumes = resp.model;
            for (let i = 0; i < volumes.length; i++) {
              const volume = volumes[i];
              const option = { label: volume.title, value: volume.id };
              options.push(option);
            }
            return options;
          }}
          debounceTime={10}
          placeholder="请选择所属卷"
        />
        <ProFormText
          width="md"
          name="title"
          label="章节名称"
          placeholder="请输入章节名称"
          rules={[{ required: true, message: "请输入章节名称" }]}
        />
        <ProFormRadio.Group
          name="member"
          label="会员"
          options={[
            {
              label: "是",
              value: 1,
            },
            {
              label: "否",
              value: 0,
            },
          ]}
        />
        <ProFormDigit
          width="md"
          name="price"
          min={0}
          label="价格"
          placeholder="请输入价格"
          rules={[{ required: true, message: "请输入价格" }]}
        />
        <ProFormDigit
          width="md"
          name="sort"
          min={1}
          label="章节序号"
          placeholder="如果序号已存在，则会插入到该序号之前"
          rules={[{ required: true, message: "请输入章节序号" }]}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            {
              label: "上架",
              value: 1,
            },
            {
              label: "下架",
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
      <Row>
        <Col span={24}>
          <ProFormTextArea
            name="content"
            fieldProps={{
              style: {
                height: 560,
              },
              onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                const text = e.clipboardData.getData("text");
                const formatted = text
                  .replace(/\n+/g, "\n");
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                const newValue =
                  value.substring(0, start) + formatted + value.substring(end);
                textarea.value = newValue;
                textarea.selectionStart = textarea.selectionEnd =
                  start + formatted.length;
              },
            }}
          />
        </Col>
      </Row>
    </DrawerForm>
  );
};
export default NovelChapterAdd;
