// import dva from 'dva';
//
// // 1. Initialize
// const app = dva();
//
// // 2. Plugins
// // app.use({});
//
// // 3. Model
// // app.model(require('./models/example').default);
//
// // 4. Router
// app.router(require('./router').default);
//
// // 5. Start
// app.start('#root');


/*import dva from 'dva';

// 1. Initialize
/*const app = dva();*/

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
/*app.router(require('./router').default);*/

// 5. Start
/*app.start('#root');*/
// import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter,Route } from 'react-router-dom';
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
// import Example from "./components/Example";
// import Test2 from "./components/Test2";
import LoginPage from "./routes/LoginPage";
import StudentPage from "./routes/StudentPage";
import TeacherPage from "./routes/TeacherPage";
import AdminPage from "./routes/AdminPage";
import AuthRoute from "./components/public/AuthRoute";
// import HomePage from "./routes/HomePage";
// import RegisterPage from "./routes/RegisterPage";
// import ProjectPage from "./routes/ProjectPage";
// import KanbanPage from "./routes/KanbanPage";
// import EditKanbanPage from "./routes/EditKanbanPage";
// import Head from "./components/public/Head";
// import Card from "./components/kanban/StagingArea";

ReactDom.render((
  <div>
    <LocaleProvider locale={zh_CN}>
      <BrowserRouter>
        <div>
          <Route exact path='/' component={LoginPage}/>
          <Route path='/login' component={LoginPage}/>
          <AuthRoute path='/student' component={StudentPage}/>
          <AuthRoute path='/teacher' component={TeacherPage}/>
          <AuthRoute path='/admin' component={AdminPage}/>
        </div>
      </BrowserRouter>
    </LocaleProvider>
  </div>
),document.getElementById("root"));
