import { observable,action,computed} from 'mobx';
import {message} from 'antd';
import axios from 'axios';
import PublicAuthKit from '../utils/PublicAuthKit';

class StudentStore {
  constructor(){
    PublicAuthKit.addAuthHeader();

    //this.userId = PublicAuthKit.getItem('userId');
  }
  @observable showClassInfoModal = false;
  @observable targetClass = {
    person:{

    }
  };

  @observable classData = [];
  @observable classDataBack = [];

  @observable historyClassData = [];
  @observable historyClassDataBack = [];

  @observable selectedClass = [];

  @computed get getSelectedClass(){
    return this.selectedClass;
  }

  @computed get getHistoryClassDataBack(){
    return this.historyClassDataBack;
  }

  @computed get getHistoryClassData(){
    return this.historyClassData;
  }

  @computed get getClassDataBack(){
    return this.classDataBack;
  }

  @computed get getClassData(){
    return this.classData;
  }

  @computed get getTargetClass(){
    return this.targetClass;
  }

  @computed get getShowClassInfoModal(){
    return this.showClassInfoModal;
  }

  @action setSelectedClass(selectedClass){
    this.selectedClass = selectedClass;
  }

  @action setHistoryClassDataBack(historyClassData){
    this.historyClassDataBack = historyClassData;
  }

  @action setHistoryClassData(historyClassData){
    this.historyClassData = historyClassData;
  }

  @action setClassDataBack(classData){
    this.classDataBack = classData;
  }

  @action setClassData(classData){
    this.classData = classData;
  }

  @action setTargetClass(targetClass){
    this.targetClass = targetClass;
  }

  @action setShowClassInfoModal(status){
    this.showClassInfoModal = status;
  }

  loadData(){
    this.getAllDataFromWebServer().then(axios.spread((allCourse,studentCourse,historyCourse)=>{
      if(allCourse&&studentCourse&&historyCourse){
        this.setClassData(allCourse.data);
        this.setClassDataBack(allCourse.data);

        this.setSelectedClass(studentCourse.data);

        this.setHistoryClassData(historyCourse.data);
        this.setHistoryClassDataBack(historyCourse.data);
      }else{
        message.error('网络错误，请稍后再试');
      }
    }));
  }

  getAllDataFromWebServer() {
    return axios.all([
      this.getCourseFromWebServer(),
      this.getStudentCourseFromWebServer(),
      this.getStudentHistoryCourseFromWebServer()
    ]).catch(err => {
      console.log(err);
    });
  }

  getCourseFromWebServer(){
    return axios.get(`/course/open`).catch(err=>{
      console.log(err);
    });
  }

  getStudentCourseFromWebServer(){
    return axios.get(`/course/student/${PublicAuthKit.getItem('userId')}`).catch(err=>{
      console.log(err);
    });
  }
  getStudentHistoryCourseFromWebServer(){
    return axios.get(`/course/student/${PublicAuthKit.getItem('userId')}/history`)
  }

  deleteClass(classId){
    return axios.delete(`/choice/${PublicAuthKit.getItem('userId')}/${classId}`).then(err=>{
      console.log(err);
    });
  }

  makeChoice(classId){
    let choice = {
      courseId:classId,
      userId:PublicAuthKit.getItem('userId')
    };
    return axios.post(`/choice`,JSON.stringify(choice)).catch(err=>{
      console.log(err);
    });
  }
}
const studentStore = new StudentStore();
export default studentStore;
