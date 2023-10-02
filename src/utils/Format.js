import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export const milliFormat = num => {
	let s = num.toString();
	// eslint-disable-next-line no-useless-escape
	if (/[^0-9\.]/.test(s)) return 'invalid value';
	s = s.replace(/^(\d*)$/, '$1.');
	s = `${s}00`.replace(/(\d*\.\d\d)\d*/, '$1');
	s = s.replace('.', ',');
	const re = /(\d)(\d{3},)/;
	while (re.test(s)) {
		s = s.replace(re, '$1,$2');
	}
	s = s.replace(/,(\d\d)$/, '.$1');
	return s.replace(/^\./, '0.');
};

export const formatDate = date => {
	const fecha = moment(date).locale('es');
	return fecha.format('DD [de] MMMM [del] YYYY');
};
