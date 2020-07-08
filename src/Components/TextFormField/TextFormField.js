import { getIn } from 'formik';
import React, { memo } from 'react';
import TextField from '@material-ui/core/TextField';

const Index = memo(({ field, form, ...props }) => {
	const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

	return <TextField fullWidth margin="none" helperText={errorText} error={!!errorText} {...field} {...props} />;
});

export default Index;
