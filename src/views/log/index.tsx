import  React,{useEffect,useState} from 'react';
import {Col, Form, Button, Table, DatePicker, Select} from 'antd';
import './index.less'
import type { TableProps } from 'antd';
import {Log} from "@/types/log"
import {SearchOutlined,ReloadOutlined,FileExcelOutlined} from '@ant-design/icons';
import {disabledDate, extractUserName} from "@/utils/var"
import {formatDateTime_zh_CN} from "@/utils/date";
import {openNotificationWithIcon} from "@/utils/window";
import {logPageApi, logTypeListApi, downloadLogExcelApi} from "@/api/modules/log";
import {useSelector} from "react-redux";
import {State} from "@/types/redux";
import dayjs from 'dayjs';
import axios from 'axios'
import {ResultData} from "@/types/api";
import {LogType} from "@/types/log_type";

const {RangePicker} = DatePicker;
const {Option} = Select;
const LogView = () => {

    const [grid,setGrid] = useState([])
    const [pagination,setPagination] = useState<Log.ResPageLog>({page_no:1,page_size:10,total_row:0})
    const [filters,setFilters] = useState<Log.ReqLogForm>({begin_time: null,end_time: null,category: null})
    const [type,setType] = useState([])
    const [loading,setLoading] = useState(false)
    const {user,token} = useSelector((state:State) => state.global)


    useEffect(()=>{
        getTypeData()
        getData(filters,pagination)
    },[])

    /**
     * 获取日志类别
     * @returns {Promise<void>}
     */
    const getTypeData = async () => {
        try {
            // 发异步ajax请求, 获取数据
            const result:ResultData<Array<LogType.ResLogType>> = await logTypeListApi();
            const {msg, code, data} = result;
            if (code == 0) {
                // 利用更新状态的回调函数，渲染下拉选框
                let type = [];
                type.push((<Option key={-1} value="">请选择</Option>));
                data?.forEach(item => {
                    type.push((<Option key={item.category} value={item.category}>{item.detail}</Option>));
                });
                setType(type)
            } else {
                openNotificationWithIcon("error", "错误提示", msg);
            }
        }catch (e) {
            console.error('获取日志数据异常:',e)
            openNotificationWithIcon("error","错误提示", '获取日志数据异常，请稍后再试')
        }finally {
            setLoading(false);
        }
    };

    const columns:TableProps<Log.ResLog>['columns']= [
        {
            title: '编号',
            dataIndex: 'id', // 显示数据对应的属性名
            align:'right',
        },
        {
            title: '用户',
            dataIndex: 'user', // 显示数据对应的属性名
            align:'left',
        },
        {
            title: '操作详情',
            dataIndex: 'detail', // 显示数据对应的属性名
        },
        {
            title: 'IP',
            dataIndex: 'ip', // 显示数据对应的属性名
            align:'left',
        },
        {
            title: '城市',
            dataIndex: 'city', // 显示数据对应的属性名
        },
        {
            title: '日期',
            dataIndex: 'date', // 显示数据对应的属性名
            align:'left',
            render:(value)=> (formatDateTime_zh_CN(value,1))
        }
    ]

    /**
     * 获取日志数据
     * @returns {Promise<void>}
     */
    const getData = async (_filters = filters,_pagination= pagination) => {
        let para = {
            page_no: _pagination.page_no,
            page_size: _pagination.page_size,
            category: _filters.category,
            begin_time: _filters.begin_time,
            end_time: _filters.end_time,
        };
        try {
            setLoading(true)
            // 发异步ajax请求, 获取数据
            const result:ResultData<Log.ResPageLog> = await logPageApi(para);
            const {code,msg,data} = result;
            if (code == 0) {
                setGrid(data?.records);
                setPagination({..._pagination,total_row: data?.total_row})
            } else {
                openNotificationWithIcon("error", "错误提示", msg);
            }
        }catch (e) {
            console.error('获取日志数据异常:',e)
            openNotificationWithIcon("error","错误提示", '获取日志数据异常，请稍后再试')
        }finally {
            setLoading(false);
        }
    };

    /**
     * 重置查询条件
     */
    const reloadPage = () => {
        const _filters = {begin_time: null,end_time: null,category: null}
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
     * 日志选框发生改变
     * @param value
     */
    const onChangeType = (value) => {
        const _filters = {...filters,category:value}
        setFilters(_filters)
        const _pagination = {...pagination,page_no:1}
        setPagination(_pagination)
        getData(_filters,_pagination)
    };

    /**
     * 导出Excel
     */
    const exportExcel = () => {
        // 在发请求前, 显示loading
        setLoading(true);
        let access_token =token
        let para = {
            type: filters.category,
            begin_time: filters.begin_time,
            end_time: filters.end_time,
        };
        let fileName = '操作日志报表.xlsx';
        axios({
            method: "GET",
            url: downloadLogExcelApi,   //接口地址
            params: para,           //接口参数
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json",
                "access_token":access_token
            },
        }).then( async (res) => {
            setLoading(false);
            let blob = new Blob([res.data], {type: 'application/x-xlsx'});   //word文档为msword,pdf文档为pdf，excel文档为x-xls
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }

        }).catch((res) =>{
            setLoading(false);
            console.log(res)
            openNotificationWithIcon("error", "错误提示", "导出日志报表失败");
        });
    };


    return (
        <div className='log-page'>
            <Col span={24} className="tool-bar">
                <Form layout="inline">
                    <Form.Item label="操作类别:">
                        <Select value={filters.category} style={{width:'10em'}} showSearch onChange={onChangeType}
                                placeholder="请选择">
                            {type}
                        </Select>
                    </Form.Item>
                    <Form.Item label="操作时间:">
                        <RangePicker value={(filters.begin_time !== null && filters.end_time !== null)?[dayjs(filters.begin_time),dayjs(filters.end_time)]:[null,null]} disabledDate={disabledDate} onChange={onChangeDate}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={(e) => getData()}>
                            <SearchOutlined/>查询
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={reloadPage}>
                            <ReloadOutlined/>重置
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={exportExcel}>
                            <FileExcelOutlined/>导出
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24} className="data-table">
                <Table size="middle" rowKey="id"  loading={loading} columns={columns} dataSource={grid}
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

export default LogView