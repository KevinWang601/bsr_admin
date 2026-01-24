import { QuestionCircleOutlined } from '@ant-design/icons';
import { nanoid, type ActionType } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import type { MutableRefObject } from 'react';
import { request } from 'umi';
import { getQueryString } from '@/util';

interface Customized {
  name: string;
  component: React.FC<EditType>;
}

interface OperationType {
  operations: Operation[];
  ids?: string;
  record?: any;
  actionRef: MutableRefObject<ActionType | undefined>;
  position: number;
  component: Customized[];
  module: string;
}

const OperationView: React.FC<OperationType> = (porps) => {
  const { operations, ids, record, actionRef, position, component, module } = porps;

  const getCustomizedComponent = (name?: string): React.FC<EditType> | null => {
    for (let i = 0; i < component.length; i++) {
      if (name === component[i].name) {
        return component[i].component;
      }
    }
    return null;
  };

  const buildOperations = () => {
    const btns = [];
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      const url = API_URL + module + operation.url || '';
      if (position === 1 && operation.position === position) {
        if (operation.notify === 0) {
          const CustomizedCompnent = getCustomizedComponent(operation.name);
          if (CustomizedCompnent !== null) {
            btns.push(
              <CustomizedCompnent
                key={operation.id}
                actionRef={actionRef}
                trigger={<Button type="primary">{operation.name}</Button>}
                url={url}
                ids={ids}
              />,
            );
          }
        } else if (operation.notify === 1) {
          btns.push(
            <Popconfirm
              key={operation.id}
              title={'确定' + operation.name + '?'}
              onConfirm={async () => {
                if (ids?.length === 0) {
                  message.error('请勾选数据');
                  return;
                }
                const resp = await request<DTO.Resp<any>>(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  data: getQueryString({
                    ids: ids,
                  }),
                  processData: false,
                });
                if (resp.result === 'success') {
                  actionRef.current!.reload();
                  if (actionRef.current!.clearSelected) actionRef.current!.clearSelected();
                  message.success(resp.msg === null ? '操作成功' : resp.msg);
                } else {
                  message.error(resp.msg);
                }
              }}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              {operation.name.includes('删除') ? (
                <Button type="primary" danger>
                  {operation.name}
                </Button>
              ) : (
                <Button>{operation.name}</Button>
              )}
            </Popconfirm>,
          );
        } else if (operation.notify === 2) {
          btns.push(
            <Popconfirm
              key={operation.id}
              title={'确定' + operation.name + '?'}
              onConfirm={async () => {
                const resp = await request<DTO.Resp<any>>(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  processData: false,
                });
                if (resp.result === 'success') {
                  actionRef.current!.reload();
                  if (actionRef.current!.clearSelected) actionRef.current!.clearSelected();
                  message.success(resp.msg === null ? '操作成功' : resp.msg);
                } else {
                  message.error(resp.msg);
                }
              }}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              {operation.name.includes('删除') ? (
                <Button type="primary" danger>
                  {operation.name}
                </Button>
              ) : (
                <Button>{operation.name}</Button>
              )}
            </Popconfirm>,
          );
        }
      } else if (position === 2 && operation.position === position) {
        if (operation.notify === 0) {
          const CustomizedCompnent = getCustomizedComponent(operation.name);
          if (CustomizedCompnent !== null) {
            btns.push(
              <CustomizedCompnent
                key={operation.id}
                trigger={<a>{operation.name}</a>}
                record={record}
                actionRef={actionRef}
                url={url}
              />,
            );
          }
        } else if (operation.notify === 1) {
          btns.push(
            <Popconfirm
              key={operation.id}
              title={'确定' + operation.name + '?'}
              onConfirm={async () => {
                const resp = await request<DTO.Resp<any>>(url + '/' + record!.id, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  processData: false,
                });
                if (resp.result === 'success') {
                  actionRef.current!.reload();
                  message.success(resp.msg === null ? '操作成功' : resp.msg);
                } else {
                  message.error(resp.msg);
                }
              }}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <a
                href="#"
                style={{
                  color:
                    operation.name === '删除'
                      ? '#F94A29'
                      : operation.name === '上架'
                      ? '#03C988'
                      : operation.name === '下架'
                      ? '#2C3333'
                      : '#30E3DF',
                }}
              >
                {operation.name}
              </a>
            </Popconfirm>,
          );
        } else {
          btns.push(
            <a
              key={operation.id}
              href="#"
              onClick={async () => {
                const resp = await request<DTO.Resp<any>>(url + '/' + record!.id, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  processData: false,
                });
                if (resp.result === 'success') {
                  actionRef.current!.reload();
                  message.success('操作成功');
                } else {
                  message.error(resp.msg);
                }
              }}
            >
              {operation.name}
            </a>,
          );
        }
      }
    }
    if (position === 2) {
      btns.push(
        <a
          key={nanoid()}
          href="#"
          onClick={() => {
            navigator.clipboard.writeText(record!.id).then(
              () => {
                message.info('复制成功');
              },
              () => {
                message.error('复制失败');
              },
            );
          }}
        >
          复制编号
        </a>,
      );
    }
    return btns;
  };

  return <Space wrap>{buildOperations()}</Space>;
};

export default OperationView;
