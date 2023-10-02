import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import _ from '@lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Backdrop, Box, Button, Fade, Icon, InputAdornment, Modal, TextField } from '@mui/material';
import httpClient from 'utils/Api';

const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	pin: yup
		.string()
		.required('Ingrese el pin de seguridad.')
		.length(6, 'El pin debe tener 6 dígitos'),
});

const defaultValues = {
	email: '',
	pin: '',
};

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '350px',
	height: '380px',
	overflowY: 'scroll',
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
};

const ModalConfirmPin = ({ visible, setVisible, callback, message, okTitle, cancelTitle }) => {
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema),
	});
	const { isValid, dirtyFields, errors } = formState;

	const authPin = async data => {
		try {
			const response = await httpClient.post('/auth/pin', data);
			if (response.data.statusCode === 200) {
				callback(response.data.body);
				setVisible(false);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || 'Ocurrió un error. Por favor, inténtalo de nuevo.'
			);
		}
	};

	return (
		<Modal
			width={500}
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={visible}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={visible}>
				<Box sx={style}>
					{message && (
						<div style={{ marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
							{message}
						</div>
					)}
					<form
						className="flex flex-col justify-center w-full"
						onSubmit={handleSubmit(authPin)}
						autoComplete="off"
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									name="mail"
									id="mail"
									required
									error={!!errors.email}
									helperText={errors?.email?.message}
									label="Email"
									variant="outlined"
								/>
							)}
						/>

						<Controller
							name="pin"
							control={control}
							render={({ field: { onChange, ...properties } }) => (
								<TextField
									{...properties}
									type="password"
									name="pin"
									className="mb-16"
									error={!!errors.pin}
									required
									helperText={errors?.pin?.message}
									label="Pin de Seguridad"
									id="pin"
									variant="outlined"
									fullWidth
									onChange={e => {
										const regexp = /^[0-9\b]+$/;
										if (e.target.value !== '' && !regexp.test(e.target.value)) {
											toast.error('El pin debe ser numérico');
											return;
										}
										if (e.target.value.length <= 6) {
											onChange(e.target.value);
										} else {
											toast.error('El pin debe tener 6 digitos');
										}
									}}
								/>
							)}
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16"
							aria-label="accept"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							value="legacy"
						>
							{okTitle || 'Aceptar'}
						</Button>
						<Button
							type="button"
							variant="contained"
							color="secondary"
							className="w-full mx-auto mt-16"
							aria-label="cancel"
							value="legacy"
							onClick={() => {
								setVisible(false);
								reset();
							}}
						>
							{cancelTitle || 'Cancelar'}
						</Button>
					</form>
				</Box>
			</Fade>
		</Modal>
	);
};

ModalConfirmPin.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	callback: PropTypes.func.isRequired,
	message: PropTypes.string,
	okTitle: PropTypes.string,
	cancelTitle: PropTypes.string,
};

export default ModalConfirmPin;
