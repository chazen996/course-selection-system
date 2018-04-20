import {Component} from 'react';
import {Dropdown,Menu,Tabs,Form,Input,Button,Table,message} from 'antd';
import PublicAuthKit from "../utils/PublicAuthKit";
import {observer} from 'mobx-react';
import AdminStore from "../stores/AdminStore";
import EditModal from "../components/admin/EditModal";

// import AdminStore from "../stores/AdminStore";
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
@observer
class AdminPage extends Component{
  constructor(props){
    super(props);

    this.studentsMap = [];
    this.coursesMap = [];
  }

  componentDidMount(){
    AdminStore.loadData();
  }

  editStudent(student){
    AdminStore.setTragetStudent(student);
    AdminStore.setShowEditModl('student');
  }

  editTeacher(teacher){
    AdminStore.setTargetTeacher(teacher);
    AdminStore.setShowEditModl('teacher');
  }
  deletePerson(personId){
    AdminStore.deletePerson(personId).then(response=>{
      if(response){
        message.success('删除成功');
        AdminStore.loadData();
      }else{
        message.error('网络错误，请稍后再试');
      }
    });
  }

  generateChoice=(choices,choiceArray)=>{
    let courses =  PublicAuthKit.deepCopy(AdminStore.getCourses);
    let students = PublicAuthKit.deepCopy(AdminStore.getStudentsBack);
    this.generateMap(students,courses);
    for(let item of choices){
      let choiceItem ={
        key:item.id,
        id:item.id,
        studentName:this.studentsMap[item.studentId].name,
        studentNumber:this.studentsMap[item.studentId].number,
        courseName:this.coursesMap[item.courseId].name,
        courseNumber:this.coursesMap[item.courseId].id
      };
      choiceArray.push(choiceItem);
    }
  };

  generateMap=(students,courses)=>{
    this.studentsMap = [];
    this.coursesMap = [];
    for(let item of students){
      this.studentsMap[item.id]=item;
    }
    for(let item of courses){
      this.coursesMap[item.id]=item;
    }
  };

