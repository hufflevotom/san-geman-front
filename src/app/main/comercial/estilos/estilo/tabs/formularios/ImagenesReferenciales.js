import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import { baseUrl } from 'utils/Api';

/* eslint-disable import/prefer-default-export */
const { Icon } = require('@mui/material');

export const ImagenesReferencialesForm = ({ disabled }) => {
	const methods = useFormContext();
	const { control, formState, watch, setValue, getValues } = methods;
	const { errors } = formState;

	const telaPrincipal = watch('telaPrincipal');

	let colores = [];
	if (telaPrincipal && telaPrincipal.colores)
		colores = telaPrincipal.colores.map(e => ({
			...e,
			label: e.label || e.descripcion,
		}));

	useEffect(() => {
		const arrImages = [];
		const imgs = getValues('imagenesReferenciales') || [];
		if (telaPrincipal && telaPrincipal.colores) {
			telaPrincipal.colores.forEach(element => {
				if (imgs.length > 0) {
					const imageFound = imgs.find(img => img.id === element.id);
					if (!imageFound) {
						arrImages.push(element);
					} else {
						arrImages.push(imageFound);
					}
				} else {
					arrImages.push(element);
				}
			});
		}
		setValue('imagenesReferenciales', [...arrImages]);
	}, [getValues, setValue, telaPrincipal, telaPrincipal?.colores]);

	return (
		<>
			<hr />
			<div className="mx-6 mb-8 mt-16 text-base">Imágenes referenciales</div>
			<Controller
				name="imagenesReferenciales"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value.map(alt => {
							return (
								<FormData
									key={FuseUtils.generateGUID()}
									control={control}
									errors={errors}
									data={alt}
									onChange={onChange}
									valInicial={value}
									colores={colores}
									disabled={disabled}
								/>
							);
						});
					}

					return <div className="flex flex-wrap gap-20">{val}</div>;
				}}
			/>
		</>
	);
};

const FormData = ({ data, onChange, valInicial, disabled }) => {
	return (
		<label
			htmlFor={data.id + data.codigo + data.descripcion}
			className={`flex items-center justify-center w-200 h-auto py-14 rounded-16 overflow-hidden ${
				!disabled && 'cursor-pointer'
			} shadow hover:shadow-lg`}
		>
			<input
				disabled={disabled}
				accept="image/*"
				className="hidden"
				id={data.id + data.codigo + data.descripcion}
				type="file"
				onChange={e => {
					if (disabled) return;
					const file = e.target.files[0];
					// eslint-disable-next-line no-restricted-syntax
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
						alt={data.codigo}
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
							className="w-full block rounded"
							src={baseUrl + data.urlImagen}
							alt={data.codigo}
						/>
					) : (
						<div className="flex flex-col justify-center items-center gap-3 text-center">
							<Icon fontSize="large" color="action">
								cloud_upload
							</Icon>
							{data.descripcion}
						</div>
					)}
				</div>
			)}
		</label>
	);
};
