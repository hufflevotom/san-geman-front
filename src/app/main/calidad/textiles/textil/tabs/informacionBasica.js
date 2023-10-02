/* eslint-disable no-nested-ternary */
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Partida(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div>
			<div className="flex flex-col mr-24 sm:mr-4 p-24" style={{ marginBottom: 20 }}>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Partida</div>
					<Controller
						name="productoTelaId"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = null;

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
									error={!!errors.productoTelaId}
									required
									helperText={errors?.productoTelaId?.message}
									label="Número de partida"
									id="productoTelaId"
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
			</div>
		</div>
	);
}

export default Partida;
