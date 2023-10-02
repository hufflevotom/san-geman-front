/* eslint-disable no-nested-ternary */
import { styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import { Controller, useFormContext } from 'react-hook-form';
import { baseUrl } from 'utils/Api';
import { Icon } from '@mui/material';
import { useEffect, useState } from 'react';
import FuseUtils from '@fuse/utils/FuseUtils';

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

function ImagenesTab({ generar, imagenes, setImagenes }) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	return (
		<Root>
			{generar !== true ? (
				<div className="flex justify-center mx-16" style={{ width: '260px', height: '120px' }}>
					<Controller
						name="imagenUrl"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<label
									style={{ width: '100%' }}
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
												onChange(obj);
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
									style={{ width: '100%' }}
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
												onChange(obj);
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
								</label>
							);
						}}
					/>
				</div>
			) : imagenes && imagenes.length > 0 ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						gap: '30px',
						width: '100%',
						margin: 0,
						padding: 0,
						marginLeft: '24px',
						marginRight: '24px',
						marginBottom: '20px',
					}}
				>
					{(imagenes || []).map((imagen, index) => (
						<div
							key={FuseUtils.generateGUID()}
							style={{ width: `calc(100/${imagenes.length < 3 ? imagenes.length : 3})` }}
						>
							<ImagenTalla i={index} form={imagen} imagenes={imagenes} setImagenes={setImagenes} />
						</div>
					))}
				</div>
			) : (
				'Ingrese una talla para poder agregar imagenes'
			)}
		</Root>
	);
}

const ImagenTalla = ({ i, form, imagenes, setImagenes }) => {
	const [imgPrinc, setImgPrinc] = useState(form.imagenPrinc);
	const [imgSec, setImgSec] = useState(form.imagenSec);

	const actualizar = (value, keyname) => {
		const data = [...imagenes];
		data[i][keyname] = value;
		setImagenes(data);
	};

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '20px',
				margin: 0,
				paddingBottom: '10px',
				marginLeft: '24px',
				marginRight: '24px',
				marginBottom: '12px,',
				borderBottom: '1px solid #e0e0e0',
			}}
		>
			<div style={{ width: '100%', marginBottom: '10px' }}>{form.talla?.talla}</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '20px',
					alignItems: 'center',
					width: '100%',
					margin: 0,
					padding: 0,
					marginLeft: '24px',
					marginRight: '24px',
					marginBottom: '20px',
				}}
			>
				<label
					style={{ width: '100%' }}
					htmlFor={`imagenPrinc${i}`}
					key={`imagenPrinc${i}`}
					className="productImageUpload flex items-center justify-center relative w-100 h-100 rounded-16 mx-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
				>
					<input
						accept="image/*"
						className="hidden"
						id={`imagenPrinc${i}`}
						type="file"
						onChange={e => {
							if (e) actualizar(e.target.files[0], 'imagenPrinc');
						}}
					/>

					{imgPrinc ? (
						<div style={{ width: '200px' }}>
							<img
								className="w-full block rounded"
								src={URL.createObjectURL(imgPrinc)}
								alt={imgPrinc}
							/>
						</div>
					) : (
						<div style={{ width: '200px', textAlign: 'center' }}>
							Principal
							<br />
							<Icon fontSize="large" color="action" style={{ marginTop: '5px' }}>
								cloud_upload
							</Icon>
						</div>
					)}
				</label>
				<label
					style={{ width: '100%' }}
					htmlFor={`imagenSec${i}`}
					key={`imagenSec${i}`}
					className="productImageUpload flex items-center justify-center relative w-100 h-100 rounded-16 mx-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
				>
					<input
						accept="image/*"
						className="hidden"
						id={`imagenSec${i}`}
						type="file"
						onChange={e => {
							if (e) actualizar(e.target.files[0], 'imagenSec');
						}}
					/>

					{imgSec ? (
						<div style={{ width: '200px' }}>
							<img
								className="w-full block rounded"
								src={URL.createObjectURL(imgSec)}
								alt={imgSec}
							/>
						</div>
					) : (
						<div style={{ width: '200px', textAlign: 'center' }}>
							Secundaria
							<br />
							<Icon fontSize="large" color="action" style={{ marginTop: '5px' }}>
								cloud_upload
							</Icon>
						</div>
					)}
				</label>
			</div>
		</div>
	);
};

export default ImagenesTab;
