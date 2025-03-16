/**
 * External dependencies
 */
import type { AnyAction as Action } from 'redux';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, register } from '@wordpress/data';
import type { NoticeProps } from '@wordpress/components/build-types/notice/types';

/**
 * Internal dependencies
 */
import { STORE_NAME, REST_API_ROUTE } from './constants';

export interface ApiResponse {
	status?: NoticeProps['status'];
	message?: string;
	options?: StoreOptions;
	 
	block_css?: string;
}

export interface StoreOptions {
	 
	block_style: {
		cell_background_color_th?: string;
		cell_background_color_td?: string;
		cell_text_align?: string;
		cell_vertical_align?: string;
	};
	 
}

const DEFAULT_STATE = {
	options: {},
};

const actions = {
	getOptions( path: string ) {
		return {
			type: 'GET_OPTIONS',
			path,
		};
	},
	setOptions( options: StoreOptions ) {
		return {
			type: 'SET_OPTIONS',
			options,
		};
	},
};

const reducer = ( state = DEFAULT_STATE, action: Action ) => {
	switch ( action.type ) {
		case 'SET_OPTIONS': {
			return {
				...state,
				options: action.options,
			};
		}
		default: {
			return state;
		}
	}
};

const selectors = {
	getOptions( state: { options: StoreOptions } ) {
		const { options } = state;

		return options;
	},
};

const controls = {
	GET_OPTIONS(action: Action) {
		return apiFetch<ApiResponse>( { path: action.path } );
	},
};

const resolvers = {
	*getOptions() {
		const options: StoreOptions = yield actions.getOptions( REST_API_ROUTE );

		return actions.setOptions( options );
	},
};

const store = createReduxStore( STORE_NAME, {
	reducer,
	controls,
	selectors,
	resolvers,
	actions,
} );

register(store);

export { STORE_NAME };
