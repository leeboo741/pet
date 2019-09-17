/** =================================================== */
/**
 *                      全局数据
 */
/** =================================================== */
const Service_Phone = "0793-322132153"; // 客服电话
const Version_Name = "1.2.6"; // 版本名称
const Version_Code = 9; // 版本编号

/** =================================================== */
/** 
 *                      网络请求
 */
/** =================================================== */
const URL_Service = "https://pet.tyferp.com"; // 路径 
// const URL_Service = "http://huji820.oicp.net"; // 路径
// const URL_Service = "http://192.168.3.111:5050"; // 路径
// const URL_Service = "http://192.168.3.233:5050"; // 路径

const URL_Register = "/api/customer/"; // 注册
const URL_Login = "/api/oAuth"; // 登陆
const URL_UpdateCustomer = "/api/customer/updateCustomer"; // 更新用户
const URL_CheckBalance = "/api/balance"; // 查询余额
const URL_Withdraw ="/api/withdraw/staff"; // 提现
const URL_GetCode = "/business/VerificationCode/"; // 获取短信验证码
const URL_Register_Business = "/business/insetBusiness"; // 注册商家

const URL_GetBusinessByPosition = "/api/business/listByPosition"; // 根据坐标获取周边商家

const URL_GetSubStaff = "/api/staff/"; // 获取下属员工

const URL_PetType = "/api/petType"; // 宠物类型
const URL_PetClassify = "/api/petClassify"; // 宠物品种
const URL_StartCity = "/api/transport/listStartCity"; // 始发城市
const URL_EndCity = "/api/transport/listEndCity"; // 目标城市
const URL_AbleTransportType = "/api/transport/listTransportType"; // 可用运输方式
const URL_AbleStation = "/api/consign/onDoorService/getEndCityStation"; // 是否有可用站点
const URL_AblePetCage = "/api/pet/cage"; // 查询箱子
// const URL_AbleAirBox = "/aip/consign/airBox/listStationAixBox"; // 航空箱是否可用
const URL_InsureRate = "/api/consign/insure"; // 查询保价费率
const URL_PredictPrice = "/api/order/getOrderPrice"; // 获取预估价格
const URL_GetStorePhoneByCityName = "/api/business/getPhoneByCityName"; // 通过城市获取商家电话

const URL_Order = "/api/order/insertOrder"; // 下单
const URL_CancelOrder = "/api/order/cancelOrder"; // 取消订单
const URL_GetOrderListByOrderStatus = "/api/order/listOrderList"; // 根据订单类型查询订单列表
const URL_OrderDetail = "/api/order/orderDetail"; // 查询订单详情
const URL_GetOrderNoByOrderNo = "/api/order/getOrderNoByOrderNo"; // 通过单号模糊查询单号
const URL_ConfirmOrder = "/api/order/confirmOrder"; // 确认收货
const URL_GetUnConfirmOrderList = "/api/order/listUncertainty"; // 获取未确认收货订单
const URL_AlloctionOrder = '/api/order/assignment/'; // 订单分配

const URL_GetCouponList = '/aip/coupon/listByOpenId'; // 获取优惠券列表

const URL_Payment = "/api/weChat/pay/getOrderPayParam"; // 获取支付参数
const URL_Recharge = "/api/weChat/pay/getRechargeParam"; // 获取充值参数

const URL_GetInOrOutHarbourList = "/api/consign/port/listByLikeOrderNo"; // 获取出入港单据列表
const URL_ConfirmInOutHarbour = "/api/consign/orderState/inOrOutPort"; // 确认出入港

const URL_UploadFile = "/api/consign/orderState/uploadFile"; // 上传文件

const URL_Get_Message = "/api/message/customer/"; // 获取站内信
const URL_Get_New_Message = "/api/message/push/"; // 获取最新站内信

/** =================================================== */
/** 
 *                      Enum
 */
/** =================================================== */

const Prompt_Success = "Success"; // 成功标识
const Prompt_Error = "Error"; // 错误标识
const Prompt_NotExist = "NotExist"; // 不存在标识

const Role_Customer = 0; // 用户角色
const Role_Staff_Nomal = 1; // 普通员工角色
const Role_Staff_Manager = 2; // 管理员

/** =================================================== */
/** 
 *                      Key
 */
/** =================================================== */

const Key_LastGetMessageTime = "LastGetMessageTime"; // 最后获取站内信时间

/** =================================================== */
/** 
 *                      Key
 */
/** =================================================== */

const Value_Default_LastGetMessageTime = "1990-01-01 00:00:00"; 

module.exports = {
  Service_Phone, // 客服电话
  Version_Name, // 版本名称
  Version_Code, // 版本编号

  URL_Service, // 请求路径

  URL_Register, // 注册
  URL_Login, // 登陆
  URL_UpdateCustomer, // 更新用户
  URL_CheckBalance, // 查询余额
  URL_Withdraw, // 提现
  URL_GetCode, // 获取短信验证码
  URL_Register_Business, // 注册商家

  URL_GetBusinessByPosition, // 根据坐标获取周边商家

  URL_GetSubStaff, // 获取下属员工

  URL_PetType, // 宠物类型
  URL_PetClassify, // 宠物品种
  URL_StartCity, // 始发城市
  URL_EndCity, // 目标城市
  URL_AbleTransportType, // 可用运输方式
  URL_AbleStation, // 是否有可用站点
  URL_AblePetCage, // 查询宠物箱
  // URL_AbleAirBox, // 航空箱是否可用
  URL_InsureRate, // 查询保价费率
  URL_PredictPrice, // 获取预估价格
  URL_GetStorePhoneByCityName, // 通过城市名称 获取商家电话

  URL_Order, // 下单
  URL_CancelOrder, // 取消订单
  URL_GetOrderListByOrderStatus, // 根据订单类型查询订单列表
  URL_OrderDetail, // 查询订单详情
  URL_GetOrderNoByOrderNo, // 通过单号模糊查询单号
  URL_ConfirmOrder, // 确认收货
  URL_GetUnConfirmOrderList, // 获取未确认收货订单列表
  URL_AlloctionOrder,

  URL_GetCouponList, // 获取优惠券列表

  URL_Payment, // 获取支付参数
  URL_Recharge, // 获取充值参数

  URL_GetInOrOutHarbourList, // 获取出入港单据列表
  URL_ConfirmInOutHarbour, // 确认出入港

  URL_UploadFile, // 上传文件

  URL_Get_Message, // 获取站内信
  URL_Get_New_Message, // 获取最新站内信

  Prompt_Success, // 成功标识
  Prompt_Error, // 错误标识
  Prompt_NotExist, // 不存在标识

  Role_Customer, // 用户角色
  Role_Staff_Nomal, // 员工角色
  Role_Staff_Manager, // 管理员

  Key_LastGetMessageTime, // 最后获取站内信时间

  Value_Default_LastGetMessageTime,
}
