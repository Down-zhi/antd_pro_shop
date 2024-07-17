import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; //主题

type SetDetails = (a: any) => {
  return: any;
};
interface Props {
  setDetails: SetDetails;
  content: any; //感觉是根据要接受什么才定义什么，原本并不知道有哪些数据会用到
}
const Editor = ({ setDetails, content }: Props) => {
  const [value, setValue] = useState(content); //从数据中取得detail值放到富文本框
  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
    ['clean'], // remove formatting button
  ];
  // 自定义工具栏
  const modules = {
    toolbar: toolbarOptions,
  };

  // 剩下参数 delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor
  const handleChangeValue = (value: any) => {
    //不能直接操作value 必须用set函数 所以不能用value的getHtml 等方法还是没有我也不知道
    //使用正则表达式移除所有HTML标签  ,还是不行这样有图片还是解决不了
    //当为富文本为空时有<p><br></p>  ，用正则判断移除后是否是空
    if (value.replace(/<p[^>]*>|<\/p>|<br\s*\/?>/gi, '').trim() === '') {
      setDetails('');
    } else {
      setDetails(value); //就去掉标签的值把
    }
    setValue(value);
  };
  //调用父组件方法，将内容传过去
  return (
    <div className="react-quill-wrap">
      <div className="quill-editor-wrap">
        <ReactQuill
          modules={modules}
          theme="snow"
          value={value}
          onChange={handleChangeValue}
          // defaultValue={value}
          placeholder="请输入内容"
        />
      </div>
    </div>
  );
};

export default Editor;
