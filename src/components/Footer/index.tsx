import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${new Date().getFullYear()} 后台管理项目 `}
      links={[
        {
          key: 'GuoDaXia’s Blog',
          title: 'GuoDaXia’s Blog',
          href: 'https://next-blog-three-drab.vercel.app/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Down-zhi',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: '参考',
          href: 'https://pro.ant.design/zh-CN',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
