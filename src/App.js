import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import ListKyuComponent from './components/Kyus/ListKyuComponent';
import ListTrainerComponent from './components/Trainers/ListTrainerComponent';
import ListScheduleComponent from './components/Schedule/ListScheduleComponent';
import ListStudentComponent from './components/Students/ListStudentComponent';
import GymLoginRegister from './components/LoginRegister/GymLoginRegister';

function App() {
  return (
    <div>
      <Router>
        <HeaderComponent />
        <div className='container'>
          <Switch>
            <Route exact path="/" component={GymLoginRegister}></Route>
            <Route path="/kyu" component={ListKyuComponent}></Route>
            <Route path="/trainer" component={ListTrainerComponent}></Route>
            <Route path="/schedule" component={ListScheduleComponent}></Route>
            <Route path="/student" component={ListStudentComponent}></Route>
          </Switch>
        </div>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;
