import React, { useState, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

import QuizResults from 'modules/components/Quiz/QuizResults';
import Quiz from 'modules/components/Quiz';
import Home from 'modules/pages/Home';
import AppShell from './AppShell';

///lazy load your pages
//const Home = lazy(() => import ('modules/pages/Home'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Put a loading component here...</div>}>
      <Switch>

        <Route path="/results">
          <AppShell>
            <QuizResults results={null} />
          </AppShell>
        </Route>

        <Route path="/quiz-mood">
            <Quiz />
        </Route>

        <Route exact path="/">
            <Home />
        </Route>

        <Route path="*">
            <div>404 page component here</div>
        </Route>

      </Switch>
    </Suspense>
  )
}

const App = () => {
  
  return (
      <Router>
          <AppRoutes />
      </Router>
  )
}

export default App;