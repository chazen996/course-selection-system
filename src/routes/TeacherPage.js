import {Component} from 'react';
import {Dropdown,Menu,Input,Tabs,List,Table,Form,Button,Modal,DatePicker,Tag,message} from 'antd';
import TeacherStore from "../stores/TeacherStore";
import {observer} from 'mobx-react';
import PublicAuthKit from "../utils/PublicAuthKit";
import CreateCourseModal from "../components/teacher/CreateCourseModal";
import moment from 'moment';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

require("../assets/css/global.css");

@observer
class TeacherPage extends Component{
  componentDidMount(){
    TeacherStore.loadData();
  }

  generateCourseStatus=(target)=>{
    if(target.maximumOfStudent>target.currentNum){
      return '未满';
    }else{
      return '已满';
    }
  };

  deletedCourse=(courseId)=>{
    TeacherStore.deleteCourse(courseId).then(response=>{
      if(response){
        message.error('撤销成功');
        TeacherStore.loadData();
      }else{
        message.error('网络错误，请稍后再试');
      }
    });
  };

  closeCourse=(target)=>{
    let course = {
      ...target
    };
    course.state = 'close';
    TeacherStore.closeCourse(course).then(response=>{
      if(response){
        message.success('结课成功');
        TeacherStore.loadData();
      }else{
        message.error('网络错误，请稍后再试');
      }
    });
  };
  render(){
    const publishedClass = TeacherStore.getPublishedClass;
    const historyClass = TeacherStore.getHistoryClassData;

    const classData = PublicAuthKit.deepCopy(TeacherStore.getClassData);

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
          TeacherStore.setTargetClass(record);
          TeacherStore.setShowClassInfoModal(true);
        }}>{record.name}</a>
      ),
    }, {
      title: '选课人数',
      key: 'number',
      render: (text, record) => (
        <span>{`${record.currentNum}/${record.maximumOfStudent}`}</span>
      )
    },{
      title:'状态',
      key:'status',
      render:(text,record)=>{
        let status = this.generateCourseStatus(record);
        if(status==='已满'){
          return <Tag color="#bfbfbf">已满</Tag>
        }else if(status==='未满'){
          return <Tag color="#87d068">未满</Tag>;
        }
      }
    }];

    const getFieldDecorator = this.props.form.getFieldDecorator;
    const formItemStyle = {
      width: 150
    };

    const dateFormat = 'YYYY-MM-DD';
    const targetClass = TeacherStore.getTargetClass;
    return (
      <div style={{
        height:'calc(100vh - 4px)',
        width:'100%'
      }}>
        <Modal
          title="课程详情"
          visible={TeacherStore.getShowClassInfoModal}
          footer={null}
          mask={false}
          style={{ top: 20 }}
          destroyOnClose={true}
          onCancel={()=>{
            TeacherStore.setShowClassInfoModal(false);
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

        <CreateCourseModal />

        <div style={{
          height:'100%',
          width:'30%',
          display:'inline-block',
          verticalAlign: 'top',
          borderRight: '1px solid #3333'
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
            <TabPane tab="我发布的课程" key="1">
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <Button type="primary" size='small' style={{margin:"0 14px"}} onClick={()=>{
                  TeacherStore.setShowCreateCourseModal(true);
                }}>发布课程</Button>
              </div>
              <div style={{
                height:'calc(87vh - 84px)',
                overflow:'auto'
              }}>
                {
                  publishedClass.length===0?(
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
                      dataSource={publishedClass}
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
                            <div style={{
                              position:'absolute',right:22
                            }}>
                              <span style={{marginRight:10}}><a href='javascript:void(0)' style={{color:'#ff0000c4'}} onClick={this.deletedCourse.bind(this,item.id)}>撤销</a></span>
                              <span><a href='javascript:void(0)' onClick={this.closeCourse.bind(this,item)}>结课</a></span>
                            </div>
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
                    let historyClassDataBack = PublicAuthKit.deepCopy(TeacherStore.getHistoryClassDataBack);
                    for(let i=0;i<historyClassDataBack.length;i++){
                      let item = historyClassDataBack[i];
                      if(value!=null&&value!==''){
                        if(item.name.indexOf(value)===-1&&item.id.toString().indexOf(value)===-1){
                          historyClassDataBack.splice(i,1);
                          i -= 1;
                        }
                      }
                    }
                    TeacherStore.setHistoryClassData(historyClassDataBack);
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
                          <div style={{
                            width:'100%',
                            position: 'relative',
                            height: 21
                          }}>
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
          height:'100%',
          width:'69%',
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

                      let classDataBack = PublicAuthKit.deepCopy(TeacherStore.getClassDataBack);
                      let flag = true;
                      for(let i=0;i<classDataBack.length;i++){
                        let item = classDataBack[i];
                        if(teacherCondition!=null&&teacherCondition!==''){
                          if(item.person.name.indexOf(teacherCondition)===-1){
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
                      TeacherStore.setClassData(classDataBack);
                    }
                  });
                }}>搜索</Button>
                <Button style={{marginLeft:5}} onClick={()=>{
                  this.props.form.resetFields(['teacher','subject','classNameForSearch']);
                  TeacherStore.setClassData(TeacherStore.getClassDataBack);
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

export  default Form.create()(TeacherPage);
