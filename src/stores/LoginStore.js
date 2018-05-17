import axios from 'axios';
import PublicAuthKit from '../utils/PublicAuthKit';


class LoginStore {
  constructor(){
    PublicAuthKit.addAuthHeader();
  }

  loginSuccess(userInfo){
    PublicAuthKit.setItem('username',userInfo.name);
    PublicAuthKit.setItem('type',userInfo.type);
    PublicAuthKit.setItem('userId',userInfo.id);
  }

  login(userInfo){
    return axios.get(`/person/login/${userInfo.username}/${userInfo.password}`).catch(err=>{
      console.log(err);
    });
  }
}
const loginStore = new LoginStore();
export default loginStore;
