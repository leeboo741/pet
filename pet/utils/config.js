/** =================================================== */
/**
 *                      全局数据
 */
/** =================================================== */
const Service_Phone = "4007778889"; // 客服电话
/**
 * 上一版本 1.6.10
 * 上一版本时间 2020.10.24
 * 新版本说明
 * 1. 修复 客户订单详情 收货 一直loading 的bug
 */
const Version_Name = "1.6.10"; // 版本名称
const Version_Code = 12; // 版本编号
const Branch_Name = "master"; // 分支名称

const ENV_DEV = 'develop'; // 开发环境
const ENV_TRIAL = 'trial'; // 体验环境
const ENV_RELEASE = 'release'; // 生产环境

const ENV_CURRENT = ENV_RELEASE; // 当前环境

const MINI_PROGRAME_APPID_PETMALL = 'wxca35493268376086'; // 商城小程序 appid

const PRINT_ABLE_FOLLOW_ENV = false; // 打印权限是否跟随 环境设置
const PRINT_ABLE = PRINT_ABLE_FOLLOW_ENV?(ENV_CURRENT != ENV_RELEASE): false; // 打印权限 跟随环境设置(当不等于线上环境时允许打印日志) 不跟随环境限制(允许打印)

/** =================================================== */
/** 
 *                      网络请求
 */
/** =================================================== */
let URL_Service = "";
switch(ENV_CURRENT) {
  case ENV_DEV:
    URL_Service = "http://192.168.3.44:7777"; // 周晓健
    // URL_Service = "http://192.168.3.110:7777"; // =
    break;
  case ENV_TRIAL:
    URL_Service = "https://consign.taochonghui.com";
    break;
  case ENV_RELEASE:
    URL_Service = "https://consign.taochonghui.com";
    break;
  default:
    URL_Service = "https://consign.taochonghui.com";
    break;
}

const URL_GetUserInfoByCode = "/api/wechat/userinfo/open"; // 通过WXCode 获取 信息
const URL_GetUserInfoByBaseInfo = "/api/wechat/userinfo/union"; // 通过基本信息获取用户信息
const URL_LoginWithUnionId = "/api/oAuth/unionId"; // 通过unionID 更新用户信息
const URL_Login = "/api/oAuth/we-Chat"; // 登陆
const URL_UpdateCustomer = "/api/oAuth/customer-no/"; // 更新用户
const URL_CompletionBusinessInfo = "/api/business/update"; // 完善商家信息
const URL_AuthBusiness = "/api/business/insetBusiness"; // 认证商家
function URL_GetBusinessAuthInfo(businessNo) {
  return "/api/business/" + businessNo;
} // 获取商家认证信息
const URL_CheckBalance = "/api/balance"; // 查询余额
const URL_Withdraw_Station ="/api/withdraw/station"; // 站点提现
const URL_Withdraw_Business = "/api/withdraw/business"; // 商家提现
const URL_WithdrawFlow_Station = "/api/withdraw/station/flow"; // 站点提现流水
const URL_WithdrawFlow_Business = "/api/withdraw/business/flow"; // 商家提现流水
function URL_BalanceFlow_Station(stationNo, offset, limit) {
  return "/api/order/flow/station/" + stationNo + "/offset/" + offset + "/limit/" + limit;
} // 站点余额流水
function URL_BalanceFlow_Business(businessNo, offset, limit) {
  return "/api/order/flow/business/" + businessNo + "/offset/" + offset + "/limit/" + limit;
} // 商家余额流水
const URL_BalanceBuffer_Station = "/api/balance/buffer/station"; // 站点 可用余额 和 冻结余额
const URL_BalanceBuffer_Business = "/api/balance/buffer/business"; // 商家 可用余额 和 冻结余额
const URL_GetCode = "/business/VerificationCode/"; // 获取短信验证码
const URL_CheckHaveNewGiftBagOnPetMall = "/aip/coupon/getNewGiftBag"; // 查询是否有商城新客大礼包

const URL_GetBusinessByPosition = "/api/business/listByPosition"; // 根据坐标获取周边商家
const URL_GetBusinessCityGroup = "/api/business/list/city/group"; // 查询商家数据的城市分组
const URL_GetBusinessListByProvince = "/api/business/list/province/"; // 通过省份查询商家列表

const URL_GetStationListByPosition = "/station/api/listByPosition"; // 获取定位周边站点
const URL_GetStationCityGroup = "/station/api/listGroupByCity"; // 查询商家数据的城市分组
const URL_GetStationListByProvince = "/station/api/listByProvince"; // 通过省份查询商家列表

