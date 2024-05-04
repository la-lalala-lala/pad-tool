import dayjs from 'dayjs';

export const formatDate_zh_CN = (date:string) => {
    if (!date){
        return '-'
    }
    return dayjs(date).format('YYYY年MM月DD日 HH时mm分ss秒')
}