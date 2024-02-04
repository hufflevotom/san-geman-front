import { FormControlLabel, Switch } from '@mui/material';
import PropTypes from 'prop-types';

const InputSwitch = ({ label, value, onChange, disabled }) => {
	return (
		<FormControlLabel
			className="mt-8 mb-16 mx-12"
			label={label}
			disabled={disabled}
			control={
				<Switch
					color="info"
					checked={value}
					onChange={onChange || (() => {})}
					inputProps={{ 'aria-label': 'controlled' }}
				/>
			}
		/>
	);
};

InputSwitch.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};

export default InputSwitch;