const URL_Register_Business = "/business/insetBusiness"; // 注册商家
const URL_Register_Staff = "/api/staff/applyForStaff"; // 注册员工
const URL_Edit_Staff = "/api/staff/update"; // 编辑员工
const URL_Delete_Staff = "/api/staff/delete"; // 删除员工
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
const URL_GetPetClassifyListByKeyword = '/api/petClassify/keyWord/'; // 根据关键字搜索宠物品种列表
const URL_StartCity = "/api/transport/listStartCity"; // 始发城市
const URL_EndCity = "/api/transport/listEndCity"; // 目标城市
const URL_AbleTransportType = "/api/transport/listTransportType"; // 可用运输方式
const URL_AbleStation_Receipt = "/api/consign/onDoorService/get/receipt"; // 上门接宠是否有可用站点
const URL_AbleStation_Send = "/api/consign/onDoorService/get/send"; // 送宠上门是否有可用站点
const URL_MaxWeight = "/api/consign/cage/exists"; // 查询线路最大允许重量
const URL_AblePetCage = "/api/consign/cage/max"; // 查询宠物箱是否可用
const URL_InsureRate = "/api/consign/insure"; // 查询保价费率
const URL_PredictPrice = "/api/order/getOrderPrice"; // 获取预估价格
const URL_GetStorePhoneByCityName = "/api/business/getPhoneByCityName"; // 通过城市获取商家电话

const URL_ChangeToDeliver = "/api/order/deliver"; // 修改待签收状态为派送
const URL_PostTransportInfo = "/api/order/transport"; // 添加运输信息
const URL_PostOrderTakerInfo = "/api/order/take-detail"; // 添加提货信息
function URL_GetDefaultOrderTakerInfo(orderNo, code) {
  if(code != null && code.length>0) {
    return "/api/order/take-detail/default/" + orderNo + "/code/" + code;
  } else {
    return "/api/order/take-detail/default/" + orderNo;
  }
} // 获取默认提货配置
const URL_Order = "/api/order/insertOrder"; // 下单
const URL_CancelOrder = "/api/order/cancelOrder"; // 取消订单
const URL_GetOrderListByOrderStatus = "/api/order/listOrderList"; // 根据订单类型查询订单列表
const URL_GetStationAllOrder = "/api/consign/port/list/Complete"; // 获取当前站点所有订单 包含已完成
const URL_OrderDetail = "/api/order/orderDetail"; // 查询订单详情
function URL_OrderInfo(orderNo){
  return "/api/order/" + orderNo;
}
const URL_DeleteOrder = "/api/order/deleteOrder"; // 删除订单
const URL_GetOrderNoByOrderNo = "/api/consign/order-no/auto"; // 通过单号模糊查询单号
const URL_ConfirmOrder = "/api/order/confirmOrder"; // 确认收货
const URL_GetUnConfirmOrderList = "/api/order/listUncertainty"; // 获取未确认收货订单
const URL_AlloctionOrder = '/api/order/assignment/'; // 订单分配
const URL_PostOrderRemark = '/api/order/remarks'; // 新增一条订单备注
const URL_EditOrderContacts = '/api/order/update/contacts'; // 更新订单联系人信息
const URL_Premium = '/api/order/premium'; // 新增差价单
const URL_GetStationPhone = '/station/api/get/phone'; // 获取站点电话
const URL_UnPayPremiumCount = "/api/order/premium/count/unpaid"; // 未支付差价单数量
const URL_CancelPremium = "/api/order/premium/cancel"; // 取消补价单
const URL_CheckConfirm = "/api/order/check/order"; // 查询是否可以收货
const URL_OrderRefund = "/api/order/refund"; // 订单退款
const URL_ChangeOrderPrice = "/api/order/update/price"; // 修改订单价格
const URL_Order_Evalueate = "/api/order/evaluate"; // 订单评价
const URL_Order_Station_All = "/api/order/list/station"; // 查询站点所有订单
const URL_Order_Confirm_Condition = '/api/order/confirmRegulation'; // 确认订单条款

const URL_GetCouponList = '/aip/coupon/listByOpenId'; // 获取优惠券列表

const URL_OtherPay = "/api/weChat/pay/getOtherOrderPayParam"; // 获取代支付参数
const URL_Payment = "/api/weChat/pay/getOrderPayParam"; // 获取支付参数
const URL_Recharge = "/api/weChat/pay/getRechargeParam"; // 获取充值参数
const URL_PayPremium = "/api/weChat/pay/getOrderPremiumParam"; // 获取补价参数
const URL_CompletePay = "/station/api/completePayment"; // 完成支付操作

