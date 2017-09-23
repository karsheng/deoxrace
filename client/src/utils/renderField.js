import React from 'react';
import TextField from 'material-ui/TextField';

export default field => {
	const { meta: { touched, error } } = field;
	return (
		<TextField
			hintText={field.label}
			floatingLabelText={field.label}
			disabled={field.disabled}
			errorText={touched && error}
			type={field.type}
			{...field.input}
		/>
	);
};
