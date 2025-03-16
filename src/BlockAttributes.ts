/**
 * Internal dependencies
 */
import type {
	CELL_TAG_CONTROLS,
	CELL_SCOPE_CONTROLS,
	DIRECTION_CONTROLS,
	SIDE_CONTROLS,
	CONTENT_JUSTIFY_CONTROLS,
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
export type DirectionValue = ( typeof DIRECTION_CONTROLS )[ number ][ 'value' ];
export type SideValue = ( typeof SIDE_CONTROLS )[ number ][ 'value' ];
export type ContentJustifyValue = ( typeof CONTENT_JUSTIFY_CONTROLS )[ number ][ 'value' ];
export type StickyValue = ( typeof STICKY_CONTROLS )[ number ][ 'value' ];

// Table section name types
export type SectionName = 'head' | 'body' | 'foot';

// Table attributes
export type TableAttributes = Record< SectionName, Row[] >;

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
	contentJustification: ContentJustifyValue | undefined;
	hasFixedLayout: boolean;
	isScrollOnPc: boolean;
	isScrollOnMobile: boolean;
	isStackedOnMobile: boolean;
	sticky: StickyValue;
	tableStyles?: string;
	captionStyles?: string;
	captionPosition: captionPositionValue;
	caption?: string;
	style: NestedObject;
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
