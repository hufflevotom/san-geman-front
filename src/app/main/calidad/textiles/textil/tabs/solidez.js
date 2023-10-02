/* eslint-disable no-nested-ternary */
import { TextareaAutosize } from '@mui/base';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Solidez(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const opcionesClasificacion = [
		{ id: 1, label: 'APROBADO', value: 'APROBADO' },
		{ id: 2, label: 'RECHAZADO', value: 'RECHAZADO' },
	];

	return (
		<div>
			<div className="flex flex-col mr-24 sm:mr-4 p-24" style={{ marginBottom: 20 }}>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Solidez</div>
					<Controller
						name="solidez"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = 0;

							if (value) {
								abc = value;
							}
							return (
								<TextField
									type="number"
									InputProps={{
										inputProps: { min: 0 },
									}}
									className="mt-8 mb-16 mx-12"
									error={!!errors.solidez}
									required
									helperText={errors?.solidez?.message}
									label="Solidez"
									id="solidez"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
									}}
								/>
							);
						}}
					/>
					<div className="w-full mt-8 mb-16 mx-12 flex justify-center items-center">{` `}</div>
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Clasificación</div>
					{/* <Controller
						name="apariencia"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = '';

							if (value) {
								abc = value;
							}
							return (
								<TextField
									type="text"
									className="mt-8 mb-16 mx-12"
									error={!!errors.apariencia}
									required
									helperText={errors?.apariencia?.message}
									label="Apariencia"
									id="apariencia"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
									}}
								/>
							);
						}}
					/> */}
					<Controller
						name="apariencia"
						control={control}
						render={({ field: { onChange, value } }) => {
							const val = value
								? {
										...value,
										label: value.id ? value.value : value,
								  }
								: null;

							return (
								<Autocomplete
									className="mt-8 mb-16 mx-12"
									isOptionEqualToValue={(opp, vall) => opp.label === vall.label}
									options={opcionesClasificacion || []}
									value={val}
									filterOptions={(options, state) => {
										return options;
									}}
									fullWidth
									onChange={(event, newValue) => {
										if (newValue) {
											const { label, ...valor } = newValue;
											onChange(valor);
										} else {
											onChange(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione el la clasificación"
											label="Clasificación"
											error={!!errors.apariencia}
											helperText={errors?.apariencia?.message}
											variant="outlined"
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							);
						}}
					/>
					<div className="w-full mt-8 mb-16 mx-12 flex justify-center items-center">{` `}</div>
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Comentarios</div>
					<Controller
						name="comentarios"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							const abc = value || '';
							return (
								<TextareaAutosize
									required
									value={abc}
									label="Comentarios"
									id="comentarios"
									variant="outlined"
									onChange={e => {
										onChange(e.target.value);
									}}
									aria-label="minimum height"
									minRows={3}
									placeholder="Comentarios"
									style={{
										width: '100%',
										padding: '15px',
										margin: '10px',
										border: '1px solid #ced4da',
										borderRadius: '4px',
									}}
								/>
							);
						}}
					/>
					<div className="w-full mt-8 mb-16 mx-12 flex justify-center items-center">{` `}</div>
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
			</div>
		</div>
	);
}

export default Solidez;
