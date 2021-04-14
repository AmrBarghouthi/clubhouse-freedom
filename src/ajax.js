import Axios from 'axios'

const ajax = Axios.create({
  baseURL: 'https://www.clubhouseapi.com/api',
  headers: {
    'CH-AppBuild': '269',
    'CH-AppVersion':'0.1.25',
    'Content-Type':'application/json; charset=utf-8',
    'CH-Languages':'en-US',
    'CH-Locale':'en_US',
    'Accept':'application/json',
    'CH-DeviceId':'6B51095C-D0EB-489D-AC84-58B03CE4E481',
  },
})

export default ajax
