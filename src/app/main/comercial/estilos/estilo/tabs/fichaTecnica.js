import { Viewer } from '@react-pdf-viewer/core';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

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

export default Abc;
