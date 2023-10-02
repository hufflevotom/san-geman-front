import { Icon, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FuseUtils from '@fuse/utils';
import { baseUrl } from 'utils/Api';

function AlternativasTab(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const getValor = getValues();

	return (
		<div
			className="flex flex-row sm:flex-row mr-24 sm:mr-4"
			style={{ overflowY: 'scroll', flexWrap: 'wrap' }}
		>
			<Controller
				name="alternativas"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value.map(alt => {
							return (
								<Alt
									getValor={getValor}
									key={alt.id}
									control={control}
									errors={errors}
									data={alt}
									onChange={onChange}
									valInicial={value}
								/>
							);
						});
					}

					val.push(
						<div
							key="add"
							style={{
								width: '40%',
								alignContent: 'center',
								alignItems: 'center',
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<IconButton
								disabled={value?.length >= 4 || getValor.estado !== 'desarrollo'}
								// disabled={getValor.estado !== 'desarrollo'}
								aria-label="add"
								size="large"
								color="primary"
								onClick={() => {
									onChange(
										value
											? [...value, { id: FuseUtils.generateGUID(), nombre: '' }]
											: [{ id: FuseUtils.generateGUID(), nombre: '' }]
									);
								}}
							>
								<AddBoxIcon style={{ fontSize: '40px' }} />
							</IconButton>
						</div>
					);
					return val;
				}}
			/>
		</div>
	);
}

const Alt = props => {
	const { control, errors, data, onChange, valInicial, getValor } = props;

	return (
		<div
			className="flex flex-col sm:flex-row  sm:mr-4"
			style={{
				alignItems: 'center',
				width: '49%',
				margin: 0,
				marginTop: '10px',
				padding: 0,
				marginLeft: '7px',
				marginBottom: '7px',
			}}
		>
			<TextField
				placeholder="Ingrese las alternativas"
				label="Titulos del Hilo"
				variant="outlined"
				disabled={getValor.estado !== 'desarrollo'}
				fullWidth
				value={data.nombre}
				onChange={newValue => {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.nombre = newValue.target.value;
							}
						}
					}
					onChange([...valInicial]);
				}}
				error={!!errors.alternativas}
				helperText={errors?.alternativas?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/>
		</div>
	);
};

export default AlternativasTab;
