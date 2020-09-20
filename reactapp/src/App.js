import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import ScreenHome from './ScreenHome';
import ScreenSource from './ScreenSource';
import ScreenArticlesBySource from './ScreenArticlesBySource';
import ScreenMyArticles from './ScreenMyArticles';

import wishlist from './reducers/article';
import token from './reducers/token';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

const store = createStore(combineReducers({wishlist, token}));

function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" exact component={ScreenHome} />
            <Route path="/screensource" component={ScreenSource} />
            <Route path="/screenarticlesbysource/:id" component={ScreenArticlesBySource} />
            <Route path="/screenmyarticles" component={ScreenMyArticles} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
