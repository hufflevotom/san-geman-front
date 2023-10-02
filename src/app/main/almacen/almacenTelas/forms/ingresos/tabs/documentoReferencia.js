import { Icon } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { baseUrl } from 'utils/Api';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import './style.css';

function DocumentoReferencia(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const getValor = getValues();

	return (
		<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 ml-16 " style={{ marginTop: '30px' }}>
			<Controller
				name="documentoReferenciaUrl"
				control={control}
				render={({ field: { onChange, value } }) => {
					let url = '';
					if (value?.file) {
						url = URL.createObjectURL(value.file);
					} else {
						url = baseUrl + value;
					}
					return (
						<>
							<label
								style={{ marginBottom: 20 }}
								htmlFor="button-file"
								className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										gap: '20px',
										alignItems: 'center',
										justifyContent: 'center',
										marginRight: '30px',
									}}
								>
									<Icon fontSize="large" color="action">
										cloud_upload
									</Icon>
									Documento de referencia:
								</div>
								<input
									accept=".pdf"
									className="uploadfile-input"
									id="button-file"
									type="file"
									// disabled={getValor.estado !== 'desarrollo'}
									onChange={async e => {
										const data = e.target.files[0];
										if (data) {
											const obj = {
												file: data,
											};
											onChange(obj);
										} else {
											onChange(null);
										}
									}}
								/>
							</label>
						</>
					);
				}}
			/>
		</div>
	);
}

const Abc = ({ url }) => {
	const aaaa = defaultLayoutPlugin();
	return (
		<div style={{ width: '100%', textAlign: 'center' }}>
			{/* <Viewer
				fileUrl={url}
				plugins={[
					// Register plugins
					aaaa,
				]}
			/> */}
		</div>
	);
};

export default DocumentoReferencia;
