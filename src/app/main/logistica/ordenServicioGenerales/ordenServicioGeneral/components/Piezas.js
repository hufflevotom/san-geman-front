/* eslint-disable no-restricted-syntax */
import { useState } from 'react';
import FuseUtils from '@fuse/utils';
import { IconButton, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Piezas = () => {
	return (
		<div key={FuseUtils.generateGUID()} style={{ width: '100%', marginRight: '40px' }}>
			{/* <Controller
				name="piezas"
				// control={control}
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
								onClick={() => {
									onChange(
										value
											? [
													...value,
													{
														id: FuseUtils.generateGUID(),
														pieza: '',
														cantidad: 0,
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														pieza: '',
														cantidad: 0,
													},
											  ]
									);
								}}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Pieza</h5>
							</IconButton>
						</div>
					);
					return val;
				}}
			/> */}
		</div>
	);
};

const FormData = props => {
	const { errors, data, valInicial, onChange } = props;

	const [pieza, setPieza] = useState(data.pieza);
	const [cantidad, setCantidad] = useState(data.cantidad);

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
				gap: '20px',
			}}
		>
			<TextField
				placeholder="Ingrese la pieza"
				label="Pieza"
				variant="outlined"
				fullWidth
				value={pieza}
				onBlur={() => {
					actualizar(pieza, 'pieza');
				}}
				onChange={e => {
					setPieza(e.target.value);
				}}
				// error={!!errors.pieza}
				// helperText={errors?.pieza?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<TextField
				placeholder="Ingrese la cantidad"
				label="Cantidad"
				variant="outlined"
				fullWidth
				value={cantidad}
				onBlur={() => {
					actualizar(cantidad, 'cantidad');
				}}
				onChange={e => {
					setCantidad(e.target.value);
				}}
				// error={!!errors.cantidad}
				// helperText={errors?.cantidad?.message}
				InputLabelProps={{
					shrink: true,
				}}
				type="number"
				InputProps={{
					inputProps: { min: 0 },
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

export default Piezas;
