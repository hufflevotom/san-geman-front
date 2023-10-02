/* eslint-disable no-restricted-syntax */
import { Controller, useFormContext } from 'react-hook-form';

import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const { IconButton, Icon } = require('@mui/material');
const { baseUrl } = require('utils/Api');

function Imagenes({ disabled }) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<>
			<Controller
				name="imagenes"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value.map(alt => {
							return (
								<FormData
									data={alt}
									onChange={onChange}
									valInicial={value}
									disabled={disabled}
									key={FuseUtils.generateGUID()}
									control={control}
									errors={errors}
								/>
							);
						});
					}
					if (!disabled)
						val.push(
							<div key={FuseUtils.generateGUID()} style={{ height: '100%' }}>
								<IconButton
									className="w-full py-14 flex items-center justify-center rounded-8 cursor-pointer shadow hover:shadow-md h-full"
									aria-label="add"
									size="medium"
									style={{
										height: '46px',
										marginLeft: '20px',
										marginRight: '40px',
										backgroundColor: val.length >= 3 ? 'gray' : 'rgb(2 136 209)',
									}}
									onClick={() => {
										onChange(
											value
												? [
														...value,
														{
															id: FuseUtils.generateGUID(),
															file: null,
															urlImagen: null,
														},
												  ]
												: [
														{
															id: FuseUtils.generateGUID(),
															file: null,
															urlImagen: null,
														},
												  ]
										);
									}}
									disabled={disabled || val.length >= 3}
								>
									<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Imágen</h5>
									&nbsp;
									<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} />
								</IconButton>
							</div>
						);
					return <div className="flex flex-wrap gap-20 h-full">{val}</div>;
				}}
			/>
		</>
	);
}

const FormData = ({ data, onChange, valInicial, disabled }) => {
	return (
		<label
			htmlFor={data.id}
			className={`flex items-center justify-center w-200 h-auto py-14 rounded-16 overflow-hidden ${
				!disabled && !data.urlImagen && 'cursor-pointer'
			} shadow hover:shadow-lg`}
		>
			<input
				disabled={disabled || (data.urlImagen && data.urlImagen !== '')}
				accept="image/*"
				className="hidden"
				id={data.id}
				type="file"
				onChange={e => {
					if (disabled) return;
					if (data.urlImagen && data.urlImagen !== '') return;
					const file = e.target.files[0];
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.file = file;
							}
						}
					}
					onChange([...valInicial]);
				}}
			/>
			{data.file ? (
				<div
					style={{
						height: '120px',
						objectFit: 'contain',
						borderRadius: '50px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<img
						className="w-full block rounded"
						src={URL.createObjectURL(data.file)}
						alt={`${data.id}-img`}
					/>
				</div>
			) : (
				<div
					style={{
						height: '120px',
						objectFit: 'contain',
						borderRadius: '50px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					{data.urlImagen ? (
						<img
							className="w-full block rounded cursor-"
							src={baseUrl + data.urlImagen}
							alt={`${data.id}-imgUrl`}
						/>
					) : (
						<div className="flex flex-col justify-center items-center gap-3 text-center">
							<Icon fontSize="large" color="action">
								cloud_upload
							</Icon>
						</div>
					)}
				</div>
			)}
			{/* <div className="flex-col justify-center items-center w-200"> */}
			{/* <div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					marginTop: '20px',
				}}
			>
				<div
					style={{
						backgroundColor: '#F5FBFA',
						borderRadius: '50px',
						height: '38px',
						width: '38px',
					}}
				>
					<IconButton
						disabled={disabled}
						aria-label="delete"
						color="error"
						onClick={() => {
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										valInicial.splice(key, 1);
									}
								}
							}
							onChange([...valInicial]);
						}}
					>
						<DeleteForeverIcon />
					</IconButton>
				</div>
			</div>  </div> */}
		</label>
	);
};

export default Imagenes;
