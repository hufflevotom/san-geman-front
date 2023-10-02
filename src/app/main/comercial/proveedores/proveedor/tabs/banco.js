import FuseUtils from '@fuse/utils/FuseUtils';
import { Autocomplete, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

function CuentasBanco(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const data = getValues();

	return (
		<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24">
			<Controller
				name="cuentasBanco"
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
									color: 'white',
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
function FormData(props) {
	const { errors, data, onChange, valInicial } = props;

	const [banco, setBanco] = useState(data.banco);
	const [moneda, setMoneda] = useState(data.moneda);
	const [nroCuenta, setNroCuenta] = useState(data.nroCuenta);
	const [nroCci, setNroCci] = useState(data.nroCci);
	const [otroBanco, setOtroBanco] = useState(data.otroBanco);

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

	const opcionesBanco = [
		{ id: 1, value: 'BCP', label: 'BCP' },
		{ id: 2, value: 'SCOTIABANK', label: 'SCOTIABANK' },
		{ id: 3, value: 'BBVA', label: 'BBVA' },
		{ id: 4, value: 'BANBIF', label: 'BANBIF' },
		{ id: 5, value: 'INTERBANK', label: 'INTERBANK' },
		{ id: 6, value: 'OTROS', label: 'OTROS' },
	];

	const opcionesMoneda = [
		{ id: 1, value: 'SOLES', label: 'SOLES' },
		{ id: 2, value: 'DOLARES', label: 'DOLARES' },
	];

	return (
		<div className="flex flex-row justify-between mb-10">
			<div className="flex flex-col w-11/12">
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<Autocomplete
						className="mt-8 mb-16 mx-12"
						// freeSolo
						isOptionEqualToValue={(op, val) => op.label === val.label}
						options={opcionesBanco || []}
						value={banco}
						filterOptions={(options, state) => {
							return options;
						}}
						fullWidth
						onChange={(event, newValue) => {
							setBanco(newValue);
							actualizar(newValue, 'banco');
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione el Banco"
								label="Banco"
								error={!!errors.banco}
								helperText={errors?.banco?.message}
								variant="outlined"
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>

					<Autocomplete
						className="mt-8 mb-16 mx-12"
						// freeSolo
						isOptionEqualToValue={(op, val) => op.label === val.label}
						options={opcionesMoneda || []}
						value={moneda}
						filterOptions={(options, state) => {
							return options;
						}}
						fullWidth
						onChange={(event, newValue) => {
							setMoneda(newValue);
							actualizar(newValue, 'moneda');
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione el Tipo de Moneda"
								label="Tipo de Moneda"
								error={!!errors.tipoMoneda}
								helperText={errors?.tipoMoneda?.message}
								variant="outlined"
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>

					<TextField
						className="mt-8 mb-16 mx-12"
						error={!!errors.nroCuenta}
						helperText={errors?.nroCuenta?.message}
						id="nroCuenta"
						label="Número de cuenta"
						variant="outlined"
						fullWidth
						value={nroCuenta}
						onBlur={() => {
							actualizar(nroCuenta, 'nroCuenta');
						}}
						onChange={newValue => {
							setNroCuenta(newValue.target.value);
						}}
					/>

					<TextField
						className="mt-8 mb-16 mx-12"
						error={!!errors.nroCci}
						helperText={errors?.nroCci?.message}
						id="nroCci"
						label="CCI"
						variant="outlined"
						fullWidth
						value={nroCci}
						onBlur={() => {
							actualizar(nroCci, 'nroCci');
						}}
						onChange={newValue => {
							setNroCci(newValue.target.value);
						}}
					/>
				</div>
				{banco?.value === 'OTROS' && (
					<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
						<TextField
							className="mt-8 mb-16 mx-12"
							error={!!errors.otroBanco}
							helperText={errors?.otroBanco?.message}
							id="otroBanco"
							placeholder="Ingrese el Banco"
							label="Otro Banco"
							variant="outlined"
							fullWidth
							value={otroBanco}
							onBlur={() => {
								actualizar(otroBanco, 'otroBanco');
							}}
							onChange={newValue => {
								setOtroBanco(newValue.target.value.toUpperCase());
							}}
						/>
					</div>
				)}
			</div>
			<div className="flex flex-row justify-center items-center w-1/12 h-full">
				<div
					style={{
						backgroundColor: '#F5FBFA',
						borderRadius: '50px',
						width: '35px',
						height: '35px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
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
		</div>
	);
}

export default CuentasBanco;
