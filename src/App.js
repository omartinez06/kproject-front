import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ListKyuComponent from './components/Kyus/ListKyuComponent';
import ListTrainerComponent from './components/Trainers/ListTrainerComponent';
import ListScheduleComponent from './components/Schedule/ListScheduleComponent';
import ListStudentComponent from './components/Students/ListStudentComponent';
import ListPaymentComponent from './components/Payment/ListPaymentComponent';
import GymLogin from './components/LoginRegister/GymLogin';
import GymRegister from './components/LoginRegister/GymRegister'
import Events from './components/Events/ListEventsComponent';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div>
      <Router>
        <div className='container'>
          <Switch>
            <Route exact path="/" component={GymLogin}></Route>
            <Route exact path="/register" component={GymRegister}></Route>
            <Route path="/kyu" component={ListKyuComponent}></Route>
            <Route path="/trainer" component={ListTrainerComponent}></Route>
            <Route path="/schedule" component={ListScheduleComponent}></Route>
            <Route path="/student" component={ListStudentComponent}></Route>
            <Route path="/payment" component={ListPaymentComponent}></Route>
            <Route path="/event" component={Events}></Route>
            <Route path="/dashboard" component={Dashboard}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
