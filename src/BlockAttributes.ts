/**
 * External dependencies
 */
import type { Properties } from 'csstype';

/**
 * Internal dependencies
 */
import type {
	CELL_TAG_CONTROLS,
	CELL_SCOPE_CONTROLS,
	STICKY_CONTROLS,
	CAPTION_POSITION_CONTROLS
} from './constants';

type NestedObject = {
	[ key: string ]: NestedObject | null | undefined;
};

// Controls Attributes value types
export type captionPositionValue = ( typeof CAPTION_POSITION_CONTROLS )[ number ][ 'value' ];
export type CellTagValue = ( typeof CELL_TAG_CONTROLS )[ number ][ 'value' ];
export type CellScopeValue = ( typeof CELL_SCOPE_CONTROLS )[ number ][ 'value' ];
export type StickyValue = ( typeof STICKY_CONTROLS )[ number ][ 'value' ];

// Table section name types
export type SectionName = 'head' | 'body' | 'foot';

// Table attributes
export type TableAttributes = Record<SectionName, Row[]>;

// Table row attributes
export interface Row {
	cells: Cell[];
}

// Table cell attributes
export interface Cell {
	content: string;
	styles?: string;
	tag: CellTagValue;
	className?: string;
	id?: string;
	headers?: string;
	scope?: CellScopeValue;
	rowSpan?: string;
	colSpan?: string;
}

// Block attributes
export interface BlockAttributes extends TableAttributes {
	isStackedOnMobile?: boolean;
	firstColumnIsHeaders?: boolean;
	sticky?: StickyValue;
	caption?: string;
	captionStyles?: Properties;
}

// Core Table Block attributes
export interface CoreTableBlockAttributes {
	head: {
		cells: CoreTableCell[];
	}[];
	body: {
		cells: CoreTableCell[];
	}[];
	foot: {
		cells: CoreTableCell[];
	}[];
	hasFixedLayout: boolean;
	caption: string;
	style: NestedObject;
}

export interface CoreTableCell {
	content: string;
	tag: CellTagValue;
	rowspan?: string;
	colspan?: string;
}
