import { getcategory, UseorBan } from '@/services/ant-design-pro/category';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Switch } from 'antd';
import message from 'antd/lib/message';
import React, { useRef, useState } from 'react';
import AddCategory from './AddCategory';
const Index: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(undefined);
  type GithubIssueItem = {
    url: string;
    id: any;
    number: number;
    title: string;
    name: string;
    labels: {
      name: string;
      color: string;
    }[];
    status: number;
  };
  const actionRef = useRef<any>();
  // 获取用户数据
  const getData = async (type: any) => {
    const response = await getcategory(type);
    return {
      data: response, //返回没有data套一层了
      // total:response.meta.pagination.total  //分页要用 由于太多数据就不用这个了
    };
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '层级',
      dataIndex: 'level',
      width: '170px',
    },
    {
      title: '状态是否使用',
      dataIndex: 'status',
      valueType: 'radioButton',
      width: '170px',
      tooltip: '系统数据不能编辑',
      valueEnum: {
        0: { text: '未上架' },
        1: { text: '已上架' },
      },
      render: (_, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="不用"
          defaultChecked={record.status === 1}
          onChange={() => UseorBan(record.id)}
        />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          // onClick={ () => isShowModal(true, record.id) }
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

  function handleDelete(): Promise<any> {
    throw message.error('还没有权限');
  }
  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setEditId(id);
    setIsModalVisible(show);
  };
  return (
    <PageContainer>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async () => getData()}
        editable={{
          type: 'multiple',
          //   onSave: handleUpdate, //不能用这个表格的编辑功能 因为后台更新只能更新两个内容 但是自带编辑框会更改所以类
          onDelete: handleDelete,
        }}
        rowKey="id"
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
        search={false} //是否有查询表单 你要用Query 请求参数 可以请求到才能用于查询
        dateFormatter="string"
        headerTitle="分类列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => isShowModal(true)}
            type="primary"
          >
            添加分类
          </Button>,
        ]}
      />
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <AddCategory
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
            editId={editId}
          />
        )
      }
    </PageContainer>
  );
};
export default Index;
