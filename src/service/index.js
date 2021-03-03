import request from './request'

export function getInfo(params) {
    return request({
        method: 'get',
        url: 'jobcard/jobcard.php',
        params
    })
}

export function upload(data) {
    return request({
        method: 'post',
        url: 'jobcard/pic_deal.php',
        data
    })
}