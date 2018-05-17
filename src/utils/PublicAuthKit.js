import axios from 'axios';
import Config from "./Config";

class PublicAuthKit{

  /* 往sessionStorage中储存加密后的数据 */
  setItem(key,value){
    sessionStorage.setItem(key,value);
  }

  /* 从sessionStorage中获取信息 */
  getItem(key){
    return sessionStorage.getItem(key);
  }

  setItemIntoLocalStorage(key,value){
    localStorage.setItem(key,value);
  }

  getItemFromLocalStorage(key){
    return localStorage.getItem(key);
  }

  removeItem(key){
    sessionStorage.removeItem(key);
  }

  removeItemFromLocalStorage(key){
    localStorage.removeItem(key);
  }

  /* 控制路由跳转前检查是否登陆，如未登陆直接跳转到login界面 */
  checkAuth(location) {
    let username = this.getItem('username');
    let type = this.getItem('type');
    if(username==null||type==null){
      return false;
    }
    return location.pathname.indexOf(type)!==-1;
  }

  /* 为auth设置token */
  addAuthHeader(){
    // const token = this.getItem('token');
    // axios.defaults.headers['Authorization'] = token;

    axios.defaults.baseURL = Config.baseURL;
    axios.defaults.headers['Content-Type'] = Config.ContentType;
  }

  /* 利用随机数和时间戳生成一个不会重复的ID,并将其入队 */
  generateNoneDuplicateID(randomLength) {
    return Number(
      Math.random().toString().substr(
        3, randomLength) + Date.now()).toString(36);
  }

  /* 深度拷贝函数 */
  deepCopy(obj) {
    if (obj instanceof Array) {
      const array = [];
      for (let i = 0; i < obj.length; i += 1) {
        array[i] = this.deepCopy(obj[i]);
      }
      return array;
    } else if (obj instanceof Object) {
      const newObj = {};
      Object.keys(obj).forEach((field) => {
        newObj[field] = this.deepCopy(obj[field]);
      });
      return newObj;
    } else {
      return obj;
    }
  }

  /* 删除两端的空格 */
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

  // 获取某元素以浏览器左上角为原点的坐标
  getTopAndLeft(obj, result) {
    let objTemp = obj;
    const resultTemp = result;
    let t = objTemp.offsetTop; // 获取该元素对应父容器的上边距
    let l = objTemp.offsetLeft; // 对应父容器的上边距
    // 判断是否有父容器，如果存在则累加其边距
    objTemp = objTemp.offsetParent;
    while (objTemp != null) {
      t += objTemp.offsetTop; // 叠加父容器的上边距
      l += objTemp.offsetLeft; // 叠加父容器的左边距
      objTemp = objTemp.offsetParent;
    }
    resultTemp.top = t;
    resultTemp.left = l;
  }

  /* 清除页面上所有选中的元素（解决按住文字无法拖动鼠标） */
  clearSelections=() => {
    if (window.getSelection) {
      // 获取选中
      const selection = window.getSelection();
      // 清除选中
      selection.removeAllRanges();
    } else if (document.selection && document.selection.empty) {
      // 兼容 IE8 以下，但 IE9+ 以上同样可用
      document.selection.empty();
    }
  };
  // saveCardPosition=(cardPosition)=>{
  //   sessionStorage.setItem('cardPosition',JSON.stringify(cardPosition));
  // };
  // getCardPosition=()=>{
  //   let temp = JSON.parse(sessionStorage.getItem('cardPosition'));
  //   return temp;
  // };
}
const publicAuthKit = new PublicAuthKit();
export default publicAuthKit;