  deleteChoice=(choiceId)=>{
    AdminStore.deleteChoice(choiceId).then(response=>{
      if(response){
        message.success('删除成功');
        AdminStore.loadData();
      }else{
        message.error('网络错误，请稍后再试');
      }
    });
  };
  searchOnChoice=()=>{
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let studentNumber = values.studentNumber;
        let studentName = values.studentName;
        let courseName = values.courseName;

        let choicesBack = PublicAuthKit.deepCopy(AdminStore.getChoicesBack);
        let choiceArray = [];
        this.generateChoice(choicesBack,choiceArray);
        let flag = true;
        for(let i=0;i<choiceArray.length;i++){
          let item = choiceArray[i];
          if(studentNumber!=null&&studentNumber!==''){
            if(item.studentNumber.toString().indexOf(studentNumber)===-1){
              flag = false;
            }
          }
          if(studentName!=null&&studentName!=='') {
            if(item.studentName.indexOf(studentName)===-1){
              flag = false;
            }
          }
          if(courseName!=null&&courseName!=='') {
            if(item.courseName.indexOf(courseName)===-1){
              flag = false;
            }
          }
          if(!flag){
            choicesBack.splice(i,1);
            choiceArray.splice(i,1);
            i -= 1;
            flag = true;
          }
        }
        AdminStore.setChoices(choicesBack);
      }
    });
  };

  render(){
    /* 学生start */
    const students = PublicAuthKit.deepCopy(AdminStore.getStudents);
    for(let item of students){
      item.key = item.id;
    }

    const studentsColumn = [{
      title: '姓名',
      key: 'name',
      dataIndex:'name',
    },{
      title: '学号',
      key: 'number',
      dataIndex:'number',
    },{
      title: '个人简介',
      key: 'introduction',
      dataIndex:'introduction',
    },{
      title: '邮箱',
      key: 'email',
      dataIndex:'email',
    },{
      title:'操作',
      key:'action',
      render:(text,record)=>(
        <div>
          <a href='javascript:void(0)' style={{marginRight:15}} onClick={this.editStudent.bind(this,record)}>编辑</a>
          <a href='javascript:void(0)' onClick={this.deletePerson.bind(this,record.id)}>删除</a>
        </div>
      )
    }
    ];
    /* 学生end */

    /* 教师start */
    const teachers = PublicAuthKit.deepCopy(AdminStore.getTeachers);
    for(let item of teachers){
      item.key = item.id;
    }

    const teachersColumn = [{
      title: '姓名',
      key: 'name',
      dataIndex:'name',
    },{
      title: '工号',
      key: 'number',
      dataIndex:'number',
    },{
      title: '教师简介',
      key: 'introduction',
      dataIndex:'introduction',
    },{
      title: '邮箱',
      key: 'email',
      dataIndex:'email',
    },{
      title:'操作',
      key:'action',
      render:(text,record)=>(
        <div>
          <a href='javascript:void(0)' style={{marginRight:15}} onClick={this.editTeacher.bind(this,record)}>编辑</a>
          <a href='javascript:void(0)' onClick={this.deletePerson.bind(this,record.id)}>删除</a>
        </div>
      )
    }
    ];
    /* 教师end */

    /* 选课start */
    const choices = AdminStore.getChoices;
    const choiceArray = [];
    this.generateChoice(choices,choiceArray);
    // for(let item of choices){
    //   let choiceItem ={
    //     key:item.id,
    //     studentName:this.studentsMap[item.studentId].name,
    //     studentNumber:this.studentsMap[item.studentId].number,
    //     courseName:this.coursesMap[item.courseId].name,
    //     courseNumber:this.coursesMap[item.courseId].id
    //   };
    //   choiceArray.push(choiceItem);
    // }
    const choiceColumn = [{
      title: '学生姓名',
      key: 'studentName',
      dataIndex:'studentName',
    },{
      title: '学号',
      key: 'studentNumber',
      dataIndex:'studentNumber',
    },{
      title: '课程名称',
      key: 'courseName',
      dataIndex:'courseName',
    },{
      title: '课程代码',
      key: 'courseNumber',
      dataIndex:'courseNumber',
    },{
      title:'操作',
      key:'action',
      render:(text,record)=>(
        <div>
          <a href='javascript:void(0)' onClick={this.deleteChoice.bind(this,record.id)}>删除</a>
        </div>
      )
    }
    ];
    /* 选课end */

    const getFieldDecorator = this.props.form.getFieldDecorator;
    const formItemStyle = {
      width: 150
    };
    return (
      <div style={{
        height:'calc(100vh - 4px)',
        width:'100%'
      }}>
        <EditModal/>

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
            borderBottom:'1px solid #3333'
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

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '87%',
            fontSize: 18
          }}>
            <div>
              <span>学生人数：</span><span style={{color:'#1890ff'}}>{AdminStore.getStudentNumber}</span>
            </div>
            <div>
              <span>教师人数：</span><span style={{color:'#1890ff'}}>{AdminStore.getTeacherNumber}</span>
            </div>
            <div>
              <span>选课纪录数：</span><span style={{color:'#1890ff'}}>{AdminStore.getChoiceNumber}</span>
            </div>
          </div>
        </div>
        <div style={{
          height:'100%',
          width:'69%',
          display:'inline-block'
        }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="学生管理" key="1">
              <div style={{
                height:'calc(100vh - 66px)'
              }}>
                <div style={{
                  height:'15%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <Form layout="inline">
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('studentId')(
                        <Input placeholder="学号" />
                      )}
                    </FormItem>
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('studentName')(
                        <Input placeholder="学生姓名" />
                      )}
                    </FormItem>
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('studentEmail')(
                        <Input placeholder="邮箱" />
                      )}
                    </FormItem>
                    <FormItem>
                      <Button type="primary" onClick={()=>{
                        this.props.form.validateFieldsAndScroll((err, values) => {
                          if(!err) {
                            let studentId = values.studentId;
                            let studentName = values.studentName;
                            let studentEmail = values.studentEmail;

                            let studentsBack = PublicAuthKit.deepCopy(AdminStore.getStudentsBack);
                            let flag = true;
                            for(let i=0;i<studentsBack.length;i++){
                              let item = studentsBack[i];
                              if(studentId!=null&&studentId!==''){
                                if(item.number.toString().indexOf(studentId)===-1){
                                  flag = false;
                                }
                              }
                              if(studentName!=null&&studentName!=='') {
                                if(item.name.indexOf(studentName)===-1){
                                  flag = false;
                                }
                              }
                              if(studentEmail!=null&&studentEmail!=='') {
                                if(item.email.indexOf(studentEmail)===-1){
                                  flag = false;
                                }
                              }
                              if(!flag){
                                studentsBack.splice(i,1);
                                i -= 1;
                                flag = true;
                              }
                            }
                            AdminStore.setStudents(studentsBack);
                          }
                        });
                      }}>搜索</Button>
                      <Button style={{marginLeft:5}} onClick={()=>{
                        this.props.form.resetFields(['studentId','studentName','studentEmail']);
                        AdminStore.setStudents(AdminStore.getStudentsBack);
                      }}>清空</Button>
                    </FormItem>
                  </Form>
                </div>
                <Table dataSource={students} columns={studentsColumn} />
              </div>
            </TabPane>
            <TabPane tab="教师管理" key="2">
              <div style={{
                height:'calc(100vh - 66px)'
              }}>
                <div style={{
                  height:'15%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <Form layout="inline">
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('teacherId')(
                        <Input placeholder="教工号" />
                      )}
                    </FormItem>
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('teacherName')(
                        <Input placeholder="教师姓名" />
                      )}
                    </FormItem>
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('teacherEmail')(
                        <Input placeholder="邮箱" />
                      )}
                    </FormItem>
                    <FormItem>
                      <Button type="primary" onClick={()=>{
                        this.props.form.validateFieldsAndScroll((err, values) => {
                          if(!err) {
                            let teacherId = values.teacherId;
                            let teacherName = values.teacherName;
                            let teacherEmail = values.teacherEmail;

                            let teachersBack = PublicAuthKit.deepCopy(AdminStore.getTeachersBack);
                            let flag = true;
                            for(let i=0;i<teachersBack.length;i++){
                              let item = teachersBack[i];
                              if(teacherId!=null&&teacherId!==''){
                                if(item.number.toString().indexOf(teacherId)===-1){
                                  flag = false;
                                }
                              }
                              if(teacherName!=null&&teacherName!=='') {
                                if(item.name.indexOf(teacherName)===-1){
                                  flag = false;
                                }
                              }
                              if(teacherEmail!=null&&teacherEmail!=='') {
                                if(item.email.indexOf(teacherEmail)===-1){
                                  flag = false;
                                }
                              }
                              if(!flag){
                                teachersBack.splice(i,1);
                                i -= 1;
                                flag = true;
                              }
                            }
                            AdminStore.setTeachers(teachersBack);
                          }
                        });
                      }}>搜索</Button>
                      <Button style={{marginLeft:5}} onClick={()=>{
                        this.props.form.resetFields(['teacherId','teacherName','teacherEmail']);
                        AdminStore.setTeachers(AdminStore.getTeachersBack);
                      }}>清空</Button>
                    </FormItem>
                  </Form>
                </div>
                <Table dataSource={teachers} columns={teachersColumn} />
              </div>
            </TabPane>
            <TabPane tab="选课管理" key="3">
              <div style={{
                height:'calc(100vh - 66px)'
              }}>
                <div style={{
                  height:'15%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <Form layout="inline">
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('studentNumber')(
                        <Input placeholder="学号" />
                      )}
                    </FormItem>
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('studentName')(
                        <Input placeholder="姓名" />
                      )}
                    </FormItem>
                    <FormItem style={formItemStyle}>
                      {getFieldDecorator('courseName')(
                        <Input placeholder="课程名称" />
                      )}
                    </FormItem>
                    <FormItem>
                      <Button type="primary" onClick={this.searchOnChoice}>搜索</Button>
                      <Button style={{marginLeft:5}} onClick={()=>{
                        this.props.form.resetFields(['studentNumber','studentName','courseName']);
                        AdminStore.setChoices(AdminStore.getChoicesBack);
                      }}>清空</Button>
                    </FormItem>
                  </Form>
                </div>
                <Table dataSource={choiceArray} columns={choiceColumn} />
              </div>
            </TabPane>
          </Tabs>

        </div>
      </div>
    );
  }
}

export default  Form.create()(AdminPage);
