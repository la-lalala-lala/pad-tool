import React, {Component, useEffect, useRef, useState} from 'react';
import {Button, Col, Table, DatePicker, Input, Form, Modal, Tag} from "antd";
import {deleteNewsApi, newsPageApi} from "@/api/modules/news";
import {openNotificationWithIcon} from "@/utils/window";
import dayjs from 'dayjs';
import {DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {disabledDate, extractUserName} from "@/utils/var";
import {formatDateTime_zh_CN} from "@/utils/date";
import type { TableProps } from 'antd';
import {News} from "@/types/news";
import {ResultData} from "@/types/api";
import EditNewsView from "./edit";
const {RangePicker} = DatePicker;
const NewsView = (props) => {

    const editRef = useRef();
    const {openDrawer} = props;
    //const editNewsView = ;

    const [grid,setGrid] = useState([])
    const [pagination,setPagination] = useState<News.ResPageNews>({page_no:1,page_size:10,data_total:0})
    const [filters,setFilters] = useState<News.ReqNewsForm>({topic:null,begin_time: null,end_time: null})
    const [loading,setLoading] = useState(false)
    const tagColor = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

    useEffect(()=>{
        getData()
    },[])

    /**
     * 初始化Table所有列的数组
     */
    const columns:TableProps<News.ResNews> = [
        {
            title: '作者',
            dataIndex: 'source', // 显示数据对应的属性名
            //render:(value,row) => (extractUserName(organize, row.source))
        },
        {
            title: '标题',
            dataIndex: 'topic', // 显示数据对应的属性名
        },
        {
            title: '标签',
            render: (value, row) => {
                const tags = row.label === null ? [] : (row.label).split(';')
                if (tags.length > 0) {
                    return tags.map(forTagMap)
                } else {
                    return ''
                }
            },
        },
        {
            title: '创建时间',
            dataIndex: 'create_time', // 显示数据对应的属性名
            render:(value)=> (formatDateTime_zh_CN(value,2))
        },
        {
            title: '修改时间',
            dataIndex: 'update_time', // 显示数据对应的属性名
            render:(value)=> (formatDateTime_zh_CN(value,2))
        },
        {
            title: '管理',
            render: (text, record) => (
                <div>
                    <Button type="primary" size="small" onClick={() => handleModalOpen(record.id)} shape="circle" icon={<EditOutlined/>}/>
                    &nbsp;
                    <Button type="primary" danger="true" size="small" onClick={() => handleDellNews(record)}  shape="circle" icon={<DeleteOutlined/>}/>
                </div>
            ),
        },
    ]

    /**
     * 生成tag标签
     * @param tag
     * @returns {JSX.Element}
     */
    const forTagMap = tag => {
        const tagElem = (
            <Tag color={tagColor[Math.floor(Math.random() * 10)]}>
                {tag}
            </Tag>
        );
        return (<span key={tag} style={{display: 'inline-block'}}>{tagElem}</span>);
    };

    /**
     * 获取动态列表数据
     * @returns {Promise<void>}
     */
    const getData = async (_filters = filters,_pagination= pagination) => {
        let para = {
            topic: _filters.topic,
            page_no: _pagination.page_no,
            page_size: _pagination.page_size,
            begin_time: _filters.begin_time,
            end_time: _filters.end_time
        };
        try {
            setLoading(true);
            const result:ResultData<News.ResPageNews> = await newsPageApi(para);
            const {msg, code, data} = result;
            if (code == 0) {
                setGrid(data?.records);
                setPagination({..._pagination,total_row: data?.total_row})
            } else {
                openNotificationWithIcon("error", "错误提示", msg);
            }
        }catch (e) {
            console.error('获取动态数据异常:',e)
            openNotificationWithIcon("error","错误提示", '获取动态数据异常，请稍后再试')
        }finally {
            setLoading(false);
        }
    };

    /**
     * 删除指定动态
     * @param item
     */
    const handleDellNews = (item) => {
        Modal.confirm({
            title: '删除确认',
            content: `确认删除主题为:${item.topic}的动态吗?`,
            onOk: async () => {
                try {
                    setLoading(true);
                    const {msg, code} = await deleteNewsApi(item.id);
                    if (code === 0) {
                        openNotificationWithIcon("success", "操作结果", "删除成功");
                        getData();
                    } else {
                        openNotificationWithIcon("error", "错误提示", msg);
                    }
                }catch (e) {
                    console.error('删除动态异常:',e)
                    openNotificationWithIcon("error","错误提示", '删除动态异常，请稍后再试')
                }finally {
                    setLoading(false);
                }
            }
        })
    };

    /**
     * 重置查询条件
     */
    const reloadPage = () => {
        const _filters = {begin_time: null,end_time: null,topic: null}
        setFilters(_filters);
        const _pagination = {...pagination,page_no:1}
        setPagination(_pagination)
        getData(_filters,_pagination)
    };

    /**
     * 回调函数,改变页宽大小
     * @param page_size
     * @param current
     */
    const changePageSize = (page_size, current) => {
        const _pagination = {...pagination,page_no:1,page_size:page_size}
        setPagination(pagination)
        getData(filters,_pagination)
    };

    /**
     * 回调函数，页面发生跳转
     * @param current
     */
    const changePage = (current) => {
        const _pagination = {...pagination,page_no:current}
        setPagination(_pagination)
        getData(filters,_pagination)
    };

    /**
     * 日期选择发生变化
     * @param date
     * @param dateString
     */
    const onChangeDate = (date, dateString) => {
        let _filters = {...filters}
        // 为空要单独判断
        if (dateString[0] !== '' && dateString[1] !== ''){
            _filters.begin_time = dateString[0];
            _filters.end_time = dateString[1];
        }else{
            _filters.begin_time = null;
            _filters.end_time = null;
        }
        setFilters(_filters)
        const _pagination = {...pagination,page_no:1}
        setPagination(_pagination)
        getData(_filters,_pagination)
    };


    /**
     * 双向绑定用户查询主题
     * @param event
     */
    const topicInputChange = (event) => {
        const value = event.target.value;
        const _filters = {...filters,topic:value}
        setFilters(_filters)
        const _pagination = {...pagination,page_no:1}
        setPagination(_pagination)
        getData(_filters,_pagination)
    };

    /**
     * 显示添加的弹窗
     */
    const handleModalOpen = (val:any) => {
        //editRef.current.handleDisplay("val");
        openDrawer(<EditNewsView ref={editRef} refreshPage={getData}/>);
        editRef.current.handleDisplay("val");
    };

    return (
        <div className='home-page'>
            <Col span={24} className="tool-bar">
                <Form layout="inline">
                    <Form.Item label="主题:">
                        <Input type='text' value={filters.topic} allowClear={true} onChange={topicInputChange}
                               placeholder='按主题检索'/>
                    </Form.Item>
                    <Form.Item label="发布时间:">
                        <RangePicker value={(filters.begin_time !== null && filters.end_time !== null)?[dayjs(filters.begin_time),dayjs(filters.end_time)]:[null,null]} disabledDate={disabledDate} onChange={onChangeDate}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={getData}>
                            <SearchOutlined/>查询
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={reloadPage}>
                            <ReloadOutlined/>重置
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={() => handleModalOpen(null)}>
                            <PlusOutlined/>发布
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24} className="data-table">
                <Table size="small" rowKey="id" bordered loading={loading} columns={columns} dataSource={grid}
                       pagination={{
                           current:pagination.page_no,
                           showTotal: () => `当前第${pagination.page_no}页 共${pagination.total_row}条`,
                           pageSize: pagination.page_size, showQuickJumper: true, total: pagination.total_row, showSizeChanger: true,
                           onShowSizeChange: (current, page_size) => changePageSize(page_size, current),
                           onChange: changePage,
                       }}/>
            </Col>
        </div>
    )
}

export default NewsView