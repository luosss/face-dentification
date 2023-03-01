import axios from 'axios'

// 创建一个axios实例
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'https://qa.giiatop.com/facetest'
}
if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'https://qa.giiatop.com/facetest'
}

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 比如可以在请求头中添加token
    
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  /**
   * 如果你想要获取诸如头信息或状态之类的http信息
   * 请返回response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 也可以通过HTTP状态码来判断状态
   */
  response => {
    const res = response.data

    // // 如果返回的状态码不是true，则判断为错误。
    // if (res.success !== true) {
    //   // console.error(res.error) // for debug
    //   return Promise.reject(res.error)
    // } else {
    //   return res
    // }
    return res
  },
  error => {
    console.error('err' + error) // for debug
    return Promise.reject(error)
  }
)

//设置get请求方式 用promise方式返回的实例来实现
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

//设置post请求方式 用promise方式返回的实例来实现
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params,{
      headers: { 'content-type': 'application/x-www-form-urlencoded'}
    }
    ).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

