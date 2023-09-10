import {useState,useEffect} from "react";
import "./index.less"
import { CherryEditor } from '@/component/editor';
import * as echarts from 'echarts';
import MathJax from 'mathjax/es5/tex-svg';
import Cherry from "cherry-markdown";

/**
 * 自定义一个语法
 */
const CustomHookA = Cherry.createSyntaxHook('codeBlock', Cherry.constants.HOOKS_TYPE_LIST.PAR, {
    makeHtml(str:string) {
        console.warn('custom hook', 'hello');
        return str;
    },
    rule(str:string) {
        const regex = {
            begin: '',
            content: '',
            end: '',
            reg: {},
        };
        regex.reg = new RegExp(regex.begin + regex.content + regex.end, 'g');
        return regex;
    },
});

/**
 * 自定义一个自定义菜单
 * 点第一次时，把选中的文字变成同时加粗和斜体
 * 保持光标选区不变，点第二次时，把加粗斜体的文字变成普通文本
 */
const customMenuA = Cherry.createMenuHook('加粗斜体',  {
    iconName: 'font',
    onClick: function(selection: any) {
        // 获取用户选中的文字，调用getSelection方法后，如果用户没有选中任何文字，会尝试获取光标所在位置的单词或句子
        let $selection = this.getSelection(selection) || '同时加粗斜体';
        // 如果是单选，并且选中内容的开始结束内没有加粗语法，则扩大选中范围
        if (!this.isSelections && !/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
            this.getMoreSelection('***', '***', () => {
                const newSelection = this.editor.editor.getSelection();
                const isBoldItalic = /^\s*(\*\*\*)[\s\S]+(\1)/.test(newSelection);
                if (isBoldItalic) {
                    $selection = newSelection;
                }
                return isBoldItalic;
            });
        }
        // 如果选中的文本中已经有加粗语法了，则去掉加粗语法
        if (/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
            return $selection.replace(/(^)(\s*)(\*\*\*)([^\n]+)(\3)(\s*)($)/gm, '$1$4$7');
        }
        /**
         * 注册缩小选区的规则
         *    注册后，插入“***TEXT***”，选中状态会变成“***【TEXT】***”
         *    如果不注册，插入后效果为：“【***TEXT***】”
         */
        this.registerAfterClickCb(() => {
            this.setLessSelection('***', '***');
        });
        return $selection.replace(/(^)([^\n]+)($)/gm, '$1***$2***$3');
    }
});

/**
 * 定义一个空壳，用于自行规划cherry已有工具栏的层级结构
 */
const customMenuB = Cherry.createMenuHook('实验室',  {
    iconName: '',
});

const Editor = () => {

    /**
     * 文件伤传
     * @param file 文件对象
     */
    const uploadFile = (file:File) => {
      console.log(file);
    }

    // @ts-ignore
    return (
        <div className='login-page'>
            {/*<div data-tauri-drag-region className='window-title'>*/}
            {/*    <a className='light red'/>*/}
            {/*    <a className='light yellow'/>*/}
            {/*    <a className='light green'/>*/}
            {/*</div>*/}
            <CherryEditor
                engine={{
                    global: {
                        urlProcessor(url: string, srcType: 'image' | 'audio' | 'video' | 'autolink' | 'link') {
                            console.log(`url-processor`, url, srcType);
                            return url;
                        },
                    },
                    syntax: {
                        // codeBlock: {
                        //     theme: 'twilight',
                        // },
                        list: {
                            listNested: false, // 同级列表类型转换后变为子级
                            indentSpace: 2, // 默认2个空格缩进
                        },
                        table: {
                            enableChart: false,
                            // chartRenderEngine: EChartsTableEngine,
                            // externals: ['echarts'],
                        },
                        // inlineCode: {
                        //     theme: 'default',
                        // },
                        fontEmphasis: {
                            allowWhitespace: false, // 是否允许首尾空格
                        },
                        strikethrough: {
                            needWhitespace: false, // 是否必须有前后空格
                        },
                        mathBlock: {
                            engine: 'MathJax', // katex或MathJax
                            src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js', // 如果使用MathJax plugins，则需要使用该url通过script标签引入
                        },
                        inlineMath: {
                            engine: 'MathJax', // katex或MathJax
                        },
                        emoji: {
                            useUnicode: false,
                            customResourceURL: 'https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8',
                            upperCase: true,
                        },
                        toc: {
                            /** 默认只渲染一个目录 */
                            allowMultiToc: false,
                        },
                        header: {
                            /**
                             * 标题的样式：
                             *  - default       默认样式，标题前面有锚点
                             *  - autonumber    标题前面有自增序号锚点
                             *  - none          标题没有锚点
                             */
                            anchorStyle: 'default',
                        }
                    },
                    customSyntax:{
                        CustomHook: {
                            syntaxClass: CustomHookA,
                            force: false,
                            after: 'br',
                        },
                    }
                }}
                externals={{
                    echarts,
                    MathJax,
                }}
                toolbars={{
                    theme: 'light',
                    sidebar: ['mobilePreview', 'copy'],
                    bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', 'ruby', '|', 'size', 'color'], // array or false
                    toolbar: [
                        'bold',
                        'italic',
                        {
                            strikethrough: ['strikethrough', 'underline', 'sub', 'sup', 'ruby', 'customMenuAName'],
                        },
                        'size',
                        '|',
                        'color',
                        'header',
                        '|',
                        'toc',
                        'ol',
                        'ul',
                        'checklist',
                        'detail',
                        'code',
                        '|',
                        'formula',
                        {
                            insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'pdf', 'word', 'ruby'],
                        },
                        'graph',
                        //'|',
                        //'drawIo',
                        '|',
                        'ruby',
                        'panel',
                        'togglePreview',
                        //'settings',
                        'switchModel',
                        'codeTheme',
                        'export',
                        {
                            customMenuBName: ['ruby', 'audio', 'video', 'customMenuAName'],
                        },
                        'theme'
                    ],
                    float: ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code'], // array or false
                    customMenu: {
                        customMenuAName: customMenuA,
                        customMenuBName: customMenuB
                    },
                }}
                fileUpload={(file:File)=>uploadFile(file)}
                editor={{
                    codemirror: {
                        // depend on codemirror theme name: https://codemirror.net/demo/theme.html
                        // 自行导入主题文件: `import 'codemirror/theme/<theme-name>.css';`
                        theme: 'default',
                    },
                    // 编辑器的高度，默认100%，如果挂载点存在内联设置的height则以内联样式为主
                    height: '100%',
                    // defaultModel 编辑器初始化后的默认模式，一共有三种模式：1、双栏编辑预览模式；2、纯编辑模式；3、预览模式
                    // edit&preview: 双栏编辑预览模式
                    // editOnly: 纯编辑模式（没有预览，可通过toolbar切换成双栏或预览模式）
                    // previewOnly: 预览模式（没有编辑框，toolbar只显示“返回编辑”按钮，可通过toolbar切换成编辑模式）
                    defaultModel: 'edit&preview',
                    // 粘贴时是否自动将html转成markdown
                    convertWhenPaste: true,
                }}
                // 是否开启仅预览模式
                isPreviewOnly={false}
                // 预览区域跟随编辑器光标自动滚动
                autoScrollByCursor={ true}
                // 外层容器不存在时，是否强制输出到body上
                forceAppend={ true}
                value={"2324"}
            />
        </div>
    )
}

export default Editor
