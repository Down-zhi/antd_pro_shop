import { addCategory, getcategory } from '@/services/ant-design-pro/category';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Cascader, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
interface Props {
  isModalVisible: any;
  isShowModal: any;
  actionRef: any;
  editId: any;
}

function Index(props: Props) {
  const [initialValues, setInitialValues] = useState<any>(undefined);
  const [options, setOptions] = useState<any>([]);

  const { isModalVisible } = props; // 模态框是否显示
  const { isShowModal } = props; // 操作模态框显示隐藏的方法
  const { actionRef } = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const { editId } = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有

  // 添加 或者 编辑 的描述文字
  const type = editId === undefined ? '添加' : '编辑';
  //   function removeChildren(obj:any) {
  //     if (Array.isArray(obj)) {
  //         obj.forEach(subObj => removeChildren(subObj));
  //     } else if (typeof obj === 'object' && obj !== null) {
  //         if ('children' in obj) {
  //             obj.children = []; // 或者 obj.children = null;
  //         }
  //         Object.values(obj).forEach(value => removeChildren(value));
  //     }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let resCategory = await getcategory();
        resCategory = resCategory.map((item: any) => ({ ...item, children: [] })); //将数组中每个对象的children数组设置为空
        // const  level1Items = resCategory.filter((item: { level: number; }) => item.);    //只要第一层的在第二层创建新的  ,但是还有一层children
        console.log(resCategory);
        setInitialValues(resCategory);
        if (resCategory.status === undefined) setOptions(resCategory); //通过查询返回的name设置添加分类的父级选择 ,不用选返回值的某个属性全传
      } catch (error) {
        message.error(error as string);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (values: Record<string, any>) => {
    if (editId === undefined) {
      // 执行添加
      const response = await addCategory(values);
      if (response.status === undefined) {
        message.success(`${type}成功`);
        actionRef.current.reload();
        isShowModal(false);
      }
    }
  };
  return (
    <Modal
      title={`${type}分类`}
      open={isModalVisible}
      onCancel={() => isShowModal(false)}
      footer={null}
      destroyOnClose={true}
    >
      <ProForm initialValues={initialValues} onFinish={(values) => handleSubmit(values)}>
        <ProFormSelect name={{ label: 'name', value: 'id' }} label="分级分类" options={options} />
        {/* 
                  <ProForm.Item noStyle shouldUpdate>
        {(form) => {
          return (
            <ProFormSelect
            options={options}
              width="md"
              name="useMode"
              label={`与《${form.getFieldValue('name')}》`}
            />
          );
        }}
      </ProForm.Item> */}

        <ProForm.Item
          name="level" //有name表格验证才生效
          label="添加分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Cascader
            fieldNames={{ label: 'name', value: 'level' }} //有错 添加的不能添加在某个下面只能是重新的分类   如果修改也不知道怎么修改了
            // 自定义字段
            options={options}
            placeholder="请选择分类"
          />
        </ProForm.Item>
        <ProFormText
          name="name"
          label="分类名称"
          placeholder="请输入分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        />
      </ProForm>
    </Modal>
  );
}

export default Index;
