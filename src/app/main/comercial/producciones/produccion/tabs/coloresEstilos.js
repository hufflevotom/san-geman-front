/* eslint-disable no-case-declarations */
/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import FuseUtils from '@fuse/utils/FuseUtils';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90%',
	height: '90%',
	bgcolor: 'background.paper',
	borderRadius: 3,
	overflowY: 'scroll',
	p: 4,
};
const constPading = 8;
const border = 1;

const ColoresEstilos = () => {
	const methods = useFormContext();
	const { control, watch, getValues, setValue } = methods;
	const data = watch('respEstiloPedido');

	console.log(data);

	const obtenerColoresEstilos = cantidadesPorcentaje => {
		const colores = [];

		cantidadesPorcentaje.forEach(estilo => {
			if (
				colores.findIndex(
					c => c.color.id === estilo.color.id && c.estilo.id === estilo.estilo.id
				) === -1
			) {
				colores.push({
					id: FuseUtils.generateGUID(),
					colorId: estilo.color.id,
					color: estilo.color,
					estiloId: estilo.estilo.id,
					estilo: estilo.estilo,
					colorCliente: '',
				});
			}
		});

		setValue('coloresClientes', colores);
	};

	useEffect(() => {
		if (data) {
			obtenerColoresEstilos(data[0].cantidadesPorcentaje);
		}
	}, [data]);

	return (
		<div>
			<Controller
				name="coloresClientes"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value?.map(alt => {
							return (
								<FormData
									key={FuseUtils.generateGUID()}
									control={control}
									data={alt}
									onChange={onChange}
									valInicial={value}
								/>
							);
						});
					}
					return (
						<TableContainer component={Paper} style={{ marginTop: 20 }}>
							<Table id="tabla-exportable" aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell align="left" width={200}>
											ESTILO
										</TableCell>
										<TableCell align="left" width={200}>
											COLOR DE TELA
										</TableCell>
										<TableCell align="left">COLOR CLIENTE</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>{val}</TableBody>
							</Table>
						</TableContainer>
					);
				}}
			/>
		</div>
	);
};

const FormData = props => {
	const { data, onChange, valInicial } = props;
	const [colorCliente, setColorCliente] = useState(data.colorCliente);

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
	// <div
	// 	className="flex flex-row justify-between items-center"
	// 	style={{
	// 		alignItems: 'center',
	// 		width: '100%',
	// 		margin: 0,
	// 		padding: 0,
	// 		marginLeft: '12px',
	// 		marginBottom: '12px',
	// 	}}
	// >
	// 	<div className="text-md w-1/5">{data.estilo.nombre}:</div>
	// 	<div className="text-md w-1/5">{data.color.descripcion}:</div>
	// 	<TextField
	// 		placeholder="Ingrese el nombre del color para el cliente"
	// 		className="mt-8 mb-16 mx-12"
	// 		label="Color cliente"
	// 		variant="outlined"
	// 		fullWidth
	// 		value={colorCliente}
	// 		onBlur={() => {
	// 			actualizar(colorCliente, 'colorCliente');
	// 		}}
	// 		onChange={newValue => {
	// 			setColorCliente(newValue.target.value.toUpperCase());
	// 		}}
	// 		InputLabelProps={{
	// 			shrink: true,
	// 		}}
	// 	/>
	// </div>;
	return (
		<TableRow>
			<TableCell
				align="left"
				scope="row"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
				}}
			>
				{data.estilo.estilo}
			</TableCell>
			<TableCell
				align="left"
				scope="row"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
				}}
			>
				{data.color.descripcion}
			</TableCell>
			<TableCell
				align="center"
				scope="row"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
					margin: '20 0',
				}}
			>
				<TextField
					placeholder="Ingrese el nombre del color para el cliente"
					label="Color cliente"
					variant="outlined"
					fullWidth
					value={colorCliente}
					onBlur={() => {
						actualizar(colorCliente, 'colorCliente');
					}}
					onChange={newValue => {
						setColorCliente(newValue.target.value.toUpperCase());
					}}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</TableCell>
		</TableRow>
	);
};

export default ColoresEstilos;
