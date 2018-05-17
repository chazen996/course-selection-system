import {Component} from 'react';
import {Dropdown,Menu,Tabs,List,Input,Table,Tag,Form,Button,Modal,message,DatePicker} from 'antd';
import {observer} from 'mobx-react';
import PublicAuthKit from '../utils/PublicAuthKit';

import StudentStore from '../stores/StudentStore';
import moment from 'moment';

require("../assets/css/global.css");


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@observer
class StudentPage extends Component{
  componentDidMount(){
    StudentStore.loadData();
  }

  deleteClass(classId){
    StudentStore.deleteClass(classId).then(response=>{
		message.success('退课成功');
        StudentStore.loadData();

    });
  }
  makeChoice(classId){
    StudentStore.makeChoice(classId).then(response=>{
      if(response){
        StudentStore.loadData();
      }else{
        message.error('网络错误，请稍后再试');
      }
    });
  }
  generateCourseStatus=(target)=>{
    let studentClass = StudentStore.getSelectedClass;
    let flag = false;
    for(let item of studentClass){
      if(item.id===target.id){
        return '已选';
      }
    }
    if(!flag){
      if(target.maximumOfStudent>target.currentNum){
        return '可选';
      }else{
        return '已满';
      }
    }
  };
  render(){
    const selectedClass = StudentStore.getSelectedClass;

    const historyClass = StudentStore.getHistoryClassData;
    const classData = PublicAuthKit.deepCopy(StudentStore.getClassData);

    for(let item of classData){
      item.key = item.id;
    }

    const columns = [{
      title: '任课老师',
      key: 'person',
      render:(text,record)=>(
        <span>{record.person.name}</span>
      )
    }, {
      title: '学科类别',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '课程名称',
      key: 'name',
      render:(text, record)=>(
        <a href='javascript:void(0)' onClick={()=>{
          StudentStore.setTargetClass(record);
          StudentStore.setShowClassInfoModal(true);
        }}>{record.name}</a>
      ),
    }, {
      title: '选课人数',
      key: 'number',
      render: (text, record) => (
        <span>{`${record.currentNum}/${record.maximumOfStudent}`}</span>
      )
    },{
      title: '状态',
      key: 'state',
      render:(text,record)=> {
        if(this.generateCourseStatus(record) === '已选'){
          return <Tag color="#2db7f5">已选</Tag>;
        }else if(this.generateCourseStatus(record) === '可选'){
          return <Tag color="#87d068">可选</Tag>;
        }else if(this.generateCourseStatus(record) === '已满'){
          return <Tag color="#bfbfbf">已满</Tag>
        }
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        this.generateCourseStatus(record)!=='可选'?(
          <span style={{
            color: 'rgba(0,0,0,0.45)',
            cursor:'not-allowed'
          }}>选课</span>
        ):(
          <span style={{
            color: '#40a9ff',
            cursor:'pointer'
          }} onClick={this.makeChoice.bind(this,record.id)}>选课</span>
        )
      ),
    }
    ];

    const getFieldDecorator = this.props.form.getFieldDecorator;
    const formItemStyle = {
      width: 150
    };

    const dateFormat = 'YYYY-MM-DD';
    const targetClass = StudentStore.getTargetClass;
    return (
      <div>
        <Modal
          title="课程详情"
          visible={StudentStore.getShowClassInfoModal}
          footer={null}
          mask={false}
          style={{ top: 20 }}
          destroyOnClose={true}
          onCancel={()=>{
            StudentStore.setShowClassInfoModal(false);
          }}
        >
          <Form>
            <FormItem
              label="课程名称">
              {getFieldDecorator('className', {
                initialValue:targetClass.name,
              })(
                <Input placeholder="请输入课程名称" disabled/>
              )}
            </FormItem>
            <FormItem
              label="教师名称">
              {getFieldDecorator('teacherName', {
                initialValue:targetClass.person.name,
              })(
                <Input placeholder="请输入教师名称" disabled/>
              )}
            </FormItem>
            <FormItem
              label="起止时间">
              {getFieldDecorator('startAndEndDate', {
                initialValue: [moment(targetClass.startTime, dateFormat), moment(targetClass.endTime, dateFormat)],
              })(
                <RangePicker disabled onChange={(date, dateString)=>{
                  console.log(date, dateString);
                }} />
              )}
            </FormItem>
            <FormItem
              label="课程简介">
              {getFieldDecorator('description', {
                initialValue:targetClass.description,
              })(
                <Input.TextArea placeholder="请输入任务详情" autosize={false} rows={4} disabled/>
              )}
            </FormItem>
          </Form>
        </Modal>


        <div style={{
          width:'30%',
          height:'calc(100vh - 4px)',
          display:'inline-block',
          borderRight:'1px solid #3333',
          verticalAlign:'top'
        }}>
          <div style={{
            height: '13%',
            display: 'flex',
            justifyContent:  'center',
            alignItems:  'center',
            borderBottom: '1px solid rgba(51, 51, 51, 0.2)'
          }}>
            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <a href='javascript:void(0)' onClick={()=>{
                    PublicAuthKit.removeItem('username');
                    PublicAuthKit.removeItem('userId');
                    PublicAuthKit.removeItem('type');
                    this.props.history.push("/login");
                  }}>注销登陆</a>
                </Menu.Item>
              </Menu>
            }>
                <span style={{
                  fontSize:  25,
                  color: '#40a9ff',
                  cursor:'pointer'
                }}>{PublicAuthKit.getItem('username')}</span>
            </Dropdown>
          </div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="已选课程" key="1">
              <div style={{
                height:'calc(87vh - 60px)',
                overflow:'auto'
              }}>
                {
                  selectedClass.length===0?(
                    <div style={{
                      height: 400,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <span style={{color:'rgba(0,0,0,0.45)',fontSize:18}}>暂无内容</span>
                    </div>
                  ):(
                    <List
                      itemLayout="horizontal"
                      dataSource={selectedClass}
                      renderItem={item => (
                        <List.Item>
                          <div style={{
                            width:'100%',
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <span style={{position:'absolute',left:17}}>{item.name}</span>
                            <span>{item.id}</span>
                            <span style={{position:'absolute',right:22}}><a href='javascript:void(0)' style={{color: 'rgba(255, 0, 0, 0.77)'}} onClick={this.deleteClass.bind(this,item.id)}>退课</a></span>
                          </div>
                        </List.Item>
                      )}
                    />
                  )
                }

              </div>
            </TabPane>
            <TabPane tab="历史课程" key="2">
              <div style={{
                height:'calc(87vh - 60px)',
                overflow:'auto'
              }}>
                <div>
                  <Input.Search placeholder="请输入课程名称或课程代码" onChange={(event)=>{
                    let value = event.target.value;
                    let historyClassDataBack = PublicAuthKit.deepCopy(StudentStore.getHistoryClassDataBack);
                    for(let i=0;i<historyClassDataBack.length;i++){
                      let item = historyClassDataBack[i];
                      if(value!=null&&value!==''){
                        if(item.name.indexOf(value)===-1&&item.id.toString().indexOf(value)===-1){
                          historyClassDataBack.splice(i,1);
                          i -= 1;
                        }
                      }
                    }
                    StudentStore.setHistoryClassData(historyClassDataBack);
                  }}>

                  </Input.Search>
                </div>
                {
                  historyClass.length===0?(
                    <div style={{
                      height: 400,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <span style={{color:'rgba(0,0,0,0.45)',fontSize:18}}>暂无内容</span>
                    </div>
                  ):(
                    <List
                      itemLayout="horizontal"
                      dataSource={historyClass}
                      renderItem={item => (
                        <List.Item>
                          <div style={{width:'100%',
                            position: 'relative',
                            height: 21}}>
                            <span style={{color:'rgba(0,0,0,0.45)',position:'absolute',left:69}}>{item.name}</span>
                            <span style={{color:'rgba(0,0,0,0.45)',position:'absolute',right:69}}>{item.id}</span>
                          </div>
                        </List.Item>
                      )}
                    />
                  )
                }
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div style={{
          width:'69%',
          height:'calc(100vh - 4px)',
          display:'inline-block'
        }}>
          <div style={{
            height:'15%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <Form layout="inline">
              <FormItem style={formItemStyle}>
                {getFieldDecorator('teacher')(
                  <Input placeholder="任课教师" />
                )}
              </FormItem>
              <FormItem style={formItemStyle}>
                {getFieldDecorator('subject')(
                  <Input placeholder="学科类别" />
                )}
              </FormItem>
              <FormItem style={formItemStyle}>
                {getFieldDecorator('classNameForSearch')(
                  <Input placeholder="课程名称" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={()=>{
                  this.props.form.validateFieldsAndScroll((err, values) => {
                    if(!err) {
                      let teacherCondition = values.teacher;
                      let subjectCondition = values.subject;
                      let classNameCondition = values.classNameForSearch;

                      let classDataBack = PublicAuthKit.deepCopy(StudentStore.getClassDataBack);
                      let flag = true;
                      for(let i=0;i<classDataBack.length;i++){
                        let item = classDataBack[i];
                        if(teacherCondition!=null&&teacherCondition!==''){
                          if(item.person==null||item.person.name.indexOf(teacherCondition)===-1){
                            flag = false;
                          }
                        }
                        if(subjectCondition!=null&&subjectCondition!=='') {
                          if(item.type.indexOf(subjectCondition)===-1){
                            flag = false;
                          }
                        }
                        if(classNameCondition!=null&&classNameCondition!=='') {
                          if(item.name.indexOf(classNameCondition)===-1){
                            flag = false;
                          }
                        }
                        if(!flag){
                          classDataBack.splice(i,1);
                          i -= 1;
                          flag = true;
                        }
                      }
                      StudentStore.setClassData(classDataBack);
                    }
                  });
                }}>搜索</Button>
                <Button style={{marginLeft:5}} onClick={()=>{
                  this.props.form.resetFields(['teacher','subject','classNameForSearch']);
                  StudentStore.setClassData(StudentStore.getClassDataBack);
                }}>清空</Button>
              </FormItem>
            </Form>
          </div>
          <Table dataSource={classData} columns={columns} />
        </div>

      </div>
    );
  }

}

export default  Form.create()(StudentPage);
