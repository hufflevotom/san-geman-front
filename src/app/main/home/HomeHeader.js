import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
// import { getProjects, selectProjects } from './store/projectsSlice';
// import { selectWidgets } from './store/widgetsSlice';

function HomeHeader() {
	const user = useSelector(({ auth }) => auth.user);
	console.log('V.1.0 D.12/06/23');

	return (
		<div className="flex flex-col justify-between flex-1 min-w-0 px-24 pt-24">
			<div className="flex justify-between items-center">
				<div className="flex items-center min-w-0">
					{/* //* Avatar */}
					<Avatar
						className="w-52 h-52 sm:w-64 sm:h-64"
						style={{
							color: '#881C4B',
							backgroundColor: '#FAFAFE',
							fontWeight: 'bold',
							fontSize: '24px',
							lineHeight: '20px',
						}}
					>
						{user &&
							user.nombre &&
							user.apellido &&
							user.nombre[0].toUpperCase() + user.apellido[0].toUpperCase()}
					</Avatar>
					<div className="mx-12 min-w-0">
						<Typography className="text-18 sm:text-24 md:text-32 font-bold leading-none tracking-tight --mb-8">
							Bienvenido, {user && user.nombre}!
						</Typography>
						{/* //* Cantidad de Notificaciones */}
						{/* <div className="flex items-center opacity-60 truncate">
							<Icon className="text-14 sm:text-24">notifications</Icon>
							<Typography className="text-12 sm:text-14 font-medium mx-4 truncate">
								You have 2 new messages and 15 new tasks
							</Typography>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default HomeHeader;
