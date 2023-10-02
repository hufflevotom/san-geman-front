import { Autocomplete, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const InputSelect = ({ label, placeholder, onSearch, options, value, onChange, disabled }) => {
	return (
		<Autocomplete
			className="mt-8 mb-16 mx-12"
			// isOptionEqualToValue={(opc, v) => opc.id === v.id}
			options={options}
			value={value}
			fullWidth
			disabled={disabled}
			// filterOptions={(opt, state) => {
			// 	return opt;
			// }}
			onInputChange={(event, newInputValue) =>
				typeof onSearch === 'function' ? onSearch(newInputValue) : () => {}
			}
			onChange={onChange || (() => {})}
			renderInput={params => (
				<TextField
					{...params}
					placeholder={placeholder || label}
					label={label}
					required
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
					fullWidth
				/>
			)}
		/>
	);
};

InputSelect.propTypes = {
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	onSearch: PropTypes.func,
	options: PropTypes.array.isRequired,
	value: PropTypes.object,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};

export default InputSelect;
