import axios from 'axios'

const service = axios.create({
    baseURL:'http://10.192.167.32:5012/'
})

export default service