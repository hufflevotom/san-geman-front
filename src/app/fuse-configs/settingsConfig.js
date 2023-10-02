const settingsConfig = {
	layout: {
		style: 'layout1', // layout1 layout2 layout3
		config: {}, // checkout default layout configs at app/fuse-layouts for example  app/fuse-layouts/layout1/Layout1Config.js
	},
	customScrollbars: true,
	direction: 'ltr', // rtl, ltr
	theme: {
		main: 'light9',
		navbar: 'light123',
		toolbar: 'light123',
		footer: 'light9',
	},
	loginRedirectUrl: '/', // Default redirect url for the logged-in user
};

export default settingsConfig;
