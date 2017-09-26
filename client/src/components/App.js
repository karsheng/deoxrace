import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Landing from './Landing';
import RacePage from './races/RacePage';

import Profile from './user/Profile';
import EditProfile from './user/EditProfile';

import Signin from './auth/Signin';
import Signup from './auth/Signup';
import Signout from './auth/Signout';
import RequireAuth from './auth/RequireAuth';

import ParticipantForm from './registration/ParticipantForm';
import CategorySelection from './registration/CategorySelection';

const App = () => {
	return (
		<div className="container">
			<MuiThemeProvider>
				<BrowserRouter>
					<div>
						<Header />
						<Route exact path="/" component={Landing} />
						<Route
							path="/registration/participant/:race_id"
							component={ParticipantForm}
						/>
						<Route
							path="/registration/category/:race_id"
							component={CategorySelection}
						/>
						<Route path="/race/:race_id" component={RacePage} />
						<Route
							exact
							path="/profile/edit"
							component={RequireAuth(EditProfile)}
						/>
						<Route exact path="/profile" component={RequireAuth(Profile)} />
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
