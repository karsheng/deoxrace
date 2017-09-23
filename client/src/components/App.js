import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Landing from './Landing';
import RacePage from './races/RacePage';
import Signin from './auth/Signin';
import Signup from './auth/Signup';
import Signout from './auth/Signout';

const App = () => {
	return (
		<div className="container">
			<MuiThemeProvider>
				<BrowserRouter>
					<div>
						<Header />
						<Route exact path="/" component={Landing} />
						<Route path="/race/:race_id" component={RacePage} />
						<Route path="/signin" component={Signin} />
						<Route path="/signup" component={Signup} />
						<Route path="/signout" component={Signout} />
					</div>
				</BrowserRouter>
			</MuiThemeProvider>
		</div>
	);
};

export default App;
