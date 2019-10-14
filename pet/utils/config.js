/** =================================================== */
/**
 *                      全局数据
 */
/** =================================================== */
const Service_Phone = "4007778889"; // 客服电话
const Version_Name = "1.3.15"; // 版本名称
const Version_Code = 25; // 版本编号

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

const URL_GetBusinessByPosition = "/api/business/listByPosition"; // 根据坐标获取周边商家

const URL_Register_Business = "/business/insetBusiness"; // 注册商家
const URL_Register_Staff = "/api/staff/applyForStaff"; // 注册员工
const URL_GetStationListByLocation = "/api/staff/listByProvinceAndCity"; // 根据省市区获取站点列表
const URL_GetUnauditedStaff = "/api/staff/listUnauditedStaff"; // 查询待审核员工列表
const URL_ApprovalStaffApply = "/api/staff/review"; // 审批员工申请
const URL_RejectStaffApply = "/api/staff/reject"; // 驳回员工申请
const URL_GetUnauditedStation = "/api/business/listAllUnauditedBusiness"; // 查询待审核商户列表
const URL_ApprovalStationApply = "/api/business/review"; // 审批商户申请
const URL_RejectStationApply = "/api/business/reject"; // 驳回商户申请

const URL_GetSubStaff = "/api/staff/"; // 获取下属员工

const URL_PetType = "/api/petType"; // 宠物类型
const URL_PetClassify = "/api/petClassify"; // 宠物品种
const URL_StartCity = "/api/transport/listStartCity"; // 始发城市
const URL_EndCity = "/api/transport/listEndCity"; // 目标城市
const URL_AbleTransportType = "/api/transport/listTransportType"; // 可用运输方式
const URL_AbleStation_Receipt = "/api/consign/onDoorService/get/receipt"; // 上门接宠是否有可用站点
const URL_AbleStation_Send = "/api/consign/onDoorService/get/send"; // 送宠上门是否有可用站点
const URL_AblePetCage = "/api/pet/cage"; // 查询箱子
// const URL_AbleAirBox = "/aip/consign/airBox/listStationAixBox"; // 航空箱是否可用
const URL_InsureRate = "/api/consign/insure"; // 查询保价费率
const URL_PredictPrice = "/api/order/getOrderPrice"; // 获取预估价格
const URL_GetStorePhoneByCityName = "/api/business/getPhoneByCityName"; // 通过城市获取商家电话

const URL_ChangeToDeliver = "/api/order/deliver"; // 修改待签收状态为派送
const URL_PostTransportInfo = "/api/order/transport"; // 添加运输信息
const URL_Order = "/api/order/insertOrder"; // 下单
const URL_CancelOrder = "/api/order/cancelOrder"; // 取消订单
const URL_GetOrderListByOrderStatus = "/api/order/listOrderList"; // 根据订单类型查询订单列表
const URL_GetStationAllOrder = "/api/consign/port/list/Complete"; // 获取当前站点所有订单 包含已完成
const URL_OrderDetail = "/api/order/orderDetail"; // 查询订单详情
const URL_GetOrderNoByOrderNo = "/api/order/getOrderNoByOrderNo"; // 通过单号模糊查询单号
const URL_ConfirmOrder = "/api/order/confirmOrder"; // 确认收货
const URL_GetUnConfirmOrderList = "/api/order/listUncertainty"; // 获取未确认收货订单
const URL_AlloctionOrder = '/api/order/assignment/'; // 订单分配
const URL_PostOrderRemark = '/api/order/remarks'; // 新增一条订单备注
const URL_EditOrderContacts = '/api/order/update/contacts'; // 更新订单联系人信息
const URL_Premium = '/api/order/premium'; // 新增差价单

const URL_GetCouponList = '/aip/coupon/listByOpenId'; // 获取优惠券列表

const URL_Payment = "/api/weChat/pay/getOrderPayParam"; // 获取支付参数
const URL_Recharge = "/api/weChat/pay/getRechargeParam"; // 获取充值参数
const URL_PayPremium = "/api/weChat/pay/getOrderPremiumParam"; // 获取补价参数

const URL_GetInOrOutHarbourList = "/api/consign/port/listByLikeOrderNo"; // 获取出入港单据列表
const URL_ConfirmInOutHarbour = "/api/consign/orderState/inOrOutPort"; // 确认出入港

const URL_UploadFile = "/api/consign/orderState/uploadMediaFiles"; // 上传文件

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
const Role_Staff_Manager = 1; // 管理员
const Role_Staff_Service = 2; // 客服
const Role_Staff_Diver = 3; // 司机

