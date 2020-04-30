import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import { GlobalProvider } from './context/Global';
import { GameProvider } from './context/Game';
import './styling/global.scss';

const App = () => {
	return (
		<GlobalProvider>
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route
						exact
						path="/game/:roomcode"
						render={() => (
							<GameProvider>
								<Game />
							</GameProvider>
						)}
					/>
					<Route path="*" render={() => <Redirect to="/" />} />
				</Switch>
			</Router>
		</GlobalProvider>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
