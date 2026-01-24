import { message, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { dayUniques, monthUniques, profits, orders, members, vips } from '@/services/analytics';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Column, Line } from '@ant-design/charts';
import { LeftOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import { formatZoneConverter } from '@/util';
import { format } from '@happys/money-format';

const AdminIndex: React.FC = () => {
  const { TabPane } = Tabs;

  const [time, setTime] = useState<string>(formatZoneConverter(new Date(), 'YYYY年MM月DD日'));

  const [dayTotal, setDayTotal] = useState<number>(0);

  const [monthTotal, setMonthTotal] = useState<number>(0);

  const [tabKey, setTabKey] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  const [offset, setOffset] = useState<number>(0);

  const [dayUniquesData, setDayUniquesData] = useState<DTO.UniqueListItem[]>([]);

  const [monthUniquesData, setMonthUniquesData] = useState<DTO.UniqueListItem[]>([]);

  const [profitsData, setProfitsData] = useState<number[]>([0, 0]);

  const [ordersData, setOrdersData] = useState<number[]>([0, 0]);

  const [membersData, setMembersData] = useState<number[]>([0, 0]);

  const [vipsData, setVipsData] = useState<number[]>([0, 0]);

  const fetchDayUniquesData = async () => {
    setLoading(true);
    const result = await dayUniques(offset);
    if (!result || result.result !== 'success') {
      message.error('获取UA失败');
      setLoading(false);
      return;
    }
    setLoading(false);
    let totalUniques = 0;
    setDayUniquesData([
      ...result.model.map((item: any) => {
        totalUniques += item.uniques;
        return {
          uniques: item.uniques,
          dateTime: formatZoneConverter(item.dateTime, 'MM-DD HH'),
          hostName: item.hostName,
        };
      }),
    ]);
    setDayTotal(totalUniques);
  };

  const fetchMonthUniquesData = async () => {
    setLoading(true);
    const result = await monthUniques(offset);
    if (!result || result.result !== 'success') {
      message.error('获取月UA失败');
      setLoading(false);
      return;
    }
    setLoading(false);
    let totalUniques = 0;
    setMonthUniquesData([
      ...result.model.map((item: any) => {
        totalUniques += item.uniques;
        return {
          uniques: item.uniques,
          dateTime: formatZoneConverter(item.dateTime, 'MM-DD'),
        };
      }),
    ]);
    setMonthTotal(totalUniques);
  };

  const fetchProfitData = async () => {
    setLoading(true);
    const result = await profits();
    if (!result || result.result !== 'success') {
      message.error('获取利润失败');
      setLoading(false);
      return;
    }
    setLoading(false);
    setProfitsData([...result.model]);
  };

  const fetchOrderData = async () => {
    setLoading(true);
    const result = await orders();
    if (!result || result.result !== 'success') {
      message.error('获取利润失败');
      setLoading(false);
      return;
    }
    setLoading(false);
    setOrdersData([...result.model]);
  };

  const fetchMemberData = async () => {
    setLoading(true);
    const result = await members();
    if (!result || result.result !== 'success') {
      message.error('获取利润失败');
      setLoading(false);
      return;
    }
    setLoading(false);
    setMembersData([...result.model]);
  };

  const fetchVipData = async () => {
    setLoading(true);
    const result = await vips();
    if (!result || result.result !== 'success') {
      message.error('获取利润失败');
      setLoading(false);
      return;
    }
    setLoading(false);
    setVipsData([...result.model]);
  };

  useEffect(() => {
    fetchDayUniquesData();
    fetchMonthUniquesData();
    const today = new Date();
    if (tabKey === 1) {
      today.setDate(today.getDate() + offset);
      setTime(formatZoneConverter(today, 'YYYY年MM月DD日'));
    } else {
      today.setMonth(today.getMonth() + (offset > 0 ? 0 : offset));
      setTime(formatZoneConverter(today, 'YYYY年MM月'));
    }
    fetchProfitData();
    fetchOrderData();
    fetchMemberData();
    fetchVipData();
  }, [offset, tabKey]);

  const dayConfig = {
    data: dayUniquesData,
    xField: 'dateTime',
    yField: 'uniques',
    seriesField: 'hostName',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  const monthConfig = {
    data: monthUniquesData,
    xField: 'dateTime',
    yField: 'uniques',
    columnWidthRatio: 0.8,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      dateTime: {
        alias: '日期',
      },
      uniques: {
        alias: '访问人数',
      },
    },
    label: {},
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };

  const operations = (
    <Space>
      <LeftOutlined
        onClick={() => {
          setOffset(offset - 1);
        }}
      />
      {time}:{tabKey === 1 ? dayTotal : monthTotal}
      <RightOutlined
        onClick={() => {
          setOffset(offset + 1 > 0 ? 0 : offset + 1);
        }}
      />
      <ReloadOutlined spin={loading} />
    </Space>
  );

  const switchTab = (key: string) => {
    // const today = new Date();
    if (key === '1') {
      setTabKey(1);
    } else {
      setTabKey(2);
    }
    setOffset(0);
  };

  return (
    <>
      {/* 网站数据  */}
      <StatisticCard.Group direction={window.innerWidth < 768 ? 'column' : 'row'}>
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
        <StatisticCard
          statistic={{
            title: 'VIP',
            value: `共计:${vipsData[0]}  可用:${vipsData[1]}`,
            valueStyle: { fontSize: '14px' },
            icon: (
              <img
                width={42}
                height={42}
                src={require('../../assets/images/vip_icon.png')}
                alt="icon"
              />
            ),
          }}
        />
      </StatisticCard.Group>
      {/* 访问量统计 */}
      <ProCard bordered headerBordered split={'horizontal'}>
        <Tabs
          defaultActiveKey="1"
          onChange={switchTab}
          style={{ margin: '8px 16px' }}
          tabBarExtraContent={operations}
        >
          <TabPane tab="今日UV" key="1">
            <Line {...dayConfig} style={{ padding: '16px', height: '260px' }} />
          </TabPane>
          <TabPane tab="当月累计" key="2">
            <Column {...monthConfig} style={{ padding: '16px', height: '260px' }} />
          </TabPane>
        </Tabs>
      </ProCard>
    </>
  );
};

export default AdminIndex;
