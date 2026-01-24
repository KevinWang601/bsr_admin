import { Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { agentIncome, agentMember, agentOrder } from '@/services/analytics';
import { format } from '@happys/money-format';
import { StatisticCard } from '@ant-design/pro-components';
import { getLoginDto } from '@/util';
import styles from './index.less';

const AgentIndex: React.FC = () => {
  const [profitsData, setProfitsData] = useState<number[]>([0, 0]);

  const [ordersData, setOrdersData] = useState<number[]>([0, 0]);

  const [membersData, setMembersData] = useState<number[]>([0, 0]);

  const fetchProfitData = async () => {
    const result = await agentIncome();
    if (!result || result.result !== 'success') {
      message.error('获取利润失败');
      return;
    }
    setProfitsData([...result.model]);
  };

  const fetchOrderData = async () => {
    const result = await agentOrder();
    if (!result || result.result !== 'success') {
      message.error('获取利润失败');
      return;
    }
    setOrdersData([...result.model]);
  };

  const fetchMemberData = async () => {
    const result = await agentMember();
    if (!result || result.result !== 'success') {
      message.error('获取利润失败');
      return;
    }
    setMembersData([...result.model]);
  };

  useEffect(() => {
    fetchProfitData();
    fetchOrderData();
    fetchMemberData();
  }, []);

  return (
    <>
      <div className={styles.link}>
        分销链接：
        <Typography.Text copyable={true} ellipsis={true}>
          {`https://www.banshanren.com?code=${getLoginDto().agentCode}`}
        </Typography.Text>
      </div>
      {/* 网站数据  */}
      <StatisticCard.Group direction={'row'}>
        <StatisticCard
          statistic={{
            title: '收入',
            value: `共计:${format(profitsData[0])}  本月:${format(profitsData[1])}`,
            valueStyle: { fontSize: '14px' },
            icon: (
              <img
                width={42}
                height={42}
                src={require('../../assets/images/dollor_icon.png')}
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '订单',
            value: `共计:${ordersData[0]}  本月:${ordersData[1]}`,
            valueStyle: { fontSize: '14px' },
            icon: (
              <img
                width={42}
                height={42}
                src={require('../../assets/images/order_icon.png')}
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: '会员',
            value: `共计:${membersData[0]}  本月:${membersData[1]}`,
            valueStyle: { fontSize: '14px' },
            icon: (
              <img
                width={42}
                height={42}
                src={require('../../assets/images/member_icon.png')}
                alt="icon"
              />
            ),
          }}
        />
      </StatisticCard.Group>
    </>
  );
};

export default AgentIndex;
