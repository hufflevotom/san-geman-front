import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

function StockList(props) {
	props.data.sort((a, b) => a.stock - b.stock);
	return (
		<Card className="w-full rounded-20 shadow">
			<div className="px-8 py-20 flex flex-row items-start justify-between">
				<Typography className="h3 font-medium px-12">Avios sin stock</Typography>
			</div>

			<table className="simple clickable">
				<thead>
					<tr>
						<th aria-label="title" />
						<th className="text-right">
							<Typography color="textSecondary" className="font-semibold">
								Stock
							</Typography>
						</th>
					</tr>
				</thead>
				<tbody>
					{props.data.map(row => (
						<tr key={row.title}>
							<td className="font-semibold">{row.title}</td>
							<td className="text-right">{row.stock}</td>
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	);
}

export default memo(StockList);
