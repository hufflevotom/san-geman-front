import { useParams } from 'react-router-dom';

import Ingreso from './ingresos/ingresos';
import Salidas from './salidas/salidas';

function AlmacenAvio(props) {
	const routeParams = useParams();

	if (routeParams.tipo === 'ingresos') {
		return <Ingreso />;
	}
	if (routeParams.tipo === 'salidas') {
		return <Salidas />;
	}
}

export default AlmacenAvio;
