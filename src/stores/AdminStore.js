import { observable,action,computed} from 'mobx';
import axios from 'axios';
import {message} from 'antd';
import PublicAuthKit from "../utils/PublicAuthKit";

class AdminStore{
  constructor(){
    PublicAuthKit.addAuthHeader();

    this.userId = PublicAuthKit.getItem('userId');
  }
  @observable students = [];
  @observable studentsBack = [];
  @observable studentNumber = 0;

  @observable showEditModal = null;

  @observable targetStudent = {};

  @observable teachers = [];
  @observable teachersBack = [];
  @observable teacherNumber = 0;

  @observable targetTeacher = {};

  @observable choices = [];
  @observable choicesBack = [];

  @observable choiceNumber = 0;

  @observable courses = [];

  @observable showCreateStudentModal = false;

  @observable showCreateTeacherModal = false;

  @computed get getShowCreateTeacherModal(){
    return this.showCreateTeacherModal;
  }

  @computed get getShowCreateStudentModal(){
    return this.showCreateStudentModal;
  }

  @computed get getStudentNumber(){
    return this.studentNumber;
  }

  @computed get getTeacherNumber(){
    return this.teacherNumber;
  }

  @computed get getChoiceNumber(){
    return this.choiceNumber;
  }

  @computed get getCourses(){
    return this.courses;
  }

  @computed get getChoices(){
    return this.choices;
  }

  @computed get getChoicesBack(){
    return this.choicesBack;
  }

  @computed get getTargetTeacher(){
    return this.targetTeacher;
  }

  @computed get getTeachersBack(){
    return this.teachersBack;
  }

  @computed get getTeachers(){
    return this.teachers;
  }

  @computed get getTargetStudent(){
    return this.targetStudent;
  }

  @computed get getShowEditModal(){
    return this.showEditModal;
  }

  @computed get getStudentsBack(){
    return this.studentsBack;
  }

  @computed get getStudents(){
    return this.students;
  }

  @action setShowCreateTeacherModal(status){
    this.showCreateTeacherModal = status;
  }

  @action setShowCreateStudentModal(status){
    this.showCreateStudentModal = status;
  }

  @action setStudentNumber(number){
    this.studentNumber = number;
  }

  @action setTeacherNumber(number){
    this.teacherNumber = number;
  }

  @action setChoiceNumber(number){
    this.choiceNumber = number;
  }

  @action setCourses(courses){
    this.courses = courses;
  }

  @action setChoices(choices){
    this.choices = choices;
  }

  @action setChoicesBack(choices){
    this.choicesBack = choices;
  }

  @action setTargetTeacher(teacher){
    this.targetTeacher = teacher;
  }

  @action setTeachers(teachers){
    this.teachers = teachers;
  }

  @action setTeachersBack(teachers){
    this.teachersBack = teachers;
  }

  @action setTragetStudent(student){
    this.targetStudent = student;
  }

  @action setShowEditModl(status){
    this.showEditModal = status;
  }

  @action setStudentsBack(students){
    this.studentsBack = students;
  }

  @action setStudents(students){
    this.students = students;
  }

  loadData(){
    this.getAllDataFromWebServer().then(axios.spread((students,teachers,choices,courses)=>{
      if(students&&teachers&&choices&&courses){
        this.setStudents(students.data);
        this.setStudentsBack(students.data);

        this.setTeachers(teachers.data);
        this.setTeachersBack(teachers.data);

        this.setChoices(choices.data);
        this.setChoicesBack(choices.data);

        this.setCourses(courses.data);

        this.setStudentNumber(students.data.length);
        this.setTeacherNumber(teachers.data.length);
        this.setChoiceNumber(choices.data.length);

      }else{
        message.error('网络错误，请稍后再试');
      }
    }));
  }

  getAllDataFromWebServer() {
    return axios.all([
      this.getStudentsFromWebServer(),
      this.getTeachersFromWebServer(),
      this.getChoicesFromWebServer(),
      this.getCoursesFromWebServer()
    ]).catch(err => {
      console.log(err);
    });
  }

  getStudentsFromWebServer(){
    return axios.get(`/person/student`).catch(err=>{
      console.log(err);
    });
  }

  getTeachersFromWebServer(){
    return axios.get(`/person/teacher`).catch(err=>{
      console.log(err);
    });
  }

  getChoicesFromWebServer(){
    return axios.get(`/choice`).catch(err=>{
      console.log(err);
    })
  }

  getCoursesFromWebServer(){
    return axios.get(`/course`).catch(err=>{
      console.log(err);
    });
  }

  updatePerson(person){
    return axios.put(`/person`,JSON.stringify(person)).catch(err=>{
      console.log(err);
    });
  }

  deletePerson(personId){
    return axios.delete(`/person/${personId}`).catch(err=>{
      console.log(err);
    });
  }

  deleteChoice(choiceId){
    return axios.delete(`/choice/${choiceId}`).catch(err=>{
      console.log(err);
    });
  }

  addPerson(student){
    return axios.post(`/person`,JSON.stringify(student)).catch(err=>{
      console.log(err);
    });
  }
}
const adminStore = new AdminStore();
export default adminStore;
