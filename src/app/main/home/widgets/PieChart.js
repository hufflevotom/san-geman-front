import _ from '@lodash';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import ReactApexChart from 'react-apexcharts';

function PieChart(props) {
	const theme = useTheme();
	const data = _.merge({}, props.data);

	_.setWith(data, 'options.theme.monochrome.color', theme.palette.primary.main);

	return (
		<Card className="w-full rounded-20 shadow p-20">
			<div className="pb-24">
				<Typography className="h3 font-medium">{props.title}</Typography>
			</div>

			<div className="h-256 relative">
				<ReactApexChart
					options={data.options}
					series={data.series}
					type={data.options.chart.type}
					height={data.options.chart.height}
				/>
			</div>

			<div className="flex flex-col items-center justify-center">
				{data.labels.map((label, index) => (
					<div
						key={label}
						className="px-10 w-full flex flex-row items-center justify-between border-t gap-7"
					>
						<Typography className="w-4/6 text-14 font-semibold" color="textSecondary">
							{label}
						</Typography>
						<Typography className="w-1/6 text-14 font-semibold py-8">
							{data.series[index]}
						</Typography>
						<Typography className="w-1/6 text-14 font-semibold py-8">
							{((data.series[index] * 100) / data.total).toFixed(1)}%
						</Typography>

						{/* <div className="flex flex-row items-start justify-center">
							{data.series[index] < 0 && <Icon className="text-18 text-red">arrow_downward</Icon>}

							{data.series[index] > 0 && <Icon className="text-18 text-green">arrow_upward</Icon>}
							<Typography className="h5 px-4 font-semibold" color="textSecondary">
								{data.series[index]}%
							</Typography>
						</div>  */}
					</div>
				))}
			</div>
		</Card>
	);
}

export default memo(PieChart);
