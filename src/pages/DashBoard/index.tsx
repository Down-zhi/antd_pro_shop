import { Dashboard } from '@/services/ant-design-pro/api';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
//分组展示
import { ProCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
const { Divider } = ProCard;

//后续添加表格展示
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
  const [responsive, setResponsive] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    const GetData = async () => {
      try {
        //发送请求获取统计数据
        const res = await Dashboard();
        //得到数据后，更新组件状态
        setData(res);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    GetData();
  }, []);
  if (!data) {
    return loading;
  }
  return (
    <div>
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
      <div style={{ height: '400px' }}></div>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard.Group title="统计指标" direction={responsive ? 'column' : 'row'}>
          <ProCard>
            <Statistic title="用户数量" value={data.users_count} precision={2} />
          </ProCard>
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <ProCard>
            <Statistic title="商品数量" value={data.goods_count} precision={2} />
          </ProCard>
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <ProCard>
            <Statistic title="订单数量" value={data.order_count} suffix="/ 100" />
          </ProCard>
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <ProCard>
            <Statistic title="总访问数" value={data.users_info.total_nums} />
          </ProCard>
        </ProCard.Group>
      </RcResizeObserver>
    </div>
  );
};

export default Index;
