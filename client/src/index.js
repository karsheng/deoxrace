import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import { FETCH_USER, AUTH_USER, OPEN_SNACKBAR } from './actions/types';
import axios from 'axios';
import reducers from './reducers';
import App from './components/App';
import './style/bootstrap.min.css';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

const token = localStorage.getItem('deotoken');

if (token) {
	const config = {
		headers: { authorization: token }
	};
	axios
		.get(`/api/user/profile`, config)
		.then(response => {
			store.dispatch({
				type: FETCH_USER,
				payload: response.data
			});
			store.dispatch({ type: AUTH_USER });
			store.dispatch({
				type: OPEN_SNACKBAR,
				payload: `Signed in as ${response.data.email}`
			});
		})
		.catch(err => {
			console.log(err);
			localStorage.removeItem('deotoken');
		});
}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.querySelector('#root')
);
