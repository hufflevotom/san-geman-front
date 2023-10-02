import {
	Grid,
	Paper,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';

import Table from '@mui/material/Table';

const InformacionPdf = ({ impresionRef, dataSeleccionada }) => {
	const subtituloNegrita = { fontWeight: 'bold' };
	const subtituloNormal = { fontWeight: 'normal' };

	const obj = [
		{
			id: 'FT-0002-ABCDE455',
			tela: 'JERSEY LISTADO - 30/1 - 100% COTTON - KG',
			color: 'ABC44',
			cantidad: 0,
			um: 'KG',
		},
		{
			id: 'TFX-0002-ASASDSADASDASD12312314',
			tela: 'TEXFLEX aea - 20/1 - 100% COTTON - KG',
			color: 'perro 123',
			cantidad: 0,
			um: 'KG',
		},
		{
			id: 'JR-0001-VR2',
			tela: 'JERSEY PIMA - PRUEBA 12 - PRUEBA 13 - KG',
			color: 'VERDE',
			cantidad: 0,
			um: 'KG',
		},
	];

	const style = {
		border: '1px solid #ccc',
	};

	return (
		<div ref={impresionRef} style={{ padding: '20px' }}>
			<Grid container spacing={2}>
				<Grid item xs={4} /*  style={{ backgroundColor: 'red' }} */>
					<img
						src="https://cdn.discordapp.com/attachments/700828906881810623/959668075505021018/logo-white.png"
						alt=""
						width={240}
					/>
				</Grid>
				<Grid item xs={4} /* style={{ backgroundColor: 'blue' }} */>
					<h4 style={subtituloNegrita}>ORDEN DE COMPRA: 0C-21-0000065</h4>
				</Grid>
				<Grid item xs={4} style={{ /* backgroundColor: 'yellow', */ marginTop: '20px' }}>
					<h4 style={subtituloNegrita}>
						FECHA EMISIÓN: <span style={subtituloNormal}>21/07/2021</span>
					</h4>
					<h4 style={subtituloNegrita}>
						FECHA ENTREGA: <span style={subtituloNormal}>21/07/2021</span>
					</h4>
					<h4 style={subtituloNegrita}>
						FECHA ANULACIÓN: <span style={subtituloNormal}>""</span>
					</h4>
				</Grid>
				<br />
				<Grid item xs={6} /* style={{ backgroundColor: 'purple' }} */>
					<h4 style={subtituloNegrita}>
						PROVEEDOR: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h4>
					<h4 style={subtituloNegrita}>
						RUC: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h4>
					<h4 style={subtituloNegrita}>
						CONTACTO: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h4>
					<h4 style={subtituloNegrita}>
						FORMA PAGO: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h4>
				</Grid>
				<Grid item xs={6} /* style={{ backgroundColor: 'green' }} */>
					<h4 style={subtituloNegrita}>
						EMAIL: <span style={subtituloNormal}>""</span>
					</h4>
					<h4 style={subtituloNegrita}>
						MONEDA: <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h4>
				</Grid>
				<br />
				<Grid item xs={12} /* style={{ backgroundColor: 'pink' }} */>
					<h4 style={subtituloNegrita}>FACTURAR A NOMBRE DE:</h4>
					<h4 style={subtituloNegrita}>
						RAZON SOCIAL: <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h4>
					<h4 style={subtituloNegrita}>
						R.U.C. : <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h4>
					<h4 style={subtituloNegrita}>
						DOMICILIO FISCAL: <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h4>
				</Grid>
				<br />
				<Grid item xs={12} /* style={{ backgroundColor: 'pink' }} */>
					<h4 style={subtituloNormal}>
						Agradecemos se sirvan remitirnos la(s) mercadería(s) que describimos a continuación, de
						acuerdo a las condiciones pactadas con <br />
						Uds. Las cuales confirmamos con la presente.
					</h4>
				</Grid>
				<br />
				<Grid item xs={12} /* style={{ backgroundColor: 'red' }} */>
					<TableContainer component={Paper}>
						<Table aria-label="spanning table">
							<TableHead>
								<TableRow style={{ backgroundColor: '#e1e1e1' }}>
									<TableCell align="center" style={style}>
										<h6>CÓDIGO</h6>
									</TableCell>
									<TableCell align="center" style={style}>
										<h6>DESCRIPCIÓN</h6>
									</TableCell>
									<TableCell align="center" style={style}>
										<h6>CANT</h6>
									</TableCell>
									<TableCell align="center" style={style}>
										<h6>U/M</h6>
									</TableCell>
									<TableCell align="center" style={style}>
										<h6>VALOR UNITARIO</h6>
									</TableCell>
									<TableCell align="center" style={style}>
										<h6>% DSCTO</h6>
									</TableCell>
									<TableCell align="center" style={style}>
										<h6>PRECIO UNITARIO</h6>
									</TableCell>
									<TableCell align="center" style={style}>
										<h6>TOTAL IMPORTE</h6>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dataSeleccionada.map(row => (
									<TableRow key={row.id}>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>{row.id}</h6>
										</TableCell>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>{`${row.tela} / ${row.color}`}</h6>
										</TableCell>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>590.00</h6>
										</TableCell>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>{row.um}</h6>
										</TableCell>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>US$ 8.200</h6>
										</TableCell>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>0.00</h6>
										</TableCell>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>US$ 32.200</h6>
										</TableCell>
										<TableCell style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}>
											<h6>5.695,84</h6>
										</TableCell>
									</TableRow>
								))}

								<TableRow>
									<TableCell colSpan={4} style={{ border: 'none' }} />
									<TableCell
										colSpan={2}
										style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}
									>
										<h6 style={{ fontWeight: 'bold' }}>VALOR VENTA</h6>
									</TableCell>
									<TableCell
										colSpan={2}
										style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}
									>
										<h6 style={{ fontWeight: 'bold', textAlign: 'end' }}>US$ 45.343.30</h6>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell colSpan={4} style={{ border: 'none' }} />
									<TableCell
										colSpan={2}
										style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}
									>
										<h6 style={{ fontWeight: 'bold' }}>IGV (18.00%)</h6>
									</TableCell>
									<TableCell
										colSpan={2}
										style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}
									>
										<h6 style={{ fontWeight: 'bold', textAlign: 'end' }}>US$ 7.340.21</h6>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell colSpan={4} style={{ border: 'none' }} />
									<TableCell
										colSpan={2}
										style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}
									>
										<h6 style={{ fontWeight: 'bold' }}>TOTAL IMPORTE</h6>
									</TableCell>
									<TableCell
										colSpan={2}
										style={{ wordBreak: 'break-all', border: '1px solid #ccc' }}
									>
										<h6 style={{ fontWeight: 'bold', textAlign: 'end' }}>US$ 52.340.21</h6>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>

					<div style={{ marginTop: '50px', marginBottom: '50px' }}>
						<h4 style={subtituloNegrita}>NOTAS/INDICACIONES:</h4>
						<br />
						<h4 style={subtituloNormal}>OP 21-000001</h4>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default InformacionPdf;
