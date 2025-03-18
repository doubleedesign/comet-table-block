/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	alignLeft,
	alignCenter,
	alignRight,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	alignTop,
	alignMiddle,
	alignBottom
} from './icons';

// Custom store name.
export const STORE_NAME = 'comet' as const;

// Rest API routes.
export const REST_API_ROUTE = '/comet/v1/options' as const;

// Table placeholder default settings.
export const DEFAULT_PREVIEW_ROWS = 3 as const;
export const DEFAULT_PREVIEW_COLUMNS = 3 as const;
export const MIN_PREVIEW_TABLE_HEIGHT = 150 as const;
export const MAX_PREVIEW_TABLE_COL = 50 as const;
export const MAX_PREVIEW_TABLE_ROW = 50 as const;
export const THRESHOLD_PREVIEW_TABLE_COL = 10 as const;
export const THRESHOLD_PREVIEW_TABLE_ROW = 10 as const;

// Available units on UnitControl component.
export const CELL_WIDTH_UNITS = ['%', 'px', 'em', 'rem'];

// Cell label & text variations.
export const CELL_ARIA_LABEL = {
	head: __('Header cell text', 'comet'),
	body: __('Body cell text', 'comet'),
	foot: __('Footer cell text', 'comet'),
} as const;

// Controls variations.
export const TEXT_ALIGNMENT_CONTROLS = [
	{
		icon: alignLeft,
		label: __('Align left', 'comet'),
		value: 'left',
	},
	{
		icon: alignCenter,
		label: __('Align center', 'comet'),
		value: 'center',
	},
	{
		icon: alignRight,
		label: __('Align right', 'comet'),
		value: 'right',
	},
] as const;

export const VERTICAL_ALIGNMENT_CONTROLS = [
	{
		icon: alignTop,
		label: __('Align top', 'comet'),
		value: 'top',
	},
	{
		icon: alignMiddle,
		label: __('Align middle', 'comet'),
		value: 'middle',
	},
	{
		icon: alignBottom,
		label: __('Align bottom', 'comet'),
		value: 'bottom',
	},
] as const;

export const STICKY_CONTROLS = [
	{
		label: _x('none', 'comet'),
		value: 'none',
	},
	{
		label: __('Fixed header row', 'comet'),
		value: 'header',
	},
	{
		label: __('Fixed first column', 'comet'),
		value: 'first-column',
	},
] as const;

export const CELL_TAG_CONTROLS = [
	{
		label: __('Header (<th>)', 'comet'),
		value: 'th',
	},
	{
		label: __('Data (<td>)', 'comet'),
		value: 'td',
	},
] as const;

export const CELL_SCOPE_CONTROLS = [
	{
		label: __('default / automatic', 'comet'),
		value: '',
	},
	{
		label: __('col', 'comet'),
		value: 'col',
	},
	{
		label: __('row', 'comet'),
		value: 'row',
	},
	{
		label: __('rowgroup', 'comet'),
		value: 'rowgroup',
	},
	{
		label: __('colgroup', 'comet'),
		value: 'colgroup',
	},
] as const;

export const CAPTION_POSITION_CONTROLS = [
	{
		label: __('Top', 'comet'),
		value: 'top',
	},
	{
		label: __('Bottom', 'comet'),
		value: 'bottom',
	},
] as const;
