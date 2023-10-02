import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import FuseUtils from '@fuse/utils/FuseUtils';

function TablaCantidades({ fila }) {
	return (
		<Table key={FuseUtils.generateGUID()}>
			<TableHead>
				<TableRow>
					<TableCell
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderLeftColor: 'rgb(233 233 233)',
							borderRightColor: 'rgb(233 233 233)',
						}}
						rowSpan={3}
						colSpan={4}
						width={200}
						align="center"
					>
						ESTILOS
					</TableCell>
					<TableCell
						style={{
							// width: '600px',
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderLeftColor: 'rgb(233 233 233)',
							borderRightColor: 'rgb(233 233 233)',
						}}
						rowSpan={1}
						colSpan={fila.tallas.length + 1}
						align="center"
					>
						CANTIDADES TOTALES
					</TableCell>
					<TableCell
						style={{
							// width: '600px',
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderLeftColor: 'rgb(233 233 233)',
							borderRightColor: 'rgb(233 233 233)',
						}}
						rowSpan={1}
						colSpan={fila.tallas.length + 1}
						align="center"
					>
						CANTIDADES A CORTAR
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						Estilo
					</TableCell>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						Descripcion
					</TableCell>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						Color
					</TableCell>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						Tela
					</TableCell>

					{fila.tallas
						.map(j => {
							return (
								<TableCell
									align="center"
									style={{
										width: '100px',
										border: '1px solid rgb(255 255 255)',
										borderBottomColor: 'rgb(224 224 224)',
										borderLeftColor: 'rgb(233 233 233)',
										borderRightColor: 'rgb(233 233 233)',
									}}
								>
									{j.prefijo}
								</TableCell>
							);
						})
						.concat(
							<TableCell
								align="center"
								style={{
									width: '100px',
									border: '1px solid rgb(255 255 255)',
									borderBottomColor: 'rgb(224 224 224)',
									borderLeftColor: 'rgb(233 233 233)',
									borderRightColor: 'rgb(233 233 233)',
								}}
							>
								Total
							</TableCell>
						)}
					{fila.tallas
						.map(j => {
							return (
								<TableCell
									align="center"
									style={{
										width: '100px',
										border: '1px solid rgb(255 255 255)',
										borderBottomColor: 'rgb(224 224 224)',
										borderLeftColor: 'rgb(233 233 233)',
										borderRightColor: 'rgb(233 233 233)',
									}}
								>
									{j.prefijo}
								</TableCell>
							);
						})
						.concat(
							<TableCell
								align="center"
								style={{
									width: '100px',
									border: '1px solid rgb(255 255 255)',
									borderBottomColor: 'rgb(224 224 224)',
									borderLeftColor: 'rgb(233 233 233)',
									borderRightColor: 'rgb(233 233 233)',
								}}
							>
								Total
							</TableCell>
						)}
				</TableRow>
				<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						{fila.detalleCantidades.estilo}
					</TableCell>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						{fila.detalleCantidades.nombre}
					</TableCell>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						{fila.detalleCantidades.color}
					</TableCell>
					<TableCell
						scope="row"
						align="center"
						style={{
							border: '1px solid rgb(255 255 255)',
							borderBottomColor: 'rgb(224 224 224)',
							borderRightColor: 'rgb(233 233 233)',
						}}
					>
						{fila.detalleCantidades.tela}
					</TableCell>

					{fila.detalleCantidades.cantidadesTotales
						.map(j => {
							return (
								<TableCell
									align="center"
									style={{
										width: '100px',
										border: '1px solid rgb(255 255 255)',
										borderBottomColor: 'rgb(224 224 224)',
										borderLeftColor: 'rgb(233 233 233)',
										borderRightColor: 'rgb(233 233 233)',
									}}
								>
									{j}
								</TableCell>
							);
						})
						.concat(
							<TableCell
								align="center"
								style={{
									width: '100px',
									border: '1px solid rgb(255 255 255)',
									borderBottomColor: 'rgb(224 224 224)',
									borderLeftColor: 'rgb(233 233 233)',
									borderRightColor: 'rgb(233 233 233)',
								}}
							>
								{fila.detalleCantidades.cantidadesTotales.reduce((a, b) => a + b, 0) || 0}
							</TableCell>
						)}
					{fila.detalleCantidades.cantidadesCorte
						.map((j, k) => {
							let suma = 0;
							fila.tizados.forEach(element => {
								suma += parseFloat(element.cantidadesTizado[k]?.cantidad || 0);
							});
							return (
								<TableCell
									align="center"
									style={{
										width: '100px',
										border: '1px solid rgb(255 255 255)',
										borderBottomColor: 'rgb(224 224 224)',
										borderLeftColor: 'rgb(233 233 233)',
										borderRightColor: 'rgb(233 233 233)',
									}}
								>
									{suma}
								</TableCell>
							);
						})
						.concat(
							<TableCell
								align="center"
								style={{
									width: '100px',
									border: '1px solid rgb(255 255 255)',
									borderBottomColor: 'rgb(224 224 224)',
									borderLeftColor: 'rgb(233 233 233)',
									borderRightColor: 'rgb(233 233 233)',
								}}
							>
								{fila.tizados.reduce(
									(a, b) =>
										a + b.cantidadesTizado.reduce((c, d) => c + parseFloat(d.cantidad || 0), 0),
									0
								) || 0}
							</TableCell>
						)}
				</TableRow>
			</TableBody>
		</Table>
	);
}

export default TablaCantidades;
