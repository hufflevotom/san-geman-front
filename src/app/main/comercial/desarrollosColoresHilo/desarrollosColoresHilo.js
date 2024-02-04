import Root from 'utils/styleComponent';

import withReducer from 'app/store/withReducer';
import reducer from '../store';

import Header from './desarrollosColoresHiloHeader';
import TableList from './desarrollosColoresHiloTable';

function DesarrollosColoresHilo() {
	return <Root header={<Header />} content={<TableList />} innerScroll />;
}

export default withReducer('comercial', reducer)(DesarrollosColoresHilo);
