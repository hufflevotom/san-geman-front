/* eslint-disable dot-notation */
import { useState } from 'react';
import FuseUtils from '@fuse/utils';
import { TextField } from '@mui/material';

const DatoTelaReal = ({ currentObservaciones, setCurrentObservaciones, disabled, text }) => {
	return (
		<div
			key={FuseUtils.generateGUID()}
			style={{ width: '100%', marginRight: '40px', marginTop: '20px' }}
		>
			<hr />
			<div className="mx-6 mb-16 mt-16 text-base">Datos de tela reales</div>
			{currentObservaciones.map((form, index) => (
				<div key={FuseUtils.generateGUID()} className="flex flex-wrap mb-16">
					<Tela
						i={index}
						form={form}
						observaciones={currentObservaciones}
						setObservaciones={setCurrentObservaciones}
						disabled={disabled}
						text={text}
					/>
				</div>
			))}
		</div>
	);
};

const Tela = ({ i, form, observaciones, setObservaciones, disabled, text }) => {
	const [telaProgramada, setTelaProgramada] = useState((form.telaProgramada || 0).toFixed(2));

	const actualizarTelaProgramada = (value, keyname) => {
		const data = [...observaciones];
		data[i][keyname] = parseFloat(value || 0);
		let tela = parseFloat(value || 0);
		const partidas = data[i].partidas.map(partida => {
			if (tela >= partida.cantidadAlmacen) {
				partida.telaProgramada = partida.cantidadAlmacen;
				tela -= partida.cantidadAlmacen;
			} else {
				partida.telaProgramada = tela;
				tela = 0;
			}
			return partida;
		});
		data[i].partidas = partidas;
		setObservaciones(data);
	};

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '20px',
				margin: 0,
				paddingBottom: '10px',
				marginLeft: '24px',
				marginRight: '24px',
				marginBottom: '12px,',
				borderBottom: '1px solid #e0e0e0',
			}}
		>
			<div style={{ width: '100%', marginBottom: '10px' }}>{form.tela?.nombre}</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '20px',
					alignItems: 'center',
					width: '100%',
					margin: 0,
					padding: 0,
					marginLeft: '24px',
					marginRight: '24px',
					marginBottom: '20px',
				}}
			>
				{text ? (
					<div className="pr-8">Suma de Pesos: {form.sumaPesos}</div>
				) : (
					<TextField
						id="sumaPesos"
						key={`sumaPesos${i}`}
						name="sumaPesos"
						placeholder="Suma de Pesos"
						label="Suma de Pesos"
						variant="outlined"
						disabled
						fullWidth
						value={(form.sumaPesos || 0).toFixed(2)}
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
					/>
				)}
				{text ? (
					<div>Tela Programada: {telaProgramada}</div>
				) : (
					<TextField
						id="telaProgramada"
						key={`telaProgramada${i}`}
						name="telaProgramada"
						placeholder="Programada"
						label="Tela Programada"
						variant="outlined"
						fullWidth
						disabled={disabled}
						value={telaProgramada}
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						onBlur={() => {
							actualizarTelaProgramada(telaProgramada, 'telaProgramada');
						}}
						onChange={event => {
							setTelaProgramada(event.target.value);
						}}
					/>
				)}
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '25px',
					alignItems: 'center',
					width: '100%',
					margin: 0,
					paddingBottom: '10px',
					marginLeft: '24px',
					marginRight: '24px',
					marginBottom: '20px',
					borderBottom: '1px solid #e0e0e0',
				}}
			>
				<div style={{ width: '22%' }}>Partida</div>
				<div style={{ width: '13%', textAlign: 'right' }}>Cantidad</div>
				<div style={{ width: '13%', textAlign: 'right' }}>Reserva</div>
				<div style={{ width: '13%', textAlign: 'right' }}>Densidad</div>
				<div style={{ width: '13%', textAlign: 'right' }}>Ancho</div>
				<div style={{ width: '13%', textAlign: 'right' }}>Tela programada</div>
				<div style={{ width: '13%', textAlign: 'right' }}>Saldo Teórico</div>
			</div>
			{(form.partidas || []).map((partida, index) => (
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '25px',
						alignItems: 'center',
						width: '100%',
						margin: 0,
						padding: 0,
						marginLeft: '24px',
						marginRight: '24px',
						marginBottom: '20px',
					}}
				>
					<div style={{ width: '22%' }}>{partida.partida}</div>
					<div style={{ width: '13%', textAlign: 'right' }}>
						{partida.cantidadAlmacen.toFixed(2) || 0} kg
					</div>
					<div style={{ width: '13%', textAlign: 'right' }}>
						{partida.reservado.toFixed(2) || 0} kg
					</div>
					<div style={{ width: '13%', textAlign: 'right' }}>
						{partida.densidadReal.toFixed(2) || 0}
					</div>
					<div style={{ width: '13%', textAlign: 'right' }}>
						{partida.anchoReal.toFixed(2) || 0}
					</div>
					<div style={{ width: '13%', textAlign: 'right' }}>
						{partida.telaProgramada.toFixed(2) || 0}
					</div>
					<div style={{ width: '13%', textAlign: 'right' }}>
						{(partida.cantidadAlmacen - partida.telaProgramada).toFixed(2) || 0} kg
					</div>
				</div>
			))}
		</div>
	);
};
export default DatoTelaReal;
