export default function obtenerColorCliente(color, colores, estilo) {
	const colorCliente = colores.find(c => {
		let res = c.color.id === color?.id;
		if (c.estilo && estilo) {
			res = res && c.estilo.id === estilo?.id;
		}
		return res;
	});
	if (!colorCliente) {
		return '-';
	}
	if (!colorCliente.colorCliente || colorCliente.colorCliente.trim() === '') {
		return '-';
	}
	return colorCliente.colorCliente;
}
