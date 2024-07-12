import { Dashboard } from '@/services/ant-design-pro/api';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';

const Index: React.FC = () => {
  const useStyles = createStyles(({ token }) => {
    return {
      action: {
        display: 'flex',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '200px',
        cursor: 'pointer',
        borderRadius: token.borderRadius,
      },
    };
  });
  const { styles } = useStyles();
  const loading = (
    <span className={styles.action}>
      <Spin size="large" />
    </span>
  );

  const [data, setData] = useState<any>();
  useEffect(async () => {
    //发送请求获取统计数据
    const res = await Dashboard();
    //得到数据后，更新组件状态
    setData(res);
  }, []);
  if (!data) {
    return loading;
  }
  return (
    <Row gutter={24}>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="用户数"
            value={data.users_count}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="商品数"
            value={data.goods_count}
            valueStyle={{ color: '#3f600' }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="订单数"
            value={data.order_count}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Index;
