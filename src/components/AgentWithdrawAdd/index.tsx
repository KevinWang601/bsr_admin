import { agentBalance } from '@/services/agent';
import { getLoginDto, getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { DrawerForm, ProForm, ProFormField } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { request } from 'umi';
import styles from './index.module.css';

const AgentWithdrawAdd: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;

  const formRef = useRef<ProFormInstance>();

  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async () => {
    const result = await agentBalance(getLoginDto().id);
    if (!result || result.result !== 'success') {
      message.error('获取余额失败');
      return;
    }
    setBalance(result.model);
  };

  const visibleChange = (visible: boolean) => {
    if (visible) {
      fetchBalance();
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        const resp = await request<DTO.Resp<any>>(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: getQueryString(values),
          processData: false,
        });

        if (resp.result === 'success') {
          message.success('操作成功');
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
      <ProFormField hidden={true} name="id" />
      <div className={styles.balance}>
        {balance >= 200 ? (
          <>
            可提现金额:<span>{balance.toFixed(2)}</span>
          </>
        ) : (
          <>
            当前余额:<span>{balance.toFixed(2)}</span>不足200， 不支持提现操作。
          </>
        )}
      </div>
      <ProForm.Group>
        <ProFormField width="lg" name="address" label="提款地址" placeholder="请输入TRC20地址" />
      </ProForm.Group>
    </DrawerForm>
  );
};
export default AgentWithdrawAdd;
