import { getIn } from 'formik';
import React, { memo } from 'react';
import TextField from '@material-ui/core/TextField';

const Index = memo(({ field, form, ...props }) => {
	const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);
	const helperText = !!errorText ? errorText : props?.helperText;
	return (
		<TextField
			fullWidth
			margin="none"
			error={!!errorText}
			{...field}
			{...props}
			helperText={helperText}
		/>
	);
});

export default Index;
