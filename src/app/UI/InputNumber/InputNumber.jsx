import { InputAdornment, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const InputNumber = ({ label, placeholder, value, onChange, onBlur, disabled, suffix }) => {
	return (
		<TextField
			className="mt-8 mb-16 mx-12"
			name="costo"
			label={label}
			placeholder={placeholder || label}
			variant="outlined"
			fullWidth
			disabled={disabled}
			value={value}
			type="number"
			InputProps={{
				inputProps: { min: 0 },
				endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
			}}
			onBlur={onBlur || (() => {})}
			onChange={onChange || (() => {})}
		/>
	);
};

InputNumber.propTypes = {
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.number,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	disabled: PropTypes.bool,
	suffix: PropTypes.string,
};

export default InputNumber;
