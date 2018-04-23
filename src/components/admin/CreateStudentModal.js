import {Component} from 'react';
import {Modal,Form,Input,message} from 'antd';
import AdminStore from "../../stores/AdminStore";
import {observer} from 'mobx-react';

const FormItem = Form.Item;

@observer
class CreateStudentModal extends Component{

  render (){
    const getFieldDecorator = this.props.form.getFieldDecorator;

    return (
      <div>
        <Modal
          title="添加学生"
          visible={AdminStore.getShowCreateStudentModal}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          mask={false}
          style={{top:0}}
          onCancel={()=>{
            AdminStore.setShowCreateStudentModal(false);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                let person = {
                  name:values.studentName,
                  number:values.studentNumber,
                  email:values.studentEmail,
                  password:values.studentPassword,
                  introduction:values.studentIntroduction,
                  type:'student'
                };

                AdminStore.addPerson(person).then(response=>{
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
              {getFieldDecorator('studentName', {
                rules: [{ required: true, message: '请输入学生姓名！'}],
              })(
                <Input placeholder="请输入学生姓名" />
              )}
            </FormItem>
            <FormItem
              label="学号"
              hasFeedback>
              {getFieldDecorator('studentNumber', {
                rules: [{ required: true, message: '请输入学号！'}],
              })(
                <Input placeholder="请输入学号"/>
              )}
            </FormItem>
            <FormItem
              label="密码"
              hasFeedback>
              {getFieldDecorator('studentPassword', {
                rules: [{ required: true, message: '请输入密码！'}],
              })(
                <Input placeholder="请输入密码"/>
              )}
            </FormItem>
            <FormItem
              label="简介"
              hasFeedback>
              {getFieldDecorator('studentIntroduction', {
                rules: [{ required: true, message: '请输入学生简介！'}],
              })(
                <Input placeholder="请输入学生简介"/>
              )}
            </FormItem>
            <FormItem
              label="邮箱"
              hasFeedback>
              {getFieldDecorator('studentEmail', {
                rules: [{
                  type: 'email', message: '邮箱格式不正确！',
                }, {
                  required: true, message: '请输入邮箱地址！',
                }],
              })(
                <Input placeholder="请输入学生邮箱"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(CreateStudentModal);
