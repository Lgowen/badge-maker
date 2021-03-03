import Mock from 'mockjs'

Mock.mock(/jobcard\/jobcard\.php/, 'get', () => ({
    username_cn: "子文",
    username_en: "Jianguo Chuan",
    dep_name: "人力与行政共享服务中心",
    jobnumber: "10408",
}))

export default Mock