const Order_State_ToPay = "待付款";
const Order_State_ToPack = "待揽件";
const Order_State_ToInPort = "待入港";
const Order_State_InPort = "已入港";
const Order_State_ToOutPort = "待出港";
const Order_State_OutPort = "已出港";
const Order_State_ToArrived = "待到达";
const Order_State_Arrived = "已到达";
const Order_State_Delivering = "派送中";
const Order_State_ToSign = "待签收";
const Order_State_Completed = "已完成";
/** =================================================== */
/** 
 *                      Key
 */
/** =================================================== */

const Key_LastGetMessageTime = "LastGetMessageTime"; // 最后获取站内信时间

const Key_QQ_Map = "K5JBZ-QM7KP-Z54D5-LIMBQ-AFFNS-7ABT6"; // 腾讯地图 app_key

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

  URL_GetBusinessByPosition, // 根据坐标获取周边商家

  URL_Register_Business, // 注册商家
  URL_Register_Staff, // 注册员工
  URL_GetStationListByLocation, // 根据位置获取站点列表
  URL_GetUnauditedStaff, // 查询待审核员工列表
  URL_ApprovalStaffApply, // 审批员工申请
  URL_RejectStaffApply, // 驳回员工申请
  URL_GetUnauditedStation, // 查询待审核商户列表
  URL_ApprovalStationApply, // 审批商户申请
  URL_RejectStationApply, // 驳回商户申请

  URL_GetSubStaff, // 获取下属员工

  URL_PetType, // 宠物类型
  URL_PetClassify, // 宠物品种
  URL_StartCity, // 始发城市
  URL_EndCity, // 目标城市
  URL_AbleTransportType, // 可用运输方式
  URL_AbleStation_Receipt, // 上门接宠是否有可用站点
  URL_AbleStation_Send, // 送宠到家是否有可用站点
  URL_AblePetCage, // 查询宠物箱
  // URL_AbleAirBox, // 航空箱是否可用
  URL_InsureRate, // 查询保价费率
  URL_PredictPrice, // 获取预估价格
  URL_GetStorePhoneByCityName, // 通过城市名称 获取商家电话

  URL_ChangeToDeliver, // 修改代签收状态为派送
  URL_PostTransportInfo, // 添加运输信息
  URL_Order, // 下单
  URL_CancelOrder, // 取消订单
  URL_GetOrderListByOrderStatus, // 根据订单类型查询订单列表
  URL_GetStationAllOrder, // 获取当前站点所有订单 包含已完成
  URL_OrderDetail, // 查询订单详情
  URL_GetOrderNoByOrderNo, // 通过单号模糊查询单号
  URL_ConfirmOrder, // 确认收货
  URL_GetUnConfirmOrderList, // 获取未确认收货订单列表
  URL_AlloctionOrder, // 订单分配
  URL_PostOrderRemark, // 新增一条订单备注
  URL_EditOrderContacts, // 修改订单联系人
  URL_Premium, // 新增差价单

  URL_GetCouponList, // 获取优惠券列表

  URL_Payment, // 获取支付参数
  URL_Recharge, // 获取充值参数
  URL_PayPremium, // 获取补价参数

  URL_GetInOrOutHarbourList, // 获取出入港单据列表
  URL_ConfirmInOutHarbour, // 确认出入港

  URL_UploadFile, // 上传文件

  URL_Get_Message, // 获取站内信
  URL_Get_New_Message, // 获取最新站内信

  Prompt_Success, // 成功标识
  Prompt_Error, // 错误标识
  Prompt_NotExist, // 不存在标识

  Role_Customer, // 用户角色
  Role_Staff_Manager, // 管理员
  Role_Staff_Service, // 客服
  Role_Staff_Diver, // 司机

  Order_State_ToPay, // 待付款
  Order_State_ToPack, // 待揽件
  Order_State_ToInPort, // 待入港
  Order_State_InPort, // 已入港
  Order_State_ToOutPort, // 待出港
  Order_State_OutPort, // 已出港
  Order_State_ToArrived, // 待到达
  Order_State_Arrived, // 已到达
  Order_State_Delivering, // 派送中
  Order_State_ToSign, // 待签收
  Order_State_Completed, // 已完成

  Key_LastGetMessageTime, // 最后获取站内信时间
  Key_QQ_Map, // 腾讯地图appkey

  Value_Default_LastGetMessageTime,
}
