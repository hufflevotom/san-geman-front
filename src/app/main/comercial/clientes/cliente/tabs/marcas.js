import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FuseUtils from '@fuse/utils';

function Marcas(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const data = getValues();

	return (
		<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24">
			<Controller
				name="marcas"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value?.map(alt => {
							return (
								<FormData
									key={FuseUtils.generateGUID()}
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
						<div key={FuseUtils.generateGUID()}>
							<IconButton
								className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
								aria-label="add"
								size="medium"
								color="primary"
								style={{
									height: '46px',
									marginLeft: '20px',
									marginRight: '40px',
									backgroundColor: '#FFB52C',
									// backgroundColor: 'rgb(2 136 209)',
								}}
								onClick={() => {
									onChange(
										value
											? [
													...value,
													{
														id: FuseUtils.generateGUID(),
														marca: '',
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														marca: '',
													},
											  ]
									);
								}}
							>
								<h5>Agregar</h5>
								{/* &nbsp;
							<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'black' }} /> */}
							</IconButton>
						</div>
					);
					return val;
				}}
			/>
		</div>
	);
}

const FormData = props => {
	const { errors, data, onChange, valInicial } = props;

	const [marca, setMarca] = useState(data.marca);

	const actualizar = (nnn, titulo) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in valInicial) {
			if (Object.hasOwnProperty.call(valInicial, key)) {
				const element = valInicial[key];
				if (element.id === data.id) {
					element[titulo] = nnn;
				}
			}
		}
		onChange([...valInicial]);
	};

	return (
		<div
			className="flex flex-col sm:flex-row  sm:mr-4"
			style={{
				alignItems: 'center',
				width: '100%',
				margin: 0,
				padding: 0,
				marginLeft: '12px',
				marginBottom: '12px',
			}}
		>
			<TextField
				placeholder="Ingrese la marca"
				className="mt-8 mb-16 mx-12"
				label="Marca"
				variant="outlined"
				fullWidth
				value={marca}
				onBlur={() => {
					actualizar(marca, 'marca');
				}}
				onChange={newValue => {
					setMarca(newValue.target.value.toUpperCase());
				}}
				error={!!errors.bordados}
				helperText={errors?.bordados?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<div
				style={{ backgroundColor: '#F5FBFA', /* marginBottom: '100px',  */ borderRadius: '50px' }}
			>
				<IconButton
					aria-label="delete"
					color="error"
					onClick={() => {
						// eslint-disable-next-line no-restricted-syntax
						for (const key in valInicial) {
							if (Object.hasOwnProperty.call(valInicial, key)) {
								const element = valInicial[key];
								if (element.id === data.id) {
									valInicial.splice(key, 1);
								}
							}
						}
						onChange([...valInicial]);
					}}
				>
					<DeleteForeverIcon />
				</IconButton>
			</div>
		</div>
	);
};

export default Marcas;
