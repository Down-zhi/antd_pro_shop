import { GetUsers } from '@/services/ant-design-pro/api';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { Avatar, Button, Dropdown, Switch } from 'antd';
import React, { useRef } from 'react';
const Index: React.FC = () => {
  type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
      name: string;
      color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
    avatar_url: any;
    is_locked: any;
  };
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      hideInSearch: true,
      render: (_, record) => {
        return <Avatar size={32} src={record.avatar_url} />;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '是否启用',
      dataIndex: 'is_locked',
      hideInSearch: true,
      render: (_, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          defaultChecked={record.is_locked === 0}
          onChange={() => {}}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' },
          ]}
        />,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  const getData = async (params: any) => {
    const response = await GetUsers(params);
    return {
      data: response.data,
      success: true,
      // total:response.meta.pagination.total  //分页要用 由于太多数据就不用这个了
    };
  };
  return (
    <PageContainer>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        // request={async (params, sort, filter) => {
        //     console.log(sort, filter);
        //     await waitTime(2000);
        //     return request<{
        //         data: GithubIssueItem[];
        //     }>('https://proapi.azurewebsites.net/github/issues', {
        //         params,
        //     });
        // }}
        request={async (params) => getData(params)}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
            }}
            type="primary"
          >
            新建
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: '1st item',
                  key: '1',
                },
                {
                  label: '2nd item',
                  key: '2',
                },
                {
                  label: '3rd item',
                  key: '3',
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </PageContainer>
  );
};
export default Index;
