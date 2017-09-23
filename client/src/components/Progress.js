import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
	width: '100%',
	height: '100%',
	minHeight: 50,
	margin: 'auto',
	textAlign: 'center'
};

const Progress = () => {
	return (
		<div style={style}>
			<CircularProgress />
		</div>
	);
};

export default Progress;
