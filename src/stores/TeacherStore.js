import { observable,action,computed} from 'mobx';
import axios from 'axios';
import {message} from 'antd';
import PublicAuthKit from "../utils/PublicAuthKit";


class TeacherStore {

  constructor(){
    PublicAuthKit.addAuthHeader();

    this.userId = PublicAuthKit.getItem('userId');
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

  @observable publishedClass = [];

  @observable showCreateCourseModal = false;

  @computed get getShowCreateCourseModal(){
    return this.showCreateCourseModal;
  }

  @computed get getPublishedClass(){
    return this.publishedClass;
  }

  @computed get getHistoryClassDataBack(){
    return this.historyClassDataBack;
  }

  @computed get getHistoryClassData(){
    return this.historyClassData;
  }

  @computed get getClassData(){
    return this.classData;
  }

  @computed get getClassDataBack(){
    return this.classDataBack;
  }

  @computed get getTargetClass(){
    return this.targetClass;
  }

  @computed get getShowClassInfoModal(){
    return this.showClassInfoModal;
  }

  @action setShowCreateCourseModal(status){
    this.showCreateCourseModal = status;
  }

  @action setPublishedClass(publishedClass){
    this.publishedClass = publishedClass;
  }

  @action setHistoryClassDataBack(historyClassDataBack){
    this.historyClassDataBack = historyClassDataBack;
  }

  @action setHistoryClassData(historyClassData){
    this.historyClassData = historyClassData;
  }

  @action setClassDataBack(classDataBack){
    this.classDataBack = classDataBack;
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
    this.getAllDataFromWebServer().then(axios.spread((allCourse,publishedCourse,historyCourse)=>{
      if(allCourse&&publishedCourse&&historyCourse){
        this.setClassData(allCourse.data);
        this.setClassDataBack(allCourse.data);

        this.setPublishedClass(publishedCourse.data);

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
      this.getPublishedCourseFromWebServer(),
      this.getTeacherHistoryCourseFromWebServer()
    ]).catch(err => {
      console.log(err);
    });
  }

  getCourseFromWebServer(){
    return axios.get(`/course`).catch(err=>{
      console.log(err);
    });
  }

  getPublishedCourseFromWebServer(){
    return axios.get(`/course/teacher/${this.userId}`).catch(err=>{
      console.log(err);
    });
  }

  getTeacherHistoryCourseFromWebServer(){
    return axios.get(`/course/teacher/${this.userId}/history`).catch(err=>{
      console.log(err);
    });
  }

  deleteCourse(courseId){
    return axios.delete(`/course/${courseId}`).catch(err=>{
      console.log(err);
    });
  }

  closeCourse(course){
    return axios.put(`/course`,JSON.stringify(course)).catch(err=>{
      console.log(err);
    });
  }

  createCourse(course){
    return axios.post(`/coures`,JSON.stringify(course)).catch(err=>{
      console.log(err);
    })
  }
}
const teacherStore = new TeacherStore();
export default teacherStore;
