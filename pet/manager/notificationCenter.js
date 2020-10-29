/**
 * 通知中心
 * 
 * 调用者可以在需要监听通知的地方调用以下方法注册通知监听
 * addNormalNotificationObserver
 * addOnceNotificationObserver
 * addAlwaysNewNotificationObserver
 * 
 * 在需要的地方调用以下方法发送通知,通知监听者调用响应方法进行响应处理
 * postNotification
 * 
 * 在不需要监听的时候调用调用以下方法移除对通知的监听
 * removeNotificationObserver
 * 
 */
const __notificationList = {}; // 通知对象存储器
const NOTIFICATION_TYPE = {
  NORMAL: 0, // 正常 可添加多个监听者
  ONCE: 1, // 只允许保留最初始的监听者
  ALWAYS_NEW: 2, // 只允许保留一个最新监听者
} // 通知类型
/**
 * 通知对象
 */
class Notification{
  name = ""; // notification 名称/标识
  notificationType = NOTIFICATION_TYPE.NORMAL; // 是否排他
  notificationObserverList = []; // 监听该通知的 对象列表
  /**
   * 构造器
   * @param {string} name 名称
   * @param {NOTIFICATION_TYPE} notificationType 类型
   */
  constructor(name, notificationType) {
    if (notificationType) {
      this.notificationType = notificationType;
    }
    this.name = name;
  }
  /**
   * 移除监听对象
   * @param {object} observer 监听对象
   */
  removeObserver(observer) {
    if (!(observer instanceof NotificationObserver)) {
      throw new Error('removeObserver 请传入 NotificationObserver 对象');
    }
    if (this.notificationObserverList.length == 0) {
      return;
    }
    let removeIndex = -1;
    this.notificationObserverList.forEach((item,index) => {
      if (cmp(item.observer, observer.observer)) {
        removeIndex = index;
      }
    });
    if (removeIndex != -1) {
      this.notificationObserverList.splice(removeIndex, 1);
    }
  }
  /**
   * 添加监听对象
   * @param {object} observer 监听对象
   */
  addObserver(observer) {
    if (!(observer instanceof NotificationObserver)) {
      throw new Error('addObserver 请传入 NotificationObserver 对象');
    }
    switch(this.notificationType) {
      case NOTIFICATION_TYPE.NORMAL: 
        if (this.notificationObserverList.length == 0) {
          this.notificationObserverList.push(observer);
          return;
        }
        let insertIndex = -1;
        this.notificationObserverList.forEach((item,index) => {
          if (cmp(item.observer, observer.observer)) {
            insertIndex = index;
          }
        });
        if (insertIndex == -1) {
          this.notificationObserverList.push(observer);
        } else {
          this.notificationObserverList[insertIndex] = observer;
        }
        break;
      case NOTIFICATION_TYPE.ONCE:
        if (this.notificationObserverList.length == 0) {
          this.notificationObserverList = [observer];
        }
        break;
      case NOTIFICATION_TYPE.ALWAYS_NEW:
        this.notificationObserverList = [observer];
        break;
    }
  }
}
/**
 * 监听者对象
 */
class NotificationObserver{
  selector = null; // 响应方法
  observer = null; // 监听对象
  /**
   * NotificationObserver 构造器
   * @param {function} selector 响应方法 
   * @param {object} observer 监听对象
   */
  constructor(selector, observer) {
    this.selector = selector;
    this.observer = observer;
  }
}

/**
 * 添加 Notice 监听
 * @param {string} name 广播名称
 * @param {function} selector 响应方法
 * @param {object} observer 监听者
 * @param {NOTIFICATION_TYPE} notificationType 是否排他通知
 */
function addNotificationObserver(name, selector, observer, notificationType) {
  if (name == null || typeof name != 'string') {
    throw new Error('addNotificationObserver 请传入 string 类型的 notice 广播名称 name');
  }
  if (selector == null || typeof selector != 'function') {
    throw new Error('addNotificationObserver 请传入 function 类型的 notice 响应方法 selector');
  }
  if (observer == null) {
    throw new Error('addNotificationObserver 广播监听者不能为空')
  } 
  if (__notificationList[name] == null) {
    __notificationList[name] = new Notification(name, notificationType);
  }
  let firstNotificationObserver = new NotificationObserver(selector, observer);
  __notificationList[name].addObserver(firstNotificationObserver);
}

/**
 * 添加 保持最原始监听者 通知
 * @param {string} name 通知名称
 * @param {function} selector 响应方法
 * @param {object} observer 监听对象
 */
function addOnceNotificationObserver(name, selector, observer) {
  addNotificationObserver(name, selector, observer, NOTIFICATION_TYPE.ONCE);
}

/**
 * 添加 保持最新通知监听者 通知
 * @param {string} name 通知名称
 * @param {function} selector 响应方法
 * @param {object} observer 监听对象
 */
function addAlwaysNewNotificationObserver(name, selector, observer) {
  addNotificationObserver(name, selector, observer, NOTIFICATION_TYPE.ALWAYS_NEW);
}

/**
 * 添加 多个通知监听者 通知
 * @param {string} name 通知名称
 * @param {function} selector 响应方法
 * @param {object} observer 监听对象
 */
function addNormalNotificationObserver(name, selector, observer) {
  addNotificationObserver(name, selector, observer, NOTIFICATION_TYPE.NORMAL);
}

/**
 * 移除 Notice 广播
 * @param {string} name 广播名称
 * @param {object} observer 监听者
 */
function removeNotificationObserver(name, observer) {
  if (observer == null) {
    __notificationList[name] = null;
  } else {
    if (__notificationList[name] != null) {
      __notificationList[name].removeObserver(new NotificationObserver(null, observer));
    }
  }
}

/**
 * 发送 Notice 广播
 * @param {string} name 广播名称
 * @param {object} info 附带信息
 */
function postNotification(name, info) {
  if (name == null || typeof name != 'string') {
    throw new Error('postNotification 请传入 string 类型的 notice name')
  }
  if (__notificationList[name] == null) {
    return;
  }
  __notificationList[name].notificationObserverList.forEach(item => {
    item.selector(info);
  });
}
 
/**
 * 用于对比两个对象是否相等
 * @param {object} x 要比对的对象1
 * @param {object} y 要比对的对象2
 */
function cmp(x, y) {
  // If both x and y are null or undefined and exactly the same  
  if (x === y) {
    return true;
  }
  // If they are not strictly equal, they both need to be Objects  
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  // They must have the exact same prototype chain, the closest we can do is  
  // test the constructor.  
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (var p in x) {
    // Inherited properties were tested using x.constructor === y.constructor  
    if (x.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined  
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      // If they have the same strict value or identity then they are equal  
      if (x[p] === y[p]) {
        continue;
      }
      // Numbers, Strings, Functions, Booleans must be strictly equal  
      if (typeof (x[p]) !== "object") {
        return false;
      }
      // Objects and Arrays must be tested recursively  
      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }
  for (p in y) {
    // allows x[ p ] to be set to undefined  
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}

module.exports = {
  addNormalNotificationObserver, // 添加 多个通知监听者 通知监听
  addOnceNotificationObserver, // 添加 保持最原始监听者 通知监听
  addAlwaysNewNotificationObserver, // 添加 保持最新通知监听者 通知监听
  removeNotificationObserver, // 移除通知监听
  postNotification, // 发送通知广播
}