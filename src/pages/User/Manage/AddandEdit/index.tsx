import AliyunOSS from '@/components/AliyunOSS';
import { addUser, showUser, updateUser } from '@/services/ant-design-pro/api';
import { UploadOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message, Modal, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
interface Props {
  isModalVisible: any;
  isShowModal: any;
  actionRef: any;
  editId: any;
}

function Index(props: Props) {
  const [initialValues, setInitialValues] = useState<any>(undefined);
  const { isModalVisible } = props; // 模态框是否显示
  const { isShowModal } = props; // 操作模态框显示隐藏的方法
  const { actionRef } = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const { editId } = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有

  // 添加 或者 编辑 的描述文字
  const type = editId === undefined ? '添加' : '编辑';

  useEffect(() => {
    const GetData = async () => {
      try {
        // 发送请求, 获取用户详情
        if (editId !== undefined) {
          const response = await showUser(editId);
          // 获取数据之后, 修改状态, 状态改变, 组件重新渲染, 骨架屏消失, 编辑表单出现
          setInitialValues({
            name: response.name,
            email: response.email,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    GetData();
  }, []);

  const handleSubmit = async (values: Record<string, any>) => {
    let response;
    if (editId === undefined) {
      // 执行添加
      // 发送请求, 添加用户
      response = await addUser(values);
      console.log(response);
    } else {
      // 执行编辑
      // 发送请求, 更新用户
      response = await updateUser(editId, values);
    }
    if (response.status === undefined) {
      message.success(`${type}成功`);
      // 刷新表格数据
      actionRef.current.reload();
      // 关闭模态框
      isShowModal(false);
    }
  };

  return (
    <Modal
      title={`${type}用户`}
      open={isModalVisible}
      onCancel={() => isShowModal(false)}
      footer={null}
      destroyOnClose={true}
    >
      {
        // 只有是编辑的情况下, 并且要显示的数据还没有返回, 才显示骨架屏
        initialValues === undefined && editId !== undefined ? (
          <Skeleton active={true} paragraph={{ rows: 4 }} />
        ) : (
          <ProForm initialValues={initialValues} onFinish={(values) => handleSubmit(values)}>
            <ProFormText
              name="name"
              label="昵称"
              placeholder="请输入昵称"
              rules={[{ required: true, message: '请输入昵称' }]}
            />
            <ProFormText
              name="email"
              label="邮箱"
              placeholder="请输入邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
            />
            {
              // 只有添加有密码选项
              editId !== undefined ? (
                ''
              ) : (
                <ProFormText.Password
                  name="password"
                  label="密码"
                  placeholder="请输入密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码最小6位' },
                  ]}
                />
              )
            }
          </ProForm>
        )
      }

      <AliyunOSS
        accept="image/*"
        //   setCoverKey={setCoverKey}
        //   showUploadList={true}
      >
        <Button icon={<UploadOutlined />}>点击上传商品主图</Button>
      </AliyunOSS>
    </Modal>
  );
}

export default Index;