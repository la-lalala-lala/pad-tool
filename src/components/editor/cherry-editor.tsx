import {
    forwardRef,
    useImperativeHandle,
    // useRef, useEffect,
    useState,
    useLayoutEffect,
} from 'react';
import Editor from 'cherry-markdown';
import { CherryOptions } from 'cherry-markdown/types/cherry';
import 'cherry-markdown/dist/cherry-markdown.min.css';
import axios from "axios";
import {uploadBase64PictureApi} from "@/api/api";
export type CherryEditorType = Editor;
export interface CherryEditorProps extends Partial<CherryOptions> {
    className?: string;
    style?: React.CSSProperties;
}

const CherryEditor = forwardRef<CherryEditorType | any, CherryEditorProps>(
    ({ id = 'react-cherry-editor', className, style, ...rest }, ref) => {
        // const editorRef = useRef<Editor>();

        // useEffect(() => {
        //   editorRef.current = new Editor({
        //     id,
        //     ...rest,
        //   });

        //   return () => {
        //     editorRef.current = undefined;
        //   };
        // }, [rest, id]);

        // useImperativeHandle(ref, () => editorRef.current);

        const [editorInstance, setEditorInstance] = useState<Editor>();

        /**
         * 通用文件上传
         * @param file 文件对象
         */
        const doUploadFile = async (file:File) => {
            const {data} = await uploadPicture(file);
            let placeholder = '';
            if (/mp4|avi|rmvb/i.test(file.name)) {
                placeholder = `!video[${file.name}](${data.link})`
            } else if (/mp3/i.test(file.name)) {
                placeholder = `!audio[${file.name}](${data.link})`
            } else if (/bmp|gif|jpg|jpeg|png/i.test(file.name)) {
                placeholder = `![${file.name}](${data.link})`
            } else {
                placeholder = `![${file.name}](${data.link})`
            }
            editorInstance?.insert(placeholder)
        }



        /**
         * 向后台上传图片
         * @param file 图片文件
         */
        const uploadPicture = (file: File) => {
            let access_token = 'shmily:555651456984813568'//Storage.get(Storage.ACCESS_KEY)
            return new Promise(
                (resolve, reject) => {
                    let img = new Image();
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        console.log("onload",e)
                        img.src = e.target.result as string;
                    };
                    img.onload = function () {
                        let para = {
                            name: file.name,
                            content: img.src
                        };
                        axios({
                            method: "POST",
                            url: uploadBase64PictureApi,
                            data: para,
                            headers: {
                                "Content-Type": "application/json",
                                "access_token":access_token
                            },
                        }).then(response => {
                            const data = response.data; // 得到响应数据
                            if (data.code === 0) {
                                resolve({data: {link: data.data}})
                            } else {
                                resolve({data: {link: ''}})
                            }
                            // /files/picture/illustrated/Pandora/20190728/2019072823539.png
                        }).catch(error => {
                            reject(error)
                        })
                    }
                })
        };

        // const onloadCallback = (oEvent) => {
        //     var currentTarget = oEvent.currentTarget
        //     if (currentTarget.status !== 200) {
        //         console.error({
        //             type: 'error',
        //             message: currentTarget.status + ' ' + currentTarget.statusText
        //         })
        //     }
        //     var resp = JSON.parse(currentTarget.response)
        //     let imgMdStr = ''
        //     if (resp.code !== 200) {
        //         console.error(
        //             {
        //                 type: 'error',
        //                 message: resp.msg
        //             }
        //         )
        //     }
        //     if (resp.code === 200) {
        //         if (/mp4|avi|rmvb/i.test(resp.fileSuffix)) {
        //             imgMdStr = `!video[${resp.fileOriginName}](${process.env.VUE_APP_BASE_API + resp.fileName})`;
        //         } else if (/mp3/i.test(resp.fileSuffix)) {
        //             imgMdStr = `!audio[${resp.fileOriginName}](${process.env.VUE_APP_BASE_API + resp.fileName})`;
        //         } else if (/bmp|gif|jpg|jpeg|png/i.test(resp.fileSuffix)) {
        //             imgMdStr = `![${resp.fileOriginName}](${process.env.VUE_APP_BASE_API + resp.fileName})`
        //         } else {
        //             imgMdStr = `[${resp.fileOriginName}](${process.env.VUE_APP_BASE_API + resp.fileName})`
        //         }
        //     }
        //     //this.cherrInstance.insert(imgMdStr)
        // }

        useLayoutEffect(() => {
            setEditorInstance(
                new Editor({
                    id,
                    ...rest
                }),
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useImperativeHandle(ref, () => editorInstance, [editorInstance]);

        useImperativeHandle(ref,() => ({
            getContent,setMarkdown,doUploadFile
        }));

        const setMarkdown = (content) => {
            if (!editorInstance) { // 未加载则重新初始化
                console.error("Cherry Editor还未初始化")
                return
            }
            editorInstance?.setMarkdown(content)
        }

        const getContent = () => {
            console.log(editorInstance?.getMarkdown())
            // var result = cherryEditorRef.current!.$getMarkdown() // 获取markdown内容
            // return result
        }

        const getHtml = () => {
            console.log(editorInstance?.getHtml())
        }

        const insert = (content, isSelect = false, anchor = [], focus = true) => {
            editorInstance?.insert(content, isSelect, anchor, focus)
        }


        return <div id={id} className={className} style={style} />;
    },
);

CherryEditor.displayName = 'CherryEditor';

export default CherryEditor;
