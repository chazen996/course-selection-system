import {Component} from 'react';
import {Modal,Form,Input,message} from 'antd';
import AdminStore from "../../stores/AdminStore";
import {observer} from 'mobx-react';

const FormItem = Form.Item;

@observer
class CreateTeacherModal extends Component{

  render (){
    const getFieldDecorator = this.props.form.getFieldDecorator;

    return (
      <div>
        <Modal
          title="教师信息"
          visible={AdminStore.getShowCreateTeacherModal}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          mask={false}
          style={{top:0}}
          onCancel={()=>{
            AdminStore.setShowCreateTeacherModal(false);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                let person = {
                  name:values.teacherName,
                  number:values.teacherNumber,
                  email:values.teacherEmail,
                  password:values.teacherPassword,
                  introduction:values.teacherIntroduction,
                  type:'teacher'
                };

                AdminStore.updatePerson(person).then(response=>{
                  if(response){
                    message.success('添加成功');
                    AdminStore.loadData();
                  }else{
                    message.error('网络错误，请稍后再试');
                  }
                });
              }
            });
          }}
        >
          <Form>
            <FormItem
              label="姓名"
              hasFeedback>
              {getFieldDecorator('teacherName', {
                rules: [{ required: true, message: '请输入教师姓名！'}],
              })(
                <Input placeholder="请输入教师姓名" />
              )}
            </FormItem>
            <FormItem
              label="工号"
              hasFeedback>
              {getFieldDecorator('teacherNumber', {
                rules: [{ required: true, message: '请输入教师工号！'}],
              })(
                <Input placeholder="请输入教师工号"/>
              )}
            </FormItem>
            <FormItem
              label="密码"
              hasFeedback>
              {getFieldDecorator('teacherPassword', {
                rules: [{ required: true, message: '请输入密码！'}],
              })(
                <Input placeholder="请输入密码"/>
              )}
            </FormItem>
            <FormItem
              label="简介"
              hasFeedback>
              {getFieldDecorator('teacherIntroduction', {
                rules: [{ required: true, message: '请输入教师简介！'}],
              })(
                <Input placeholder="请输入教师简介"/>
              )}
            </FormItem>
            <FormItem
              label="邮箱"
              hasFeedback>
              {getFieldDecorator('teacherEmail', {
                rules: [{
                  type: 'email', message: '邮箱格式不正确！',
                }, {
                  required: true, message: '请输入邮箱地址！',
                }]
              })(
                <Input placeholder="请输入教职工邮箱"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(CreateTeacherModal);
