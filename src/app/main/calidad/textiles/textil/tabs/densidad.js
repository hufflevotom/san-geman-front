/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Densidad(props) {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const densidadTela = watch('densidadTela');
	const anchoTela = watch('anchoTela');
	const densidadAntesLavadoEstandar = watch('densidadAntesLavadoEstandar');
	const densidadAntesLavadoReal = watch('densidadAntesLavadoReal');
	const denstidadDespuesLavadoEstandar = watch('denstidadDespuesLavadoEstandar');
	const denstidadDespuesLavadoReal = watch('denstidadDespuesLavadoReal');
	const anchoDelRolloEstandar = watch('anchoDelRolloEstandar');
	const anchoDelRolloReal = watch('anchoDelRolloReal');
	const anchoDeReposoReal = watch('anchoDeReposoReal');

	const porcDensidad =
		densidadTela === 0
			? 0
			: isNaN((parseFloat(densidadAntesLavadoReal) * 100) / parseFloat(densidadTela))
			? 0
			: (parseFloat(densidadAntesLavadoReal) * 100) / parseFloat(densidadTela);
	const porcAncho =
		anchoTela === 0
			? 0
			: isNaN((parseFloat(anchoDelRolloReal) * 100) / parseFloat(anchoTela))
			? 0
			: (parseFloat(anchoDelRolloReal) * 100) / parseFloat(anchoTela);

	return (
		<div>
			<div className="flex flex-col mr-24 sm:mr-4 p-24" style={{ marginBottom: 20 }}>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Densidad antes del lavado</div>
					<Controller
						name="densidadTela"
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
									error={!!errors.densidadTela}
									required
									helperText={errors?.densidadTela?.message}
									label="Estandar"
									id="densidadTela"
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
						name="densidadAntesLavadoEstandar"
						className="w-1/4 hidden"
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
									className="mt-8 mb-16 mx-12 hidden"
									error={!!errors.densidadAntesLavadoEstandar}
									required
									helperText={errors?.densidadAntesLavadoEstandar?.message}
									label="Estandar"
									id="densidadAntesLavadoEstandar"
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
						name="densidadAntesLavadoReal"
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
									error={!!errors.densidadAntesLavadoReal}
									required
									helperText={errors?.densidadAntesLavadoReal?.message}
									label="Real"
									id="densidadAntesLavadoReal"
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
					<div
						className="w-1/3 flex justify-center items-center"
						style={{ color: porcDensidad - 100 < -5 || porcDensidad - 100 > 5 ? 'red' : 'black' }}
					>{`${(porcDensidad - 100).toFixed(2)} %`}</div>
				</div>
				<div className="flex flex-row w-full hidden">
					<div className="w-1/2 flex justify-start items-center">Densidad después del lavado</div>
					<Controller
						name="denstidadDespuesLavadoEstandar"
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
									error={!!errors.denstidadDespuesLavadoEstandar}
									required
									helperText={errors?.denstidadDespuesLavadoEstandar?.message}
									label="Estandar"
									id="denstidadDespuesLavadoEstandar"
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
						name="denstidadDespuesLavadoReal"
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
									error={!!errors.denstidadDespuesLavadoReal}
									required
									helperText={errors?.denstidadDespuesLavadoReal?.message}
									label="Real"
									id="denstidadDespuesLavadoReal"
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
					<div className="w-1/3 flex justify-center items-center">{`${
						denstidadDespuesLavadoEstandar === 0
							? '0.00'
							: (isNaN(
									parseFloat(denstidadDespuesLavadoReal) /
										parseFloat(denstidadDespuesLavadoEstandar)
							  )
									? 0
									: parseFloat(denstidadDespuesLavadoReal) /
									  parseFloat(denstidadDespuesLavadoEstandar)
							  ).toFixed(2)
					} %`}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Ancho del rollo</div>
					<Controller
						name="anchoTela"
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
									error={!!errors.anchoTela}
									required
									helperText={errors?.anchoTela?.message}
									label="Estandar"
									id="anchoTela"
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
						name="anchoDelRolloEstandar"
						className="w-1/4 hidden"
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
									className="mt-8 mb-16 mx-12 hidden"
									error={!!errors.anchoDelRolloEstandar}
									required
									helperText={errors?.anchoDelRolloEstandar?.message}
									label="Estandar"
									id="anchoDelRolloEstandar"
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
						name="anchoDelRolloReal"
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
									error={!!errors.anchoDelRolloReal}
									required
									helperText={errors?.anchoDelRolloReal?.message}
									label="Real"
									id="anchoDelRolloReal"
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
					<div
						className="w-1/3 flex justify-center items-center"
						style={{ color: porcAncho - 100 < -5 || porcAncho - 100 > 5 ? 'red' : 'black' }}
					>{`${(porcAncho - 100).toFixed(2)} %`}</div>
				</div>
				<div className="flex flex-row w-full hidden">
					<div className="w-1/2 flex justify-start items-center">Ancho de reposo</div>
					<div className="w-full mt-8 mb-16 mx-12 flex justify-center items-center">-</div>
					<Controller
						name="anchoDeReposoReal"
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
									error={!!errors.anchoDeReposoReal}
									required
									helperText={errors?.anchoDeReposoReal?.message}
									label="Real"
									id="anchoDeReposoReal"
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
					<div className="w-1/3 flex justify-center items-center">{`${
						anchoDelRolloEstandar === 0
							? '0.00'
							: (isNaN(parseFloat(anchoDeReposoReal) / parseFloat(anchoDelRolloEstandar))
									? 0
									: parseFloat(anchoDeReposoReal) / parseFloat(anchoDelRolloEstandar)
							  ).toFixed(2)
					} %`}</div>
				</div>
			</div>
		</div>
	);
}

export default Densidad;
