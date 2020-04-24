import React, { useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import { GlobalProvider } from './context/Global';
import './styling/global.scss';

const App = () => {
	return (
		<GlobalProvider>
			<Router>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/game">
						<h1>Game</h1>
					</Route>
					<Route>
						<Redirect to="/" />
					</Route>
				</Switch>
			</Router>
		</GlobalProvider>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
