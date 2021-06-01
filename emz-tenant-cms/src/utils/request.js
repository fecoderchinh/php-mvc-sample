import axios from 'axios';
import store from '@/store';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_API_GATEWAY_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    console.log('Request to server:' + config.baseURL + config.url )
    if (store.state.auth.currentUser.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + store.state.auth.currentUser.token
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    console.log('Response from server:')
    console.log(res)

    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      // has error
      return Promise.reject(new Error(response.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service