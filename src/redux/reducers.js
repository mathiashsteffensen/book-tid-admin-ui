import { combineReducers } from 'redux';
import themeReducer from './slices/themeSlice';

export default combineReducers({
    theme: themeReducer,
});
