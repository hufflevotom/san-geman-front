import { useMemo } from 'react';
import Tizado from './tizado';
import TablaCantidades from './tablaCantidades';

const CantidadesTizados = ({ tablaTizados, setTablaTizados, disabled, text }) => {
	const response = useMemo(() => {
		return (
			<div style={{ width: '100%' }}>
				{tablaTizados &&
					tablaTizados.map((fila, i) => {
						return (
							<div style={{ margin: '20px 20px 20px 0' }}>
								<TablaCantidades fila={fila} />
								<Tizado
									i={i}
									fila={fila}
									disabled={disabled}
									tablaTizados={tablaTizados}
									setTablaTizados={setTablaTizados}
									text={text}
								/>
							</div>
						);
					})}
			</div>
		);
	}, [tablaTizados, setTablaTizados, disabled]);

	return response;
};

export default CantidadesTizados;
