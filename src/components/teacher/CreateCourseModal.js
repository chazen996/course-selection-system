import {Component} from 'react'
import {Modal,Form,Input,DatePicker,InputNumber,message} from 'antd';
import TeacherStore from "../../stores/TeacherStore";
import {observer} from 'mobx-react';
import PublicAuthKit from '../../utils/PublicAuthKit';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
@observer
class CreateCourseModal extends Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="发布课程"
        visible={TeacherStore.getShowCreateCourseModal}
        destroyOnClose={true}
        okText='确定'
        cancelText='取消'
        mask={false}
        style={{top:20}}
        onCancel={()=>{
          TeacherStore.setShowCreateCourseModal(false);
        }}
        onOk={()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
              let course = {
                ...values
              };
              course.startTime = values.startAndEndDate[0].format('YYYY-MM-DD HH:mm:ss');
              course.endTime = values.startAndEndDate[1].format('YYYY-MM-DD HH:mm:ss');
              course.state = 'open';
              course.startAndEndDate = null;
              course.teacherId = PublicAuthKit.getItem('userId');
              TeacherStore.createCourse(course).then(response=>{
                if(response){
                  message.success('发布成功');
				   TeacherStore.setShowCreateCourseModal(false);
                  TeacherStore.loadData();
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
            label="课程名称"
            hasFeedback>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入课程名称！'}],
            })(
              <Input placeholder="请输入课程名称" />
            )}
          </FormItem>
          <FormItem
            label="学科类型"
            hasFeedback>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请输入学科名称！'}],
            })(
              <Input placeholder="请输入学科名称" />
            )}
          </FormItem>
          <FormItem
            label="班级人数"
            hasFeedback>
            {getFieldDecorator('maximumOfStudent', {
              rules: [{ required: true, message: '请输入最大班级人数！'}],
              initialValue:40
            })(
              <InputNumber min={1}/>
            )}
          </FormItem>
          <FormItem
            label="起止时间"
            hasFeedback>
            {getFieldDecorator('startAndEndDate', {
              rules: [{ type: 'array', required: true, message: '请选择起止时间！'}],
            })(
              <RangePicker/>
            )}
          </FormItem>
          <FormItem
            label="课程简介"
            hasFeedback>
            {getFieldDecorator('description', {
              rules: [{ required: true, message: '请输入课程简介！' }],
            })(
              <Input.TextArea placeholder="请输入课程简介" autosize={false} rows={4}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CreateCourseModal);
