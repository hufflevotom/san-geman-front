import React, { useEffect } from 'react';
import { Icon, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FuseUtils from '@fuse/utils';
import { baseUrl } from 'utils/Api';

function AlternativasTab(props) {
	const methods = useFormContext();
	const { control, formState, setValue } = methods;
	const { errors } = formState;
	const [valInicial, setValInicial] = React.useState(true);

	useEffect(() => {
		if (!valInicial) {
			setValue('alternativas', [{ id: FuseUtils.generateGUID(), nombre: '' }]);
		}
	}, [valInicial]);

	return (
		<div
			className="flex flex-row sm:flex-row mr-24 sm:mr-4"
			style={{ overflowY: 'scroll', flexWrap: 'wrap' }}
		>
			<Controller
				name="alternativas"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value.map(alt => {
							return (
								<Alt
									key={alt.id}
									control={control}
									errors={errors}
									data={alt}
									onChange={onChange}
									valInicial={value}
								/>
							);
						});
					}

					// val.push(
					// 	<div
					// 		key="add"
					// 		style={{
					// 			width: '40%',
					// 			alignContent: 'center',
					// 			alignItems: 'center',
					// 			display: 'flex',
					// 			justifyContent: 'center',
					// 		}}
					// 	>
					// 		<IconButton
					// 			aria-label="add"
					// 			size="large"
					// 			color="primary"
					// 			onClick={() => {
					// 				onChange(
					// 					value
					// 						? [...value, { id: FuseUtils.generateGUID(), nombre: '' }]
					// 						: [{ id: FuseUtils.generateGUID(), nombre: '' }]
					// 				);
					// 			}}
					// 		>
					// 			<AddBoxIcon style={{ fontSize: '40px' }} />
					// 		</IconButton>
					// 	</div>
					// );
					if (val.length === 0) {
						setValInicial(false);
					}
					return val;
				}}
			/>
		</div>
	);
}

const Alt = props => {
	const { control, errors, data, onChange, valInicial } = props;
	return (
		<div
			className="flex flex-col sm:flex-row  sm:mr-4"
			style={{
				alignItems: 'center',
				width: '49%',
				margin: 0,
				padding: 0,
				marginLeft: '12px',
				marginBottom: '12px',
			}}
		>
			<TextField
				placeholder="Ingrese la alternativa"
				label="Alternativa"
				variant="outlined"
				fullWidth
				value={data.nombre}
				onChange={newValue => {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.nombre = newValue.target.value;
							}
						}
					}
					onChange([...valInicial]);
				}}
				error={!!errors.alternativas}
				helperText={errors?.alternativas?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/>

			{/* <label
				htmlFor={data.id}
				className="productImageUpload flex items-center justify-center relative w-80 h-80 rounded-16 mx-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
			>
				<input
					accept="image/*"
					className="hidden"
					id={data.id}
					type="file"
					onChange={e => {
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
					<img
						className="w-full block rounded"
						src={URL.createObjectURL(data.file)}
						alt={data.nombre}
					/>
				) : (
					<div>
						{data.imagenUrl ? (
							<img
								className="w-full block rounded"
								src={baseUrl + data.imagenUrl}
								alt={data.nombre}
							/>
						) : (
							<Icon fontSize="large" color="action">
								cloud_upload
							</Icon>
						)}
					</div>
				)}
			</label> */}
		</div>
	);
};

export default AlternativasTab;
