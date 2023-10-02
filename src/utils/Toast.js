import { toast } from 'react-toastify';

const showToast = (objeto, action, name) => {
	const text = {
		ok: 'Correcto',
		error: 'Alerta, Por favor vuelva a intentarlo',
		pendiente: `...`,
	};
	switch (action) {
		case 'save': {
			text.ok = `Registro guardado correctamente`;
			text.error = `Alerta al guardar, Por favor vuelva a intentarlo`;
			text.pendiente = `Guardando ${name}`;
			break;
		}
		case 'create': {
			text.ok = `Registro guardado correctamente`;
			text.error = `Alerta al guardar, Por favor vuelva a intentarlo`;
			text.pendiente = `Guardando ${name}`;
			break;
		}
		case 'update': {
			text.ok = `Registro actualizado correctamente`;
			text.error = `Alerta al actualizar, Por favor vuelva a intentarlo`;
			text.pendiente = `Actualizando ${name}`;
			break;
		}
		case 'delete': {
			text.ok = `Registro eliminado correctamente`;
			text.error = `Alerta al eliminar, Por favor vuelva a intentarlo`;
			text.pendiente = `Eliminando ${name}`;
			break;
		}
		default: {
			text.pendiente = `${name}...`;
		}
	}
	if (objeto.parametros) {
		toast.promise(
			() => objeto.promesa(...objeto.parametros),
			{
				pending: text.pendiente,
				success: {
					render({ data }) {
						console.log(data);
						if (data.payload) return `${data.payload.message}`;
						return `${data.message}`;
					},
				},
				error: {
					render({ data }) {
						console.log(data);
						if (data.payload) return `${data.payload.message}`;
						return `${data.message}`;
					},
				},
			},
			{ theme: 'colored' }
		);
	} else {
		toast.promise(
			() => objeto.promesa(),
			{
				pending: text.pendiente,
				success: {
					render({ data }) {
						console.log(data);
						if (data.payload) return `${data.payload.message}`;
						return `${data.message}`;
					},
				},
				error: {
					render({ data }) {
						console.log(data);
						if (data.payload) return `${data.payload.message}`;
						return `${data.message}`;
					},
				},
			},
			{ theme: 'colored' }
		);
	}
};

export default showToast;
