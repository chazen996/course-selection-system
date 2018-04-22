import {Component} from 'react';
import {Modal,Form,Input,message} from 'antd';
import AdminStore from "../../stores/AdminStore";
import {observer} from 'mobx-react';

const FormItem = Form.Item;

@observer
class EditModal extends Component{

  render (){
    const getFieldDecorator = this.props.form.getFieldDecorator;

    const targetStudent = AdminStore.getTargetStudent;

    const targetTeacher = AdminStore.getTargetTeacher;

    return (
      <div>
        <Modal
          title="学生信息"
          visible={AdminStore.getShowEditModal==='student'}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          mask={false}
          style={{top:20}}
          onCancel={()=>{
            AdminStore.setShowEditModl(null);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                let person = {
                  ...values,
                  id:targetStudent.id
                };

                AdminStore.updatePerson(person).then(response=>{
                  if(response){
                    message.success('修改成功');
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
                initialValue:targetStudent.name
              })(
                <Input placeholder="请输入学生姓名" />
              )}
            </FormItem>
            <FormItem
              label="学号"
              hasFeedback>
              {getFieldDecorator('studentNumber', {
                rules: [{ required: true, message: '请输入学号！'}],
                initialValue:targetStudent.number
              })(
                <Input placeholder="请输入学号" disabled/>
              )}
            </FormItem>
            <FormItem
              label="简介"
              hasFeedback>
              {getFieldDecorator('studentIntroduction', {
                rules: [{ required: true, message: '请输入学生简介！'}],
                initialValue:targetStudent.introduction
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
                initialValue:targetStudent.email
              })(
                <Input placeholder="请输入学生邮箱"/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="教师信息"
          visible={AdminStore.getShowEditModal==='teacher'}
          destroyOnClose={true}
          okText='确定'
          cancelText='取消'
          mask={false}
          style={{top:20}}
          onCancel={()=>{
            AdminStore.setShowEditModl(null);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(!err){
                let person = {
                  ...values,
                  id:targetTeacher.id
                };

                AdminStore.updatePerson(person).then(response=>{
                  if(response){
                    message.success('修改成功');
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
                initialValue:targetTeacher.name
              })(
                <Input placeholder="请输入教师姓名" />
              )}
            </FormItem>
            <FormItem
              label="工号"
              hasFeedback>
              {getFieldDecorator('teacherNumber', {
                rules: [{ required: true, message: '请输入工号！'}],
                initialValue:targetTeacher.number
              })(
                <Input placeholder="请输入工号" disabled/>
              )}
            </FormItem>
            <FormItem
              label="简介"
              hasFeedback>
              {getFieldDecorator('teacherIntroduction', {
                rules: [{ required: true, message: '请输入教师简介！'}],
                initialValue:targetTeacher.introduction
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
                }],
                initialValue:targetTeacher.email
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

export default Form.create()(EditModal);
