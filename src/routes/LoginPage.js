import {Component} from 'react';
import { Form,Icon,Input,Button,message } from 'antd';
import {observer} from 'mobx-react';
import LoginStore from '../stores/LoginStore';
import PublicAuthKit from '../utils/PublicAuthKit';

import loginStyles from "../assets/css/loginPage.css";
const FormItem = Form.Item;
const donghua = require("../assets/images/donghua.jpg");

// const openNotification = (description) => {
//   notification.open({
//     message: '消息提示：',
//     description: description,
//   });
// };


@observer
class LoginPage extends Component{
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        LoginStore.login(values).then(response => {
          if(response){
            if(response.data!=null){
              const userInfo = response.data;
              LoginStore.loginSuccess(userInfo);
              if(userInfo.type==='student'){
                this.props.history.push("/student");
              }else if(userInfo.type==='teacher'){
                this.props.history.push("/teacher");
              }else if(userInfo.type==='admin'){
                this.props.history.push("/admin");
              }
            }else{
              message.error('用户名或密码错误，请稍后再试');
            }
          }else{
            message.error('网络错误，请稍后再试');
          }
        });
      }
    });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{height:'99vh'}}>

        <div style={{
          width: '60%',
          height: '100%',
          display: 'inline-block'
        }}>
          <img src={donghua} alt='donghua'/>
        </div>
        <div style={{
          display:'inline-block',
          width:'40%',
          height:'100%',
          verticalAlign: 'top'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center'
          }}>
            <div className={loginStyles["login-page"]}>
              <div style={{
                marginBottom:'6%',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                top: '-17%'
              }}>
            <span style={{
              fontSize: 40,
              color: '#1890ff',
              // border: '3px solid'
            }}>基于微服务的选课系统</span>
              </div>
              <Form onSubmit={this.handleSubmit} className={loginStyles["login-form"]}>
                <FormItem>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名!' }],
                    valuePropName:'value',
                    initialValue:PublicAuthKit.getItemFromLocalStorage('username')
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码!' }],
                    valuePropName:'value',
                    initialValue:PublicAuthKit.getItemFromLocalStorage('password')
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="danger" htmlType="submit" className={loginStyles["login-form-button"]}>
                    立即登陆
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default Form.create()(LoginPage);
