import React from 'react';
import TextField from 'material-ui/TextField';

export default field => {
	const { meta: { touched, error } } = field;
	return (
		<TextField
			hintText={field.label}
			floatingLabelText={field.label}
			errorText={touched && error}
			multiLine={true}
			rows={2}
			rowsMax={3}
			type={field.type}
			{...field.input}
		/>
	);
};
