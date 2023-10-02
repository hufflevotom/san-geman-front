import { useEffect, useState } from 'react';
import FuseUtils from '@fuse/utils';
import { Autocomplete, IconButton, InputAdornment, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Tizado = ({ i, fila, disabled, tablaTizados, setTablaTizados, text }) => {
	const [opcionesTelas, setOpcionesTelas] = useState([]);

	const calcularPesoPano = () => {
		const data = [...fila.tizados];
		data.forEach(e => {
			e.pesoPano = (e.anchoDensidad * e.largoTizado * e.cantidadPano).toFixed(2);
		});

		tablaTizados[i].tizados = data;
		setTablaTizados([...tablaTizados]);
	};

	const actualizarFila = (event, index) => {
		const data = [...fila.tizados];
		data[index][event.target.name] = event.target.value;
		tablaTizados[i].tizados = data;
		setTablaTizados([...tablaTizados]);
	};

	const actualizarTela = (event, index) => {
		const data = [...fila.tizados];
		data[index].tela = event;
		data[index].telaValue = {
			...event.tela,
			label: `${event.tela.nombre}`,
		};
		data[index].anchoDensidad =
			parseFloat(event.calidadTextil.anchoDelRolloReal / 100) *
			parseFloat(event.calidadTextil.densidadAntesLavadoReal / 1000);
		tablaTizados[i].tizados = data;
		setTablaTizados([...tablaTizados]);
	};

	const actualizarCantidad = (event, j, index) => {
		const data = [...fila.tizados];
		data[index].cantidadesTizado[j][event.target.name] = event.target.value;
		tablaTizados[i].tizados = data;
		setTablaTizados([...tablaTizados]);
	};

	const agregarFila = () => {
		const object = {
			id: FuseUtils.generateGUID(),
			tela: '',
			telaValue: '',
			cantidadPano: 0,
			largoTizado: 0,
			pesoPano: 0,
			cantidadesTizado: fila.tallas.map(c => ({
				id: c.id,
				talla: c.talla,
				relacion: 0,
				cantidad: 0,
			})),
		};
		tablaTizados[i].tizados = [...fila.tizados, object];
		setTablaTizados([...tablaTizados]);
	};

	const borrarFila = index => {
		const data = [...fila.tizados];
		data.splice(index, 1);
		tablaTizados[i].tizados = data;
		setTablaTizados([...tablaTizados]);
	};

	useEffect(() => {
		setOpcionesTelas(
			fila.telas.map(tela => ({
				...tela,
				key: tela.tela.id,
				value: tela.tela.id,
				label: `${tela.tela.nombre}`,
			}))
		);
	}, [fila]);

	return (
		<div style={{ marginRight: '40px' }}>
			<hr />
			<div className="mx-6 mb-16 mt-16 text-base">Tizado</div>
			{fila.tizados.map((form, index) => {
				return (
					<div
						className="flex flex-col sm:flex-row  sm:mr-4"
						style={{
							alignItems: 'center',
							margin: 0,
							padding: 0,
							marginLeft: '12px',
							marginBottom: '12px',
						}}
					>
						<div
							className="flex flex-col  sm:mr-4"
							style={{
								alignItems: 'center',
								width: '100%',
								margin: 0,
								padding: 0,
								marginLeft: '12px',
								marginBottom: '12px',
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'start',
									alignItems: 'start',
									width: '100%',
								}}
							>
								<div style={{ width: '20%', marginBottom: '20px' }}>{index + 1}º Tizado</div>
								{/* {text &&
									form.cantidadesTizado.map(cantidad => (
										<div style={{ width: `calc( 80% / ${form.cantidadesTizado.length} )` }}>
											{cantidad.talla}
										</div>
									))} */}
							</div>
							<div
								className="sm:mr-4"
								style={{
									alignItems: 'center',
									width: '100%',
									margin: 0,
									padding: 0,
									marginLeft: '12px',
									marginBottom: '12px',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '20px',
										marginRight: '10px',
									}}
								>
									{text ? (
										<div className="pr-8">Tela: {form?.telaValue?.nombre}</div>
									) : (
										<Autocomplete
											key={`tela${index}`}
											name="tela"
											isOptionEqualToValue={(op, val) => op.id === val.id}
											options={opcionesTelas || []}
											value={form.telaValue}
											fullWidth
											disabled={disabled}
											filterOptions={(options, state) => options}
											onChange={(event, newValue) => {
												actualizarTela(newValue, index);
												calcularPesoPano();
											}}
											renderInput={params => (
												<TextField
													{...params}
													placeholder="Seleccione la tela"
													label="Tela"
													fullWidth
													variant="outlined"
													InputLabelProps={{
														shrink: true,
													}}
												/>
											)}
										/>
									)}
									{text ? (
										<div className="pr-8">Cantidad de paños: {form?.cantidadPano}</div>
									) : (
										<TextField
											id="cantidadPano"
											key={`cantidadPano${index}`}
											name="cantidadPano"
											placeholder="Cantidad"
											label="Cantidad de paños"
											variant="outlined"
											fullWidth
											InputProps={{
												endAdornment: <InputAdornment position="end">paños</InputAdornment>,
												inputProps: { min: 0 },
											}}
											value={form.cantidadPano}
											type="number"
											disabled={disabled}
											onChange={event => {
												actualizarFila(event, index);
												calcularPesoPano();
											}}
										/>
									)}
								</div>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										marginLeft: '20px',
										alignItems: 'center',
										gap: '20px',
									}}
								>
									{form.cantidadesTizado &&
										form.cantidadesTizado.map((cantidad, j) => {
											return (
												<div
													key={`cantidadesTizado${i}${j}`}
													style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
												>
													{text ? (
														<div className="pr-8">
															{`Relacion ${cantidad.talla}`}: {form?.cantidadesTizado[j]?.relacion}
														</div>
													) : (
														<TextField
															id={`relacion${i}${j}`}
															key={`relacion${i}${j}`}
															name="relacion"
															label={`Relacion ${cantidad.talla}`}
															variant="outlined"
															disabled={disabled}
															value={form.cantidadesTizado[j] && form.cantidadesTizado[j].relacion}
															type="number"
															InputProps={{
																inputProps: { min: 0 },
															}}
															onChange={e => actualizarCantidad(e, j, index)}
														/>
													)}
													{text ? (
														<div className="pr-8">
															{`Cantidad ${cantidad.talla}`}: {form?.cantidadesTizado[j]?.cantidad}
														</div>
													) : (
														<TextField
															id={`cantidad${i}${j}`}
															key={`cantidad${i}${j}`}
															name="cantidad"
															label={`Cantidad ${cantidad.talla}`}
															variant="outlined"
															disabled={disabled}
															value={form.cantidadesTizado[j] && form.cantidadesTizado[j].cantidad}
															type="number"
															InputProps={{
																inputProps: { min: 0 },
															}}
															onChange={e => actualizarCantidad(e, j, index)}
														/>
													)}
												</div>
											);
										})}
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '20px',
										marginRight: '20px',
										marginLeft: '10px',
									}}
								>
									{text ? (
										<div className="pr-8">Largo de tizado: {form?.largoTizado}</div>
									) : (
										<TextField
											id="largoTizado"
											key={`largoTizado${index}`}
											name="largoTizado"
											placeholder="Largo"
											label="Largo de tizado"
											variant="outlined"
											fullWidth
											value={form.largoTizado}
											type="number"
											InputProps={{
												inputProps: { min: 0 },
											}}
											disabled={disabled}
											onChange={event => {
												actualizarFila(event, index);
												calcularPesoPano();
											}}
										/>
									)}
									{text ? (
										<div className="pr-8">Peso de paño: {form?.pesoPano}</div>
									) : (
										<TextField
											id="pesoPano"
											key={`pesoPano${index}`}
											name="pesoPano"
											placeholder="Peso"
											label="Peso de paño"
											variant="outlined"
											fullWidth
											value={form.pesoPano}
											type="number"
											InputProps={{
												inputProps: { min: 0 },
											}}
											disabled={disabled}
											onChange={event => actualizarFila(event, index)}
										/>
									)}
								</div>
							</div>
						</div>
						{!disabled && (
							<div style={{ backgroundColor: '#F5FBFA', borderRadius: '50px', marginLeft: '10px' }}>
								<IconButton aria-label="delete" color="error" onClick={() => borrarFila(index)}>
									<DeleteForeverIcon />
								</IconButton>
							</div>
						)}
					</div>
				);
			})}
			<div
				style={{
					borderRadius: '50px',
					paddingLeft: '10px',
					paddingBottom: '20px',
				}}
			>
				{!disabled && (
					<IconButton
						className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
						aria-label="add"
						size="medium"
						style={{
							height: '46px',
							marginLeft: '20px',
							marginRight: '40px',
							backgroundColor: 'rgb(2 136 209)',
						}}
						onClick={agregarFila}
					>
						<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar</h5>
					</IconButton>
				)}
			</div>
		</div>
	);
};

export default Tizado;
