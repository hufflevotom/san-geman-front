import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function Telas(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [dataTelas, setDataTelas] = useState([]);
	const [telasTemporal, setTelasTemporal] = useState(null);

	useEffect(() => {
		traerTelas();
	}, []);

	const traerTelas = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `maestro/tela?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataTelas(data);
	};

	const opciones = dataTelas.map(tela => ({
		...tela,
		label: `${tela.codigo} - ${tela.nombre}`,
	}));

	return (
		<>
			{/* <Controller
				name="telasCompra"
				control={control}
				render={({ field: { onChange, value } }) => {
					console.log('Value: ', value);

					const tela = value
						? {
								...value,
								label: `${value.codigo} - ${value.nombre}`,
						  }
						: null;
					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12"
							freeSolo
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opciones || []}
							value={telasTemporal || tela}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								traerTelas(newInputValue);
								setTelasTemporal({ ...tela, label: newInputValue });
							}}
							fullWidth
							onChange={(event, newValue) => {
								if (newValue) {
									const { label, ...valor } = newValue;
									onChange(valor);
									setTelasTemporal(null);
								} else {
									onChange(null);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione la tela"
									label="Tela"
									error={!!errors.telasCompra}
									helperText={errors?.telasCompra?.message}
									variant="outlined"
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
								/>
							)}
						/>
					);
				}}
			/> */}
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="valorVenta"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.valorVenta}
							required
							helperText={errors?.valorVenta?.message}
							label="Valor Venta"
							autoFocus
							id="valorVenta"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="igv"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.igv}
							required
							helperText={errors?.igv?.message}
							label="IGV"
							autoFocus
							id="igv"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="total"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.total}
							required
							helperText={errors?.total?.message}
							label="Total"
							autoFocus
							id="total"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
		</>
	);
}

export default Telas;
