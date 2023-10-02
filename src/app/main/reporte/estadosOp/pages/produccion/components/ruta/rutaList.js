import React, { useEffect, useState } from 'react';

export default function RutaTable({ estilos }) {
	const [rutas, setRutas] = useState();

	useEffect(() => {
		if (estilos) console.log(estilos);
	}, []);

	return <div>RutaTable</div>;
}
