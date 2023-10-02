/* eslint-disable no-nested-ternary */
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Encogimiento(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div>
			<div className="flex flex-col mr-24 sm:mr-4 p-24" style={{ marginBottom: 20 }}>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Estandar</div>
					<Controller
						name="encogimientoEstandarLargo"
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
									disabled
									className="mt-8 mb-16 mx-12"
									error={!!errors.encogimientoEstandarLargo}
									required
									helperText={errors?.encogimientoEstandarLargo?.message}
									label="Largo"
									id="encogimientoEstandarLargo"
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
					<Controller
						name="encogimientoEstandarAncho"
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
									disabled
									className="mt-8 mb-16 mx-12"
									error={!!errors.encogimientoEstandarAncho}
									required
									helperText={errors?.encogimientoEstandarAncho?.message}
									label="Ancho"
									id="encogimientoEstandarAncho"
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
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Promedio 1ra lavada</div>
					<Controller
						name="encogimiento1largo"
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
									error={!!errors.encogimiento1largo}
									required
									helperText={errors?.encogimiento1largo?.message}
									label="Largo"
									id="encogimiento1largo"
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
					<Controller
						name="encogimiento1ancho"
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
									error={!!errors.encogimiento1ancho}
									required
									helperText={errors?.encogimiento1ancho?.message}
									label="Ancho"
									id="encogimiento1ancho"
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
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Promedio 2da lavada</div>
					<Controller
						name="encogimiento2largo"
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
									error={!!errors.encogimiento2largo}
									required
									helperText={errors?.encogimiento2largo?.message}
									label="Largo"
									id="encogimiento2largo"
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
					<Controller
						name="encogimiento2ancho"
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
									error={!!errors.encogimiento2ancho}
									required
									helperText={errors?.encogimiento2ancho?.message}
									label="Ancho"
									id="encogimiento2ancho"
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
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Promedio 3ra lavada</div>
					<Controller
						name="encogimiento3largo"
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
									error={!!errors.encogimiento3largo}
									required
									helperText={errors?.encogimiento3largo?.message}
									label="Largo"
									id="encogimiento3largo"
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
					<Controller
						name="encogimiento3ancho"
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
									error={!!errors.encogimiento3ancho}
									required
									helperText={errors?.encogimiento3ancho?.message}
									label="Ancho"
									id="encogimiento3ancho"
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
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
			</div>
		</div>
	);
}

export default Encogimiento;
