import { Changepassword } from '@/services/ant-design-pro/login';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Drawer, message } from 'antd';

interface Props {
  isModalVisible: any;
  isShowModal: any;
}

function Index(props: Props) {
  // const [initialValues, setInitialValues] = useState<any>(undefined);
  const { isModalVisible } = props; // 模态框是否显示
  const { isShowModal } = props;
  const { initialState } = useModel('@@initialState');
  //修改密码
  const Updatepw = async (values: any) => {
    try {
      const response = await Changepassword(values);
      if (response.status_code === 204) {
        message.success('密码已成功修改');
        // form.resetFields();
      } else {
        message.error('修改密码失败，请检查你的输入');
      }
    } catch (error) {
      console.error(error);
      message.error('不能操作系统数据');
    }
    isShowModal(false);
  };

  return (
    <Drawer
      title="修改密码"
      keyboard
      open={isModalVisible}
      // onOpenChange={() => isShowModal(true)}
      // autoFocusFirstInput
      // onClose={() => isShowModal(false)}
      // onFinish={() => Updatepw()}
      width="400px"
      // drawerProps={{
      //   destroyOnClose: true,
      // }}
    >
      <ProForm initialValues={initialState} onFinish={(values) => Updatepw(values)}>
        <ProFormText.Password
          name="old_password"
          label="旧密码"
          placeholder="请输入旧密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码最小6位' },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="新密码"
          placeholder="请输入新密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码最小6位' },
          ]}
        />
        <ProFormText.Password
          name="password_confirmation"
          label="请确认密码"
          dependencies={['password']}
          placeholder="确认密码"
          rules={[
            { required: true, message: '请确认密码' },
            { min: 6, message: '密码最小6位' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        />
      </ProForm>
    </Drawer>
  );
}

export default Index;
