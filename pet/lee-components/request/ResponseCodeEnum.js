var Res_Code = {
  SUCCESS: 10000, // 成功
  TIME_OUT: 20001, // 登陆超时
  FAILURE: 20002, // 登陆失败
  NOT_EXIST: 20003, // 用户不存在
  SAME_PASSWORD: 20004, // 账号密码不同
  UNKOWN_EXCEPTION: 90001, // 未知错误
}

var Status_Code = {
  OK: 200, // 请求成功
}

module.exports ={
  Res_Code,
  Status_Code,
}