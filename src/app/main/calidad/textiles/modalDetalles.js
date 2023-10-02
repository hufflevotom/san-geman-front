/* eslint-disable no-nested-ternary */
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const { Modal, Fade, Backdrop, Typography, Button } = require('@mui/material');
const { Box } = require('@mui/system');

const pageStyle = `
	@page {
		margin: 30px !important;
	}
	@media all {
		.pagebreak {
			display: none;
		}
	}
	@media print {
		@page { size: landscape; }

		.pagebreak {
			page-break-before: always;
		}
	}
`;

const Lista = props => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				marginBottom: '20px',
				marginLeft: '20px',
			}}
		>
			{props.children}
		</div>
	);
};

const Item = props => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				gap: '10px',
				alignItems: 'center',
				justifyContent: 'left',
			}}
		>
			<div style={{ width: '200px' }}>{props.label}</div>
			<div style={{ width: 'auto', display: 'flex', flexDirection: 'row', gap: '10px' }}>
				{props.children}
			</div>
		</div>
	);
};

const Valor = props => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
			<div style={{ width: '100px' }}>{props.label}</div>
			<div style={{ width: '100px', color: props.color || 'black' }}>{props.value}</div>
		</div>
	);
};

const ModalDetalles = ({ visible, data, setVisible }) => {
	const impresionRef = useRef();

	const handlePrint = useReactToPrint({
		content: () => impresionRef.current,
		pageStyle,
	});

	const descargarImpresion = async () => {
		handlePrint();
	};

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '50%',
		height: '90%',
		bgcolor: 'background.paper',
		borderRadius: 3,
		overflowY: 'scroll',
		p: 4,
	};

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={visible}
			onClose={() => setVisible(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={visible}>
				<Box sx={style}>
					<div ref={impresionRef}>
						<div
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'start',
								justifyContent: 'center',
								marginBottom: '20px',
							}}
						>
							<Typography
								id="transition-modal-title"
								variant="h6"
								component="h2"
								style={{ marginBottom: '20px' }}
							>
								Densidad
							</Typography>

							<Lista>
								<Item label="Densidad antes del lavado">
									<Valor label="Estandar" value={data.tela?.densidad} />
									<Valor label="Real" value={data.calidadTextil?.densidadAntesLavadoReal} />
									<Valor
										label="Porcentaje"
										color={
											Number.isNaN(
												(parseFloat(data.calidadTextil?.densidadAntesLavadoEstandar) * 100) /
													parseFloat(data.tela?.densidad)
											)
												? 0
												: (parseFloat(data.calidadTextil?.densidadAntesLavadoReal) * 100) /
														parseFloat(data.tela?.densidad) -
														100 <
														-5 ||
												  Number.isNaN(
														(parseFloat(data.calidadTextil?.densidadAntesLavadoEstandar) * 100) /
															parseFloat(data.tela?.densidad)
												  )
												? 0
												: (parseFloat(data.calidadTextil?.densidadAntesLavadoReal) * 100) /
														parseFloat(data.tela?.densidad) -
														100 >
												  5
												? 'red'
												: 'black'
										}
										value={`${(Number.isNaN(
											(parseFloat(data.calidadTextil?.densidadAntesLavadoEstandar) * 100) /
												parseFloat(data.tela?.densidad)
										)
											? 0
											: (parseFloat(data.calidadTextil?.densidadAntesLavadoReal) * 100) /
													parseFloat(data.tela?.densidad) -
											  100
										).toFixed(2)} %`}
									/>
								</Item>
								<Item label="Ancho del rollo">
									<Valor label="Estandar" value={data.tela?.ancho} />
									<Valor label="Real" value={data.calidadTextil?.anchoDelRolloReal} />
									<Valor
										label="Porcentaje"
										color={
											Number.isNaN(
												(parseFloat(data.calidadTextil?.anchoDelRolloReal) * 100) /
													parseFloat(data.tela?.ancho)
											)
												? 0
												: (parseFloat(data.calidadTextil?.anchoDelRolloReal) * 100) /
														parseFloat(data.tela?.ancho) -
														100 <
														-5 ||
												  Number.isNaN(
														(parseFloat(data.calidadTextil?.anchoDelRolloReal) * 100) /
															parseFloat(data.tela?.ancho)
												  )
												? 0
												: (parseFloat(data.calidadTextil?.anchoDelRolloReal) * 100) /
														parseFloat(data.tela?.ancho) -
														100 >
												  5
												? 'red'
												: 'black'
										}
										value={`${(Number.isNaN(
											(parseFloat(data.calidadTextil?.anchoDelRolloReal) * 100) /
												parseFloat(data.tela?.ancho)
										)
											? 0
											: (parseFloat(data.calidadTextil?.anchoDelRolloReal) * 100) /
													parseFloat(data.tela?.ancho) -
											  100
										).toFixed(2)} %`}
									/>
								</Item>
							</Lista>

							<Typography
								id="transition-modal-title"
								variant="h6"
								component="h2"
								style={{ marginBottom: '20px' }}
							>
								Encogimiento
							</Typography>

							<Lista>
								<Item label="Estandar">
									<Valor label="Largo" value={data.calidadTextil?.encogimientoEstandarLargo} />
									<Valor label="Ancho" value={data.calidadTextil?.encogimientoEstandarAncho} />
								</Item>
								<Item label="Promedio 1ra lavada">
									<Valor label="Largo" value={data.calidadTextil?.encogimiento1largo} />
									<Valor label="Ancho" value={data.calidadTextil?.encogimiento1ancho} />
								</Item>
								<Item label="Promedio 2da lavada">
									<Valor label="Largo" value={data.calidadTextil?.encogimiento2largo} />
									<Valor label="Ancho" value={data.calidadTextil?.encogimiento2ancho} />
								</Item>
								<Item label="Promedio 3ra lavada">
									<Valor label="Largo" value={data.calidadTextil?.encogimiento3largo} />
									<Valor label="Ancho" value={data.calidadTextil?.encogimiento3ancho} />
								</Item>
							</Lista>

							<Typography
								id="transition-modal-title"
								variant="h6"
								component="h2"
								style={{ marginBottom: '20px' }}
							>
								% Revirado
							</Typography>

							<Lista>
								<Item label="Estandar">
									<Valor label="Estandar" value={data.calidadTextil?.reviradoEstandar} />
								</Item>
								<Item label="Después del lavado">
									<Valor label="Derecho" value={data.calidadTextil?.reviradoDerecho} />
									<Valor label="Izquierdo" value={data.calidadTextil?.reviradoIzquierdo} />
									<Valor
										label="Promedio"
										value={(Number.isNaN(
											(parseFloat(data.calidadTextil?.reviradoDerecho) +
												parseFloat(data.calidadTextil?.reviradoIzquierdo)) /
												2
										)
											? 0
											: (parseFloat(data.calidadTextil?.reviradoDerecho) +
													parseFloat(data.calidadTextil?.reviradoIzquierdo)) /
											  2
										).toFixed(2)}
									/>
								</Item>
							</Lista>

							<Typography
								id="transition-modal-title"
								variant="h6"
								component="h2"
								style={{ marginBottom: '20px' }}
							>
								Grado de inclinación de trama
							</Typography>

							<Lista>
								<Item label="Estandar">
									<Valor label="Estandar" value={data.calidadTextil?.inclinacionEstandar} />
								</Item>
								<Item label="Antes del lavado">
									<Valor label="Derecho" value={data.calidadTextil?.inclinacionAntesDerecho} />
									<Valor label="Izquierdo" value={data.calidadTextil?.inclinacionAntesIzquierdo} />
									<Valor
										label="Promedio"
										value={(Number.isNaN(
											(parseFloat(data.calidadTextil?.inclinacionAntesDerecho) +
												parseFloat(data.calidadTextil?.inclinacionAntesIzquierdo)) /
												2
										)
											? 0
											: (parseFloat(data.calidadTextil?.inclinacionAntesDerecho) +
													parseFloat(data.calidadTextil?.inclinacionAntesIzquierdo)) /
											  2
										).toFixed(2)}
									/>
								</Item>
								<Item label="Después del lavado">
									<Valor label="Derecho" value={data.calidadTextil?.inclinacionDespuesDerecho} />
									<Valor
										label="Izquierdo"
										value={data.calidadTextil?.inclinacionDespuesIzquierdo}
									/>
									<Valor
										label="Promedio"
										value={(Number.isNaN(
											(parseFloat(data.calidadTextil?.inclinacionDespuesDerecho) +
												parseFloat(data.calidadTextil?.inclinacionDespuesIzquierdo)) /
												2
										)
											? 0
											: (parseFloat(data.calidadTextil?.inclinacionDespuesDerecho) +
													parseFloat(data.calidadTextil?.inclinacionDespuesIzquierdo)) /
											  2
										).toFixed(2)}
									/>
								</Item>
							</Lista>

							<Typography
								id="transition-modal-title"
								variant="h6"
								component="h2"
								style={{ marginBottom: '20px' }}
							>
								Solidez y apariencia
							</Typography>

							<Lista>
								<Item label="Solidez">
									<Valor label="Solidez" value={data.calidadTextil?.solidez} />
								</Item>
								<Item label="Apariencia">
									<Valor label="Apariencia" value={data.calidadTextil?.apariencia} />
								</Item>
							</Lista>
						</div>
					</div>
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end',
							marginTop: '20px',
							gap: '20px',
						}}
					>
						<Button variant="contained" color="primary" onClick={descargarImpresion}>
							Descargar
						</Button>

						<Button variant="contained" color="secondary" onClick={() => setVisible(false)}>
							Cerrar
						</Button>
					</div>
				</Box>
			</Fade>
		</Modal>
	);
};

export default ModalDetalles;
