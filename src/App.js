import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import Home from './components/pages/Home';
import Logs from './components/pages/Logs';
import Memes from './components/pages/Memes';

// main entry point

function App() {
  return (

    <>
    <Router>
      <Navbar />
        <Switch>
          <Route path='/' exact component= {Home} />
          <Route path='/logs' exact component= {Logs} />
          <Route path='/memes' exact component= {Memes} />
   </Switch>

        </Router>

    </>
  );
}

export default App;
