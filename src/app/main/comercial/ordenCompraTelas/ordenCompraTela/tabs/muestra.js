import debounce from 'lodash.debounce';
import { Autocomplete, TextField } from '@mui/material';
import { limitCombo, offsetCombo } from 'constants/constantes';
import  { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import httpClient from 'utils/Api';
import ProduccionTable from './produccionTable';

const Muestra = ({
	control,
	dataSeleccionada,
	setModalOpen,
	setDataModal,
	errors,
	currentMoneda,
	libre,
}) => {
	const [muestraTemporal, setMuestraTemporal] = useState(null);
	const ordenCompraRedux = useSelector(state => state.comercial.ordenCompraTela);
	const [dataMuestra, setDataMuestra] = useState([]);

	const [ordenMuestraSearchText, setOrdenMuestraSearchText] = useState('');

	const opciones = dataMuestra.map(prod => ({
		...prod,
		label: prod.codigo,
	}));

	useEffect(() => {
		traerMuestra();
	}, []);

	const traerMuestra = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/muestras?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataMuestra(data);
	};

	const debouncedTraerOrdenesMuestra = debounce(() => {
		traerMuestra(ordenMuestraSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerOrdenesMuestra(); // Llamar a la versión debounced de fetchData
		return debouncedTraerOrdenesMuestra.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [ordenMuestraSearchText]);

	return (
		<Controller
			name="muestra"
			control={control}
			render={({ field: { onChange, value } }) => {
				let data;
				const muestra = value
					? {
							...value,
							label: value.codigo,
					  }
					: null;

				if (!libre) {
					if (dataSeleccionada.length > 0) {
						data = (
							<ProduccionTable dataSeleccionada={dataSeleccionada} currentMoneda={currentMoneda} />
						);
					}

					if (ordenCompraRedux?.detalleOrdenComprasTelas?.length > 0) {
						data = <ProduccionTable />;
					}
				}

				return (
					<>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<Autocomplete
								disabled={ordenCompraRedux?.detalleOrdenComprasTelas?.length > 0}
								className="mt-8 mb-16 mx-12"
								// freeSolo
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opciones || []}
								value={muestra}
								filterOptions={(options, state) => {
									return options;
								}}
								onInputChange={(event, newInputValue) => {
									setOrdenMuestraSearchText(newInputValue);
									setMuestraTemporal({ ...muestra, label: newInputValue });
								}}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
										setMuestraTemporal(null);
										if (!libre) {
											setModalOpen(true);
											setDataModal(valor);
										}
									} else {
										onChange(null);
										setModalOpen(false);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione la muestra"
										label="Muestra"
										error={!!errors.produccionId}
										helperText={errors?.produccionId?.message}
										variant="outlined"
										fullWidth
										InputLabelProps={{
											shrink: true,
										}}
									/>
								)}
							/>
						</div>

						<div className="sm:flex-row mr-24 sm:mr-4">{data}</div>
					</>
				);
			}}
		/>
	);
};

export default Muestra;
