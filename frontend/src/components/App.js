import React from 'react';
// import logo from './logo.svg';
import { Component } from 'react';
import '../styles/App.css';
import LinkList from './LinkList'
import CreateLink from './CreateLink';
import Header from './Header'
import Login from './Login'
import { Switch, Route } from 'react-router-dom'
import Search from './Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

class App extends Component {

  render() {
    // const ps = new PerfectScrollbar('#container', {
    //   wheelSpeed: 2,
    //   wheelPropagation: true,
    //   minScrollbarLength: 20
    // });
    return (
      <PerfectScrollbar
              id="top"
              // onScrollY={container => console.log(`scrolled to: ${container.scrollTop}.`)}
              className="w95">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/home" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Login} />
            <Route exact path="/search" component={Search} />
          </Switch>
        </div>
      </PerfectScrollbar>
    )
  }
}

export default App