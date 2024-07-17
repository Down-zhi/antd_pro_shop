import { OssConfig } from '@/services/ant-design-pro/common';
import type { UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

//变成一个通用的OSS上传文件的组件
// interface OSSDataType {
//   dir: string;
//   expire: string;
//   host: string;
//   accessId: string;
//   policy: string;
//   signature: string;
// }

interface AliyunOSSUploadProps {
  value?: UploadFile[];
  onChange?: (file: any) => void;
  accept?: any; //确定上传类型 作为参数如果别的组件用到可以传别的
  children?: React.ReactNode; // 添加children属性,可以适用不同的子组件按钮
  setCoverKey: any;
  insertImage?: any;
  showUploadList: boolean;
}
const AliyunOSS = ({
  value,
  accept,
  children,
  setCoverKey,
  insertImage,
  showUploadList,
}: AliyunOSSUploadProps) => {
  const [OSSData, setOSSData] = useState<any>();
  //初始化获取 oss 上传签名
  const init = async () => {
    try {
      const response = await OssConfig();
      setOSSData(response);
      //setState方法更新状态并不会立即改变状态的值，在重渲染过程中更新状态
    } catch (error) {
      message.error(error as string);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // 文件上传过程中触发的回调函数  ?. 操作符是可选链操作符,如果是null或undefined就不执行
  const handleChange: UploadProps['onChange'] = ({ file }) => {
    console.log('Aliyun OSS:', file);
    // 上传成功之后, 把文件的key, 设置为表单某个字段的值
    if (setCoverKey) setCoverKey(file.key);

    // 上传完成之后, 如果需要url, 那么返回url给父组件
    if (insertImage) insertImage(file.url);
    // onChange?.([...file]); //将更新后的文件列表上传
  };
  // 移除文件触发的事件
  const onRemove = () => {
    message.error('请重新上传一张图片');
  };

  //获取额外的上传参数   data属性是用来向服务器发送额外的查询参数或表单数据的。
  const getExtraData: UploadProps['data'] = (file) => ({
    key: file.key, // 如果文件URL不存在，generateUniqueKey(),可以生成一个唯一键
    OSSAccessKeyId: OSSData?.accessid, //接口定义的小写
    policy: OSSData?.policy,
    Signature: OSSData?.signature,
  });

  //上传前处理 ，要求图片不能超过多少等等....
  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) {
      return false;
    }
    const expire = Number(OSSData.expire) * 1000;
    // 如果签名过期了, 重新获取
    if (expire < Date.now()) {
      await init();
    }
    const dir = 'react/'; // 定义上传的目录
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    // @ts-ignore
    file.key = OSSData.dir + dir + filename; // 在 getExtraData 函数中会用到, 在云存储中存储的文件的 key
    file.url = OSSData.host + OSSData.dir + dir + filename; // 上传完成后, 用于显示内容
    return file;
  };

  const uploadProps: UploadProps = {
    //上传的参数
    accept: accept || '',
    name: 'file',
    fileList: value,
    action: OSSData?.host,
    onChange: handleChange,
    onRemove,
    data: getExtraData,
    beforeUpload: beforeUpload,
    listType: 'picture', //上传后文件的展示情况
    maxCount: 1, //设置图片为1
    // progress:'line
    showUploadList,
  };

  return (
    <Upload {...uploadProps}>
      {/* {uploadProps.children} 要接受自己传组件作为子组件 */}
      {/* <Button icon={<UploadOutlined />}>点击上传商品主图</Button>
       */}
      {children}
    </Upload>
  );
};

export default AliyunOSS;