const URL_GetInOrOutHarbourList = "/api/consign/port/listByLikeOrderNo"; // 获取出入港单据列表
const URL_ConfirmInOutHarbour = "/api/consign/orderState/inOrOutPort"; // 确认出入港

const URL_UploadFile = "/api/consign/orderState/uploadMediaFiles"; // 上传文件
const URL_UploadStationQRCode = "/station/api/uploadQR"; // 上传站点二维码
const URL_Upload = "/file/upload"; // 文件上传

const URL_Get_Message = "/api/message/customer/"; // 获取站内信
const URL_Get_New_Message = "/api/message/push/"; // 获取最新站内信

const URL_Add_PaymentVoucher = "/api/order/uploadPaymentVoucher"; // 新增付款凭证
const URL_Verify_PaymentVoucher = "/api/order/api/order/examinePaymentVoucher"; // 审核付款凭证

/** =================================================== */
/** 
 *                      Enum
 */
/** =================================================== */

const Prompt_Success = "Success"; // 成功标识
const Prompt_Error = "Error"; // 错误标识
const Prompt_NotExist = "NotExist"; // 不存在标识

const RES_CODE_SUCCESS = 200; // 成功code
const RES_CODE_NOTEXIST = 406; // 用户不存在

const Role_Customer = 0; // 用户角色
const Role_Staff_Manager = 1; // 管理员
const Role_Staff_Service = 2; // 客服
const Role_Staff_Diver = 3; // 司机

const Order_State_ToPay = "待付款";  
const Order_State_ToVerify = "待审核";
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

/**
 * TO_BE_PAID("待付款", "订单生成成功，等待用户支付"),

CANCEL("已取消", "用户取消了订单"),

PAID("已支付", "订单已支付"),

SHIPPED("待发货", "支付之后等待入港"),

RECEIVING("待收货", "从起始站点出港之后"),

COMPLETED("已完成", "订单已完成"),

REFUND("已退款", "订单退款完成");
 */
const Order_State_TO_BE_PAID = "待付款";
const Order_State_CANCEL = "已取消";
const Order_State_PAID = "已支付";
const Order_State_SHIPPED = "待发货";
const Order_State_RECEIVING = "待收货";
const Order_State_COMPLETED = "已完成";
const Order_State_REFUND = "已退款";


const Key_LastGetMessageTime = "LastGetMessageTime"; // 最后获取站内信时间

const Key_QQ_Map = "K5JBZ-QM7KP-Z54D5-LIMBQ-AFFNS-7ABT6"; // 腾讯地图 app_key

const Value_Default_LastGetMessageTime = "1990-01-01 00:00:00"; 

