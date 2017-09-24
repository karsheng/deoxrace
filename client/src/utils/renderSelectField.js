import React from 'react';
import SelectField from 'material-ui/SelectField';

export default ({
	input,
	label,
	meta: { touched, error },
	children,
	multiple,
	disabled,
	...custom
}) => (
	<SelectField
		multiple={multiple}
		floatingLabelText={label}
		errorText={touched && error}
		disabled={disabled}
		{...input}
		onChange={(event, index, value) => input.onChange(value)}
		children={children}
		{...custom}
	/>
);
