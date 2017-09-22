import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './Landing';

const App = () => {
	return (
		<div className="container">
			<MuiThemeProvider>
				<BrowserRouter>
					<div>
						<Route exact path="/" component={Landing} />
					</div>
				</BrowserRouter>
			</MuiThemeProvider>
		</div>
	);
};

export default App;
