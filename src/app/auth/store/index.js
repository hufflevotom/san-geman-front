import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';
import roles from './rolesSlice';

const authReducers = combineReducers({
	user,
	login,
	register,
	roles,
});

export default authReducers;