module.exports = {
  Service_Phone, // 客服电话
  Version_Name, // 版本名称
  Version_Code, // 版本编号
  Branch_Name, // 分支名称

  URL_Service, // 请求路径

  URL_GetUserInfoByCode, // 通过CODE获取用户信息
  URL_GetUserInfoByBaseInfo, // 通过基本信息获取用户信息
  URL_Login, // 登陆
  URL_LoginWithUnionId, // 通过unionId登录 更新用户信息
  URL_UpdateCustomer, // 更新用户
  URL_CompletionBusinessInfo, // 完善商家信息
  URL_AuthBusiness, // 商家认证
  URL_GetBusinessAuthInfo, // 获取商家认证信息
  URL_CheckBalance, // 查询余额
  URL_Withdraw_Station, // 站点提现
  URL_Withdraw_Business, // 商家提现
  URL_WithdrawFlow_Station, // 站点提现流水
  URL_WithdrawFlow_Business, // 商家提现流水
  URL_BalanceFlow_Station, // 站点 余额流水
  URL_BalanceFlow_Business, // 商家 余额流水
  URL_BalanceBuffer_Station, // 站点 冻结余额 和 可用余额
  URL_BalanceBuffer_Business, // 商家 冻结余额 和 可用余额
  URL_GetCode, // 获取短信验证码
  URL_CheckHaveNewGiftBagOnPetMall, // 查询是否有商城新客大礼包

  URL_GetBusinessByPosition, // 根据坐标获取周边商家
  URL_GetBusinessCityGroup, // 查询商家数据的城市分组
  URL_GetBusinessListByProvince, // 通过省份查询商家列表

  URL_GetStationListByPosition, // 获取定位周边站点
  URL_GetStationCityGroup, // 查询站点数据的城市分组
  URL_GetStationListByProvince, // 通过省份查询站点列表

  URL_Register_Business, // 注册商家
  URL_Register_Staff, // 注册员工
  URL_Edit_Staff, // 编辑员工
  URL_Delete_Staff, // 删除员工
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
  URL_GetPetClassifyListByKeyword, // 根据关键字查询宠物品种列表
  URL_StartCity, // 始发城市
  URL_EndCity, // 目标城市
  URL_AbleTransportType, // 可用运输方式
  URL_AbleStation_Receipt, // 上门接宠是否有可用站点
  URL_AbleStation_Send, // 送宠到家是否有可用站点
  URL_MaxWeight, // 查询线路最大重量
  URL_AblePetCage, // 查询宠物箱是否可用
  URL_InsureRate, // 查询保价费率
  URL_PredictPrice, // 获取预估价格
  URL_GetStorePhoneByCityName, // 通过城市名称 获取商家电话

  URL_ChangeToDeliver, // 修改代签收状态为派送
  URL_PostTransportInfo, // 添加运输信息
  URL_PostOrderTakerInfo, // 添加提货信息
  URL_GetDefaultOrderTakerInfo, // 获取默认提货配置
  URL_Order, // 下单
  URL_CancelOrder, // 取消订单
  URL_GetOrderListByOrderStatus, // 根据订单类型查询订单列表
  URL_GetStationAllOrder, // 获取当前站点所有订单 包含已完成
  URL_OrderDetail, // 查询订单详情
  URL_DeleteOrder, // 删除订单
  URL_OrderInfo, // 查询订单信息
  URL_GetOrderNoByOrderNo, // 通过单号模糊查询单号
  URL_ConfirmOrder, // 确认收货
  URL_GetUnConfirmOrderList, // 获取未确认收货订单列表
  URL_AlloctionOrder, // 订单分配
  URL_PostOrderRemark, // 新增一条订单备注
  URL_EditOrderContacts, // 修改订单联系人
  URL_Premium, // 新增差价单
  URL_GetStationPhone, // 获取站点电话
  URL_UnPayPremiumCount, // 获取未支付差价单数量
  URL_CancelPremium, // 取消补价单
  URL_CheckConfirm, // 查询是否可以收货
  URL_OrderRefund, // 订单退款
  URL_ChangeOrderPrice, // 订单改价
  URL_Order_Evalueate, // 订单评价
  URL_Order_Station_All, // 查询站点所有订单
  URL_Order_Confirm_Condition, // 确认订单条款

  URL_GetCouponList, // 获取优惠券列表

  URL_OtherPay, // 获取代支付参数
  URL_Payment, // 获取支付参数
  URL_Recharge, // 获取充值参数
  URL_PayPremium, // 获取补价参数
  URL_CompletePay, // 完成支付操作

  URL_GetInOrOutHarbourList, // 获取出入港单据列表
  URL_ConfirmInOutHarbour, // 确认出入港

  URL_UploadFile, // 上传文件
  URL_UploadStationQRCode, // 上传站点收款码
  URL_Upload, // 文件上传

  URL_Get_Message, // 获取站内信
  URL_Get_New_Message, // 获取最新站内信

  URL_Add_PaymentVoucher, // 新增付款凭证
  URL_Verify_PaymentVoucher, // 审核付款凭证

  Prompt_Success, // 成功标识
  Prompt_Error, // 错误标识
  Prompt_NotExist, // 不存在标识

  RES_CODE_SUCCESS, // 成功标识
  RES_CODE_NOTEXIST, // 用户不存在

  Role_Customer, // 用户角色
  Role_Staff_Manager, // 管理员
  Role_Staff_Service, // 客服
  Role_Staff_Diver, // 司机

  Order_State_ToPay, // 待付款
  Order_State_ToVerify, // 待审核
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

  // ~~~不确定用不用~~~ //
  Order_State_TO_BE_PAID, // 待付款
  Order_State_CANCEL, // 已取消
  Order_State_PAID, // 已付款
  Order_State_SHIPPED, // 待出港
  Order_State_RECEIVING, // 待入港
  Order_State_COMPLETED, // 已完成
  Order_State_REFUND, // 已退款

  Key_LastGetMessageTime, // 最后获取站内信时间
  Key_QQ_Map, // 腾讯地图appkey

  Value_Default_LastGetMessageTime,

  ENV_DEV,
  ENV_TRIAL,
  ENV_RELEASE,
  ENV_CURRENT,

  MINI_PROGRAME_APPID_PETMALL,

  PRINT_ABLE,
}
