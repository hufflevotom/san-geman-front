/* eslint-disable no-restricted-syntax */
import { useState } from 'react';
import FuseUtils from '@fuse/utils';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Complementos = () => {
	return (
		<div key={FuseUtils.generateGUID()} style={{ width: '100%', marginRight: '20px' }}>
			<Controller
				name="complementos"
				render={({ field: { onChange, value } }) => {
					let val = [];

					if (value) {
						val = value.map(alt => {
							return (
								<FormData
									key={alt.id}
									// errors={errors}
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
								style={{
									height: '46px',
									marginLeft: '20px',
									marginRight: '40px',
									// backgroundColor: '#ccf0df',
									backgroundColor: 'rgb(2 136 209)',
								}}
								// color="primary"
								onClick={() => {
									onChange(
										value
											? [
													...value,
													{
														id: FuseUtils.generateGUID(),
														complemento: '',
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														complemento: '',
													},
											  ]
									);
								}}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Complemento</h5>
								{/* &nbsp; */}
								{/* <AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} /> */}
							</IconButton>
						</div>
					);
					return val;
				}}
			/>
		</div>
	);
};

const FormData = props => {
	const { errors, data, valInicial, onChange } = props;

	const [complemento, setComplemento] = useState(data.complemento || '');

	const actualizar = (nnn, titulo) => {
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
				marginLeft: '20px',
				marginBottom: '12px',
			}}
		>
			<TextField
				type="text"
				value={complemento}
				onChange={newValue => {
					setComplemento(newValue.target.value);
				}}
				onBlur={() => {
					actualizar(complemento, 'complemento');
				}}
				placeholder="Ingrese el complemento"
				label="Complemento"
				variant="outlined"
				fullWidth
				error={!!errors.complemento}
				helperText={errors?.complemento?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<div style={{ backgroundColor: '#F5FBFA', marginLeft: '10px', borderRadius: '50px' }}>
				<IconButton
					aria-label="delete"
					color="error"
					onClick={() => {
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

export default Complementos;
