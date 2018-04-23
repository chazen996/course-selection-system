import {Component} from 'react';
import {Modal,Form,Input,message,DatePicker,InputNumber} from 'antd';
import AdminStore from "../../stores/AdminStore";
import {observer} from 'mobx-react';
import moment from 'moment';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@observer
class EditModal extends Component{

  render (){
    const getFieldDecorator = this.props.form.getFieldDecorator;

    const targetStudent = AdminStore.getTargetStudent;
    const targetTeacher = AdminStore.getTargetTeacher;
    const targetCourse = AdminStore.getTargetCourse;

    const dateFormat = 'YYYY-MM-DD';
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
              if(err.studentName==null&&err.studentNumber==null&&err.studentIntroduction==null&&err.studentEmail==null){
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
              if(err.teacherName==null&&err.teacherNumber==null&&err.teacherIntroduction==null&&err.teacherEmail==null){
                let person = {
                  ...values,
                  id:targetCourse.id
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
        <Modal
          title="课程信息"
          visible={AdminStore.getShowEditModal==='course'}
          mask={false}
          style={{ top: 20 }}
          destroyOnClose={true}
          onCancel={()=>{
            AdminStore.setShowEditModl(null);
          }}
          onOk={()=>{
            this.props.form.validateFieldsAndScroll((err, values) => {
              if(err.className==null&&err.classType==null&&err.startAndEndDate==null&&err.description==null&&err.maximumOfStudent==null){
                let course = {
                  name:values.className,
                  type:values.classType,
                  startTime:values.startAndEndDate[0].format('YYYY-MM-DD HH:mm:ss'),
                  endTime:values.startAndEndDate[1].format('YYYY-MM-DD HH:mm:ss'),
                  teacherId:targetCourse.teacherId,
                  state:targetCourse.state,
                  maximumOfStudent:values.maximumOfStudent,
                  description:values.description,
                  id:targetCourse.id,
                };

                AdminStore.updateCourse(course).then(response=>{
                  if(response){
                    message.success('修改成功');
                    AdminStore.setShowEditModl(false);
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
              label="课程名称">
              {getFieldDecorator('c', {
                initialValue:targetCourse.name,
              })(
                <Input placeholder="请输入课程名称"/>
              )}
            </FormItem>
            <FormItem
              label="学科类型"
              hasFeedback>
              {getFieldDecorator('classType', {
                rules: [{ required: true, message: '请输入学科名称！'}],
                initialValue:targetCourse.type
              })(
                <Input placeholder="请输入学科名称" />
              )}
            </FormItem>
            <FormItem
              label="班级人数"
              hasFeedback>
              {getFieldDecorator('maximumOfStudent', {
                rules: [{ required: true, message: '请输入最大班级人数！'}],
                initialValue:targetCourse.maximumOfStudent
              })(
                <InputNumber min={1}/>
              )}
            </FormItem>
            <FormItem
              label="教师名称">
              {getFieldDecorator('teacherName', {
                initialValue:targetCourse.person.name,
              })(
                <Input placeholder="请输入教师名称" disabled/>
              )}
            </FormItem>
            <FormItem
              label="起止时间">
              {getFieldDecorator('startAndEndDate', {
                initialValue: [moment(targetCourse.startTime, dateFormat), moment(targetCourse.endTime, dateFormat)],
              })(
                <RangePicker disabled onChange={(date, dateString)=>{
                  console.log(date, dateString);
                }} />
              )}
            </FormItem>
            <FormItem
              label="课程简介">
              {getFieldDecorator('description', {
                initialValue:targetCourse.description,
              })(
                <Input.TextArea placeholder="请输入任务详情" autosize={false} rows={4}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(EditModal);
