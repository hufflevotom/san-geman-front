import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const InputString = ({
	label,
	required = false,
	placeholder,
	value,
	onChange,
	onBlur,
	disabled,
}) => {
	return (
		<TextField
			className="mt-8 mb-16 mx-12"
			value={value}
			onBlur={onBlur || (() => {})}
			onChange={onChange || (() => {})}
			label={label}
			placeholder={placeholder || label}
			variant="outlined"
			fullWidth
			disabled={disabled}
			InputLabelProps={{ shrink: true }}
			autoComplete="off"
			required={required}
		/>
	);
};

InputString.propTypes = {
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
};

export default InputString;
