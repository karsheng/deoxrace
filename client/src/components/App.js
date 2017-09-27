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
import MealSelection from './registration/MealSelection';
import Checkout from './registration/Checkout';
import Payment from './registration/Payment';
import Confirmation from './registration/Confirmation';

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
							component={RequireAuth(ParticipantForm)}
						/>
						<Route
							path="/registration/category/:race_id"
							component={RequireAuth(CategorySelection)}
						/>
						<Route
							path="/registration/meal/:race_id"
							component={RequireAuth(MealSelection)}
						/>
						<Route
							path="/registration/checkout/:race_id"
							component={RequireAuth(Checkout)}
						/>
						<Route
							path="/registration/payment/:registration_id"
							component={RequireAuth(Payment)}
						/>
						<Route
							path="/registration/confirmation/:registration_id"
							component={RequireAuth(Confirmation)}
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
