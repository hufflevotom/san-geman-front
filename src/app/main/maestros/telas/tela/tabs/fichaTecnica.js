import { Icon } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { baseUrl } from 'utils/Api';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

function FichaTecnica(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const getValor = getValues();

	return (
		<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 ml-16 ">
				<Controller
					name="fichaTecnicaUrl"
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
								{getValor.estado !== 'desarrollo' ? (
									<div />
								) : (
									<label
										style={{ marginBottom: 20 }}
										htmlFor="button-file"
										className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
									>
										<input
											accept=".xlsx, .xls, .pdf, "
											className="hidden"
											id="button-file"
											type="file"
											disabled={getValor.estado !== 'desarrollo'}
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
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												gap: '20px',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Icon fontSize="large" color="action">
												cloud_upload
											</Icon>
											Ficha Técnica
										</div>
									</label>
								)}
								{value ? <Abc url={url} /> : null}
							</>
						);
					}}
				/>
			</div>
		</Worker>
	);
}

const Abc = ({ url }) => {
	const aaaa = defaultLayoutPlugin();
	return (
		<div style={{ width: '100%', textAlign: 'center' }}>
			<Viewer
				fileUrl={url}
				plugins={[
					// Register plugins
					aaaa,
				]}
			/>
		</div>
	);
};

export default FichaTecnica;
