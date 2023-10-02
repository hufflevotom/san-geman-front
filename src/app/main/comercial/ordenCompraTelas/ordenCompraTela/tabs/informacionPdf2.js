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

const InfoPdf = ({ impresionRef }) => {
	const subtituloNegrita = { fontWeight: 'bold' };
	const subtituloNormal = { fontWeight: 'normal' };

	const obj = [
		{
			id: 'FT-0002-ABCDE455',
			tela: 'JERSEY LISTADO - 30/1 - 100% COTTON - KG',
			color: 'ABC44',
			cantidad: 0,
			um: 'KILOGRAMOS',
		},
		{
			id: 'TFX-0002-ASASDSADASDASD12312314',
			tela: 'TEXFLEX aea - 20/1 - 100% COTTON - KG',
			color: 'perro 123',
			cantidad: 0,
			um: 'KILOGRAMOS',
		},
		{
			id: 'JR-0001-VR2',
			tela: 'JERSEY PIMA - PRUEBA 12 - PRUEBA 13 - KG',
			color: 'VERDE',
			cantidad: 0,
			um: 'KILOGRAMOS',
		},
	];

	const style = {
		border: '1px solid #ccc',
	};

	return (
		<div ref={impresionRef} /* style={{ backgroundColor: 'gray' }} */>
			<Grid container spacing={2}>
				<Grid item xs={4} /*  style={{ backgroundColor: 'red' }} */>
					<img
						src="https://cdn.discordapp.com/attachments/700828906881810623/959668075505021018/logo-white.png"
						alt=""
						width={240}
					/>
				</Grid>
				<Grid item xs={4} /* style={{ backgroundColor: 'blue' }} */>
					<h2 style={subtituloNegrita}>ORDEN DE COMPRA: 0C-21-0000065</h2>
				</Grid>
				<Grid item xs={4} style={{ /* backgroundColor: 'yellow', */ marginTop: '20px' }}>
					<h2 style={subtituloNegrita}>
						FECHA EMISIÓN: <span style={subtituloNormal}>21/07/2021</span>
					</h2>
					<h2 style={subtituloNegrita}>
						FECHA ENTREGA: <span style={subtituloNormal}>21/07/2021</span>
					</h2>
					<h2 style={subtituloNegrita}>
						FECHA ANULACIÓN: <span style={subtituloNormal}>""</span>
					</h2>
				</Grid>
				<br />
				<Grid item xs={6} /* style={{ backgroundColor: 'purple' }} */>
					<h2 style={subtituloNegrita}>
						PROVEEDOR: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h2>
					<h2 style={subtituloNegrita}>
						RUC: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h2>
					<h2 style={subtituloNegrita}>
						CONTACTO: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h2>
					<h2 style={subtituloNegrita}>
						FORMA PAGO: <span style={subtituloNormal}>SUR COLOR START S.A</span>
					</h2>
				</Grid>
				<Grid item xs={6} /* style={{ backgroundColor: 'green' }} */>
					<h2 style={subtituloNegrita}>
						EMAIL: <span style={subtituloNormal}>""</span>
					</h2>
					<h2 style={subtituloNegrita}>
						MONEDA: <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h2>
				</Grid>
				<br />
				<Grid item xs={12} /* style={{ backgroundColor: 'pink' }} */>
					<h2 style={subtituloNegrita}>FACTURAR A NOMBRE DE:</h2>
					<h2 style={subtituloNegrita}>
						RAZON SOCIAL: <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h2>
					<h2 style={subtituloNegrita}>
						R.U.C. : <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h2>
					<h2 style={subtituloNegrita}>
						DOMICILIO FISCAL: <span style={subtituloNormal}>DOLARES AMERICANOS</span>
					</h2>
				</Grid>
				<br />
				<Grid item xs={12} /* style={{ backgroundColor: 'pink' }} */>
					<h2 style={subtituloNormal}>
						Agradecemos se sirvan remitirnos la(s) mercadería(s) que describimos a continuación, de
						acuerdo a las condiciones pactadas con <br />
						Uds. Las cuales confirmamos con la presente.
					</h2>
				</Grid>
				<br />
				<Grid item xs={12} /* style={{ backgroundColor: 'red' }} */>
					<TableContainer component={Paper}>
						<Table aria-label="spanning table">
							<TableHead>
								<TableRow style={{ backgroundColor: '#e1e1e1' }}>
									<TableCell align="center" style={style}>
										<h3>CÓDIGO</h3>
									</TableCell>
									<TableCell align="center" style={style}>
										<h3>DESCRIPCIÓN</h3>
									</TableCell>
									<TableCell align="center" style={style}>
										<h3>CANT</h3>
									</TableCell>
									<TableCell align="center" style={style}>
										<h3>U/M</h3>
									</TableCell>
									<TableCell align="center" style={style}>
										<h3>VALOR UNITARIO</h3>
									</TableCell>
									<TableCell align="center" style={style}>
										<h3>% DSCTO</h3>
									</TableCell>
									<TableCell align="center" style={style}>
										<h3>PRECIO UNITARIO</h3>
									</TableCell>
									<TableCell align="center" style={style}>
										<h3>TOTAL IMPORTE</h3>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{obj.map(row => (
									<TableRow key={row.id}>
										<TableCell style={style}>
											<h3>{row.id}</h3>
										</TableCell>
										<TableCell style={style}>
											<h3>{`${row.tela} / ${row.color}`}</h3>
										</TableCell>
										<TableCell style={style}>
											<h3>590.00</h3>
										</TableCell>
										<TableCell style={style}>
											<h3>{row.um}</h3>
										</TableCell>
										<TableCell style={style} align="center">
											<h3>US$ 8.200</h3>
										</TableCell>
										<TableCell style={style} align="center">
											<h3>0.00</h3>
										</TableCell>
										<TableCell style={style} align="center">
											<h3>US$ 32.200</h3>
										</TableCell>
										<TableCell style={style} align="center">
											<h3>5.695,84</h3>
										</TableCell>
									</TableRow>
								))}

								<TableRow>
									<TableCell colSpan={4} style={{ border: 'none' }} />
									<TableCell colSpan={2} style={style}>
										<h3 style={{ fontWeight: 'bold' }}>VALOR VENTA</h3>
									</TableCell>
									<TableCell colSpan={2} style={style}>
										<h3 style={{ fontWeight: 'bold', textAlign: 'end' }}>US$ 45.343.30</h3>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell colSpan={4} style={{ border: 'none' }} />
									<TableCell colSpan={2} style={style}>
										<h3 style={{ fontWeight: 'bold' }}>IGV (18.00%)</h3>
									</TableCell>
									<TableCell colSpan={2} style={style}>
										<h3 style={{ fontWeight: 'bold', textAlign: 'end' }}>US$ 7.340.21</h3>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell colSpan={4} style={{ border: 'none' }} />
									<TableCell colSpan={2} style={style}>
										<h3 style={{ fontWeight: 'bold' }}>TOTAL IMPORTE</h3>
									</TableCell>
									<TableCell colSpan={2} style={style}>
										<h3 style={{ fontWeight: 'bold', textAlign: 'end' }}>US$ 52.340.21</h3>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>

					<div style={{ marginTop: '50px', marginBottom: '50px' }}>
						<h3 style={subtituloNegrita}>NOTAS/INDICACIONES:</h3>
						<br />
						<h3 style={subtituloNormal}>OP 21-000001</h3>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default InfoPdf;
