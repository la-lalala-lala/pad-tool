// 码表转换

// 用户状态映射转换
export const userStatus = (status:number) : string => {
    if (1 == status){
        return '正常'
    }else {
        return '冻结'
    }
}