import { useParams } from 'react-router-dom';

import Ingreso from './ingresos/ingresos';
import Salidas from './salidas/salidas';

function AlmacenTela(props) {
	const routeParams = useParams();

	if (routeParams.tipo === 'ingreso') {
		return <Ingreso />;
	}
	if (routeParams.tipo === 'salida') {
		return <Salidas />;
	}
}

export default AlmacenTela;
