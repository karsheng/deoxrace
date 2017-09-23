import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Snackbar from './Snackbar';

const style = {
	appBar: {
		boxShadow: 'none',
		padding: '0 16px'
	},
	navButton: {
		color: 'white'
	},
	navItem: {
		padding: '0 15px'
	},
	inkBar: {
		display: 'none'
	},
	iconBtn: {
		padding: '12px 0',
		width: '36px'
	},
	moreVertIcon: {
		fill: 'white'
	}
};

class Header extends Component {
	render() {
		return (
			<div>
				<AppBar style={style.appBar} title="DeoXrace" />
				<Snackbar />
			</div>
		);
	}
}

export default Header;
