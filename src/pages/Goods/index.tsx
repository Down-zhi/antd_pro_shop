import { GetGoods, UporDown } from '@/services/ant-design-pro/goodsapi';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Image, Switch } from 'antd';
import message from 'antd/lib/message';
import { useRef, useState } from 'react';
import AddGoods from './AddGoods';

const Index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(undefined);
  const [data, setData] = useState<any>([]);
  type GithubIssueItem = {
    url: string;
    id: any;
    number: number;
    title: string;
    labels: {
      name: string;
      color: string;
    }[];
    state: string;
    comments: number;
    description: string;
    created_at: string;
    updated_at: string;
    closed_at?: string;
    cover_url: any;
    is_on: any;
  };
  const actionRef = useRef<any>(); //用于在父组件中获取ProTable实例的引用，从而可以访问其内部的方法和属性。

  // 获取商品数据列表
  const getData = async (params: any) => {
    const response = await GetGoods(params);
    setData(response.data);
    return {
      data: response.data,
      success: true,
      // total:response.meta.pagination.total  //分页要用 由于太多数据就不用这个了
    };
  };
  // 是否上架
  const handleUporDown = async (uid: any) => {
    const response = await UporDown(uid);
    if (response.status === undefined) message.success('操作成功');
  };

  const isShowModal = (show: boolean | ((prevState: boolean) => boolean), id = undefined) => {
    setEditId(id);
    setIsModalVisible(show);
  };
  // 没什么屌用
  const handleDelete = (id: any) => {
    const newData = data.filter((item: { id: any }) => item.id !== id);
    setData(newData);
  };
  // const handleUpdate = async (uid: any, values: Record<string, any>) => {
  //   const response = await updateUser(uid, values);
  //   if (response.status === undefined) {
  //     message.success(`更新成功`);
  //     actionRef.current.reload();
  //   }
  // };
  // function handleDelete(id:any){

  // }

  //去参考 https://procomponents.ant.design/components/table#columns-%E5%88%97%E5%AE%9A%E4%B9%89
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '商品图',
      dataIndex: 'cover_url',
      width: '70px',
      hideInSearch: true,
      // editable: false, // 设置在编辑时是否可编辑 如果api中没有这一项的数据更新 可用设置不可改变，虽然自己修改也不会报错但是数据并没有被修改刷新后不会改变
      render: (_, record) => {
        return <Image width={100} src={record.cover_url} />;
      },
    },
    {
      title: '标题',
      width: '40px',
      dataIndex: 'title',
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      hideInSearch: true,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      hideInSearch: true,
    },
    {
      title: '是否上架',
      dataIndex: 'is_on',
      valueType: 'radioButton',
      valueEnum: {
        0: { text: '未上架' },
        1: { text: '已上架' },
      },
      render: (_, record) => (
        <Switch
          checkedChildren="上架"
          unCheckedChildren="下架"
          defaultChecked={record.is_on === 1}
          onChange={() => handleUporDown(record.id)}
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
          key=""
          onClick={() => isShowModal(true, record.id)}
          // onClick={() => {
          //   action?.startEditable?.(record.id); 用自带的可编辑展示框
          // }}
        >
          编辑
        </a>,
        <a
          key=""
          // onClick={ () => record.filter((item:any)=>item.id!==record.id) }
          onClick={() => handleDelete(record.id)}
        >
          删除
        </a>,
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          // onClick={() => isShowModal(true,record)}
          // action?.pageInfo?(record.description)||null }}
        >
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
        // columnsState={{
        //   persistenceKey: 'pro-table-singe-demos',
        //   persistenceType: 'localStorage',
        //   defaultValue: {
        //     option: { fixed: 'right', disable: true },
        //   },
        // }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        // form={{
        //   // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
        //   syncToUrl: (values, type) => {
        //     if (type === 'get') {
        //       return {
        //         ...values,
        //         created_at: [values.startTime, values.endTime],
        //       };
        //     }
        //     return values;
        //   },
        // }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="商品列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => isShowModal(true)}
            type="primary"
          >
            新建
          </Button>,
          // <Dropdown
          //   key="menu"
          //   menu={{
          //     items: [
          //       {
          //         label: '1st item',
          //         key: '1',
          //       },
          //       {
          //         label: '2nd item',
          //         key: '2',
          //       },
          //       {
          //         label: '3rd item',
          //         key: '3',
          //       },
          //     ],
          //   }}
          // >
          //   <Button>
          //     <EllipsisOutlined />
          //   </Button>
          // </Dropdown>,
        ]}
      />
      {
        // 模态框隐藏的时候, 不挂载组件; 模态显示时候再挂载组件, 这样是为了触发子组件的生命周期
        !isModalVisible ? (
          ''
        ) : (
          <AddGoods
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
