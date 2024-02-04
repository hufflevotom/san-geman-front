import Root from 'utils/styleComponent';

import withReducer from 'app/store/withReducer';
import reducer from '../store';

import Header from './desarrollosColoresTelaHeader';
import TableList from './desarrollosColoresTelaTable';

function DesarrollosColoresTela() {
	return <Root header={<Header />} content={<TableList />} innerScroll />;
}

export default withReducer('comercial', reducer)(DesarrollosColoresTela);
