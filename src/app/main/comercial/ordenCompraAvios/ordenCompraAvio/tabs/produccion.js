import { Autocomplete, TextField } from '@mui/material';
import { limitCombo, offsetCombo } from 'constants/constantes';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import httpClient from 'utils/Api';
import ProduccionTable from './produccionTable';

const Produccion = ({
	control,
	dataSeleccionada,
	setModalOpen,
	setDataModal,
	errors,
	setSelectProduccion,
	libre,
}) => {
	const ordenCompraRedux = useSelector(state => state.comercial.ordenCompraAvio);
	const [produccionTemporal, setProduccionTemporal] = useState(null);
	const [dataProduccion, setDataProduccion] = useState([]);
	const methods = useFormContext();
	const { watch } = methods;

	const proveedor = watch('proveedor');
	const moneda = watch('moneda');

	const [ordenProduccionSearchText, setOrdenProduccionSearchText] = useState('');

	const opciones = dataProduccion.map(prod => ({
		...prod,
		label: prod.codigo,
	}));

	useEffect(() => {
		traerProduccion();
	}, []);

	const traerProduccion = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/producciones?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataProduccion(data);
	};

	const debouncedTraerOrdenesProduccion = debounce(() => {
		traerProduccion(ordenProduccionSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerOrdenesProduccion(); // Llamar a la versión debounced de fetchData
		return debouncedTraerOrdenesProduccion.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [ordenProduccionSearchText]);

	return (
		<Controller
			name="produccion"
			control={control}
			render={({ field: { onChange, value } }) => {
				let data;
				const produccion = value
					? {
							...value,
							label: value.codigo,
					  }
					: null;
				if (!libre) {
					if (dataSeleccionada.length > 0) {
						data = <ProduccionTable dataSeleccionada={dataSeleccionada} />;
					}

					if (ordenCompraRedux?.detalleOrdenComprasAvios?.length > 0) {
						data = <ProduccionTable />;
					}
				}

				return (
					<>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<Autocomplete
								disabled={
									ordenCompraRedux?.detalleOrdenComprasAvios?.length > 0 || !proveedor || !moneda
								}
								className="mt-8 mb-16 mx-12"
								// freeSolo
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opciones || []}
								value={produccion}
								filterOptions={(options, state) => {
									return options;
								}}
								onInputChange={(event, newInputValue) => {
									setOrdenProduccionSearchText(newInputValue);
									setProduccionTemporal({ ...produccion, label: newInputValue });
								}}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
										setProduccionTemporal(null);
										/// SETEAR AL ESTADO///////////
										if (!libre) {
											setModalOpen(true);
											setDataModal(valor);
										}
										setSelectProduccion(valor);
									} else {
										onChange(null);
										setModalOpen(false);
										setSelectProduccion(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione la producción"
										label="Producción"
										error={!!errors.produccion}
										helperText={errors?.produccion?.message}
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

export default Produccion;
