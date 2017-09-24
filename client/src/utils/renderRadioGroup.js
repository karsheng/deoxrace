import React from 'react';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import renderErrorText from './renderErrorText';

const style = {
	color: 'red'
};
export default ({ input, meta: { touched, error }, ...rest }) => {
	return (
		<div>
			<RadioButtonGroup
				{...input}
				{...rest}
				valueSelected={input.value}
				onChange={(event, value) => input.onChange(value)}
			/>
			<div style={style}>{renderErrorText(touched, error)}</div>
		</div>
	);
};
