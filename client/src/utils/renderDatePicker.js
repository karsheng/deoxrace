import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import renderErrorText from './renderErrorText';

const style = {
	color: 'red'
};

export default ({ input, label, meta: { touched, error }, ...custom }) => {
	return (
		<div>
			<DatePicker
				onChange={(e, val) => {
					return input.onChange(val);
				}}
				{...custom}
				value={input.value ? input.value : {}}
			/>
			<div style={style}>{renderErrorText(touched, error)}</div>
		</div>
	);
};
