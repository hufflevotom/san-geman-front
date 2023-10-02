import { styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import { Controller, useFormContext } from 'react-hook-form';
import { baseUrl } from 'utils/Api';
import { Icon } from '@mui/material';

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0,
	},

	'& .productImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
	},

	'& .productImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .productImageFeaturedStar': {
				opacity: 0.8,
			},
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .productImageFeaturedStar': {
				opacity: 1,
			},
			'&:hover .productImageFeaturedStar': {
				opacity: 1,
			},
		},
	},
}));

function ImagenesTab() {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	return (
		<Root>
			<div className="flex justify-center mx-16" style={{ width: '260px', height: '120px' }}>
				<Controller
					name="imagenUrl"
					control={control}
					render={({ field: { onChange, value } }) => {
						return (
							<label
								style={{ width: '100%', position: 'relative' }}
								htmlFor={1}
								className="productImageUpload flex items-center justify-center relative w-100 h-100 rounded-16 mx-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
							>
								<input
									accept="image/*"
									className="hidden"
									id={1}
									type="file"
									onChange={e => {
										if (e) {
											const data = e.target.files[0];
											const obj = {
												file: data,
											};
											if (data) {
												onChange(obj);
											}
										} else {
											onChange(null);
										}
									}}
								/>

								{value ? (
									<div style={{ width: '100%' }}>
										{value.file ? (
											<img
												className="w-full block rounded"
												src={URL.createObjectURL(value.file)}
												alt={value.file}
											/>
										) : (
											<img className="w-full block rounded" src={baseUrl + value} alt={value} />
										)}
									</div>
								) : (
									<div style={{ width: '100%', textAlign: 'center' }}>
										Principal
										<br />
										<Icon fontSize="large" color="action" style={{ marginTop: '5px' }}>
											cloud_upload
										</Icon>
									</div>
								)}
								{value ? (
									<div
										style={{
											position: 'absolute',
											right: 0,
											top: 0,
											width: 35,
											height: 30,
											// backgroundColor: 'black',
										}}
									>
										<Icon
											fontSize="large"
											color="action"
											style={{ marginTop: '5px', color: 'red', fontSize: 30 }}
											onClick={() => {
												onChange(null);
											}}
										>
											delete
										</Icon>
									</div>
								) : null}
							</label>
						);
					}}
				/>
				<Controller
					name="imagenUrlSec"
					control={control}
					render={({ field: { onChange, value } }) => {
						return (
							<label
								style={{ width: '100%', position: 'relative' }}
								htmlFor={2}
								className="productImageUpload flex items-center justify-center relative w-100 h-100 rounded-16 mx-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
							>
								<input
									accept="image/*"
									className="hidden"
									id={2}
									type="file"
									onChange={e => {
										if (e) {
											const data = e.target.files[0];
											const obj = {
												file: data,
											};
											if (data) {
												onChange(obj);
											}
										} else {
											onChange(null);
										}
									}}
								/>

								{value ? (
									<div style={{ width: '100%' }}>
										{value.file ? (
											<img
												className="w-full block rounded"
												src={URL.createObjectURL(value.file)}
												alt={value.file}
											/>
										) : (
											<img className="w-full block rounded" src={baseUrl + value} alt={value} />
										)}
									</div>
								) : (
									<div style={{ width: '100%', textAlign: 'center' }}>
										Secundaria
										<br />
										<Icon fontSize="large" color="action" style={{ marginTop: '5px' }}>
											cloud_upload
										</Icon>
									</div>
								)}
								{value ? (
									<div
										style={{
											position: 'absolute',
											right: 0,
											top: 0,
											width: 35,
											height: 30,
											// backgroundColor: 'black',
										}}
									>
										<Icon
											fontSize="large"
											color="action"
											style={{ marginTop: '5px', color: 'red', fontSize: 30 }}
											onClick={() => {
												onChange(null);
											}}
										>
											delete
										</Icon>
									</div>
								) : null}
							</label>
						);
					}}
				/>
			</div>
		</Root>
	);
}

export default ImagenesTab;
