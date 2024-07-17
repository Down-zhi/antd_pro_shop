import AliyunOSS from '@/components/AliyunOSS';
import Editor from '@/components/Editor';
import { getcategory } from '@/services/ant-design-pro/category';
import { addGoods, showGoods, updateGoods } from '@/services/ant-design-pro/goodsapi';
import { UploadOutlined } from '@ant-design/icons';
import { ProForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Cascader, Image, message, Modal, Skeleton } from 'antd';
import { useEffect, useState } from 'react';

const AddGoods = (props: any) => {
  // 将表单初始化的值设置成状态, 在编辑的时候, 使用这个状态
  const [initialValues, setInitialValues] = useState<any>(undefined);
  const [options, setOptions] = useState<any>([]);

  // 定义Form实例, 用来操作表单
  const [formObj] = ProForm.useForm();
  // 设置表单的值
  // formObj.setFieldsValue({fieldName:value})

  const { isModalVisible } = props; // 模态框是否显示
  const { isShowModal } = props; // 操作模态框显示隐藏的方法
  const { actionRef } = props; // 父组件传过来的表格的引用, 可以用来操作表格, 比如刷新表格
  const { editId } = props; // 要编辑的ID, 添加的时候是undefined, 只有编辑才有
  const type = editId === undefined ? '添加' : '编辑';
  useEffect(() => {
    // 查询分类数据
    const fetchData = async () => {
      try {
        const resCategory = await getcategory();
        if (resCategory.status === undefined) setOptions(resCategory); //在获取数据后想在组件中使用这个值就用useState设置状态
        console.log(options);

        // 发送请求, 获取商品详情
        if (editId !== undefined) {
          const response = await showGoods(editId);
          // 通过id修改商品详情
          //妈的气死l category不返回 要在请求时额外请求，但是额外请求一个还不行，请求两个才返回什么意思？为什么要加,才返回
          const { pid, id } = response.category; //id是第一层 ，pid子集
          const defaultCategory = [pid, id];

          setInitialValues({ ...response, category_id: defaultCategory });
        }
      } catch (error) {
        message.error(error as string);
      }
    };
    fetchData();
  }, []);

  //   文件上传成功后, 设置cover字段的value
  const setCoverKey = (fileKey: any) => formObj.setFieldsValue({ cover: fileKey });

  //  编辑输入内容后, 设置details字段的value
  const setDetails = (content: any) => formObj.setFieldsValue({ details: content });

  const handleSubmit = async (values: { category_id: any[] }) => {
    let response;
    console.log('editid' + editId);

    if (editId === undefined) {
      // 执行添加
      response = await addGoods({ ...values, category_id: values.category_id[1] });
    } else {
      // 发送请求, 更新商品
      response = await updateGoods(editId, { ...values, category_id: values.category_id[1] });
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
      title={`${type}商品`}
      open={isModalVisible}
      onCancel={() => isShowModal(false)}
      footer={null}
      width={800}
      destroyOnClose={true}
    >
      {
        // 只有是编辑的情况下, 并且要显示的数据还没有返回,
        initialValues === undefined && editId !== undefined ? (
          <Skeleton active={true} paragraph={{ rows: 4 }} />
        ) : (
          <ProForm
            form={formObj}
            initialValues={initialValues}
            onFinish={(values) => handleSubmit(values)}
          >
            <ProForm.Item
              name="category_id" //有name表格验证才生效
              label="分类"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Cascader
                fieldNames={{ label: 'name', value: 'id' }}
                // 自定义字段
                options={options}
                placeholder="请选择分类"
              />
            </ProForm.Item>

            <ProFormText
              name="title"
              label="商品名"
              placeholder="请输入商品名"
              rules={[{ required: true, message: '请输入商品名' }]}
            />

            <ProFormTextArea
              name="description"
              label="描述"
              placeholder="请输入描述"
              rules={[{ required: true, message: '请输入描述' }]}
            />

            <ProFormDigit
              name="price"
              label="价格"
              placeholder="请输入价格"
              min={0}
              max={9999}
              rules={[{ required: true, message: '请输入价格' }]}
            />

            <ProFormDigit
              name="stock"
              label="库存"
              placeholder="请输入库存"
              min={0}
              max={9999}
              rules={[{ required: true, message: '请输入库存' }]}
            />

            <ProFormText name="cover" hidden={true} />

            <ProForm.Item
              name="cover"
              label="商品主图"
              rules={[{ required: true, message: '请上传商品主图' }]}
            >
              <div>
                <AliyunOSS
                  accept="image/*"
                  setCoverKey={setCoverKey} //   setCoverKey={setCoverKey}
                  showUploadList={true}
                >
                  <Button icon={<UploadOutlined />}>点击上传商品主图</Button>
                </AliyunOSS>

                {initialValues === undefined || !initialValues.cover_url ? (
                  ''
                ) : (
                  <Image width={200} src={initialValues.cover_url} />
                )}
              </div>
            </ProForm.Item>

            <ProForm.Item
              name="details"
              label="商品详情"
              rules={[{ required: true, message: '请输入详情' }]}
            >
              <div>
                <Editor setDetails={setDetails} content={initialValues?.details} />
              </div>
            </ProForm.Item>
          </ProForm>
        )
      }
    </Modal>
  );
};

export default AddGoods;
