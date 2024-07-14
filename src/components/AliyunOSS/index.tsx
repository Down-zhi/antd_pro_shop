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
  onChange?: (fileList: UploadFile[]) => void;
  accept?: any; //确定上传类型 作为参数如果别的组件用到可以传别的
  children?: React.ReactNode; // 添加children属性,可以适用不同的子组件按钮
}
//既能够接收子组件，又能够接收特定的属性,  写不好
// interface UploadWrapperProps extends  UploadProps{
//     children?: React.ReactNode; // 允许组件接收任意子节点
// }
const AliyunOSS = ({ value, onChange, accept, children }: AliyunOSSUploadProps) => {
  const [OSSData, setOSSData] = useState<any>();
  //初始化获取 oss 上传签名
  const init = async () => {
    try {
      const response = await OssConfig();
      setOSSData(response);
    } catch (error) {
      message.error(error as string);
    }
  };

  useEffect(() => {
    init();
  }, []);
  // 文件上传过程中触发的回调函数  ?. 操作符是可选链操作符,如果是null或undefined就不执行
  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    console.log('Aliyun OSS:', fileList);
    // console.log('file:', file);
    onChange?.([...fileList]); //将更新后的文件列表上传
  };
  //移除文件触发的事件
  //   const onRemove = (file: UploadFile) => {
  //     const files = (value || []).filter((v) => v.url !== file.url);
  //     if (onChange) {
  //       onChange(files);
  //     }
  //   };

  //获取额外的上传参数   data属性是用来向服务器发送额外的查询参数或表单数据的。
  const getExtraData: UploadProps['data'] = (file) => ({
    key: file.url, // 如果文件URL不存在，generateUniqueKey(),可以生成一个唯一键
    OSSAccessKeyId: OSSData?.accessid, //接口定义的小写
    policy: OSSData?.policy,
    Signature: OSSData?.signature,
  });

  //上传前处理 ，要求图片不能超过多少等等....
  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) return false;

    const expire = Number(OSSData.expire) * 1000;
    // 如果签名过期了, 重新获取
    if (expire < Date.now()) {
      await init();
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    // @ts-ignore
    file.url = OSSData.host + OSSData.dir + filename;
    return file;
  };

  const uploadProps: UploadProps = {
    //上传的参数
    accept: accept || '',
    name: 'file',
    fileList: value,
    action: OSSData?.host,
    onChange: handleChange,
    // onRemove,
    data: getExtraData,
    beforeUpload,
    listType: 'picture', //上传后文件的展示情况
    maxCount: 1, //设置图片为1
    // progress:'line
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
