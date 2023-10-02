import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

function Number(props) {
	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between px-4 pt-8">
				<Typography className="text-16 px-16 font-medium" color="textSecondary">
					{props.data.title}
				</Typography>
			</div>
			<div className="text-center py-12">
				<Typography
					className={`text-72 font-semibold leading-none text-${props.data.color} tracking-tighter`}
				>
					{props.data.data.count}
				</Typography>
				<Typography className={`text-18 font-normal text-${props.data.color}-800`}>
					{props.data.data.name}
				</Typography>
			</div>
		</Paper>
	);
}

export default memo(Number);
