// noinspection ES6PreferShortImport

/**
 * External dependencies
 */
import { type Dispatch, type SetStateAction, useMemo, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { STICKY_CONTROLS } from '../constants';
import {
	toggleSection,
	toTableAttributes,
	type VTable,
	type VSelectedCells,
	type VSelectedLine,
} from '../utils/table-state';
import type { StickyValue, BlockAttributes, Row } from '../BlockAttributes';
import { createInterpolateElement } from '@wordpress/element';

type Props = {
	attributes: BlockAttributes;
	setAttributes: (attrs: Partial<BlockAttributes>) => void;
	vTable: VTable;
	setSelectedCells: Dispatch<SetStateAction<VSelectedCells>>;
	setSelectedLine: Dispatch<SetStateAction<VSelectedLine>>;
};

export function TableSettings({
	attributes,
	setAttributes,
	vTable,
	setSelectedCells,
	setSelectedLine
}: Props) {
	const { isStackedOnMobile, firstColumnIsHeaders, sticky, head, foot } = attributes;

	// Check if the first column has been manualyl set to <th>s without firstColumnIsHeaders toggled on
	const firstBodyColumnIsHeaders = useMemo(() => {
		return vTable?.body?.length > 0 && vTable.body.every(row =>
			row.cells &&
			row.cells.length > 0 &&
			row.cells[0].tag === 'th'
		);
	}, [vTable]);

	// Check if the first row has been manually set to <th>s without a <thead> being present
	const firstBodyRowIsHeaders = useMemo(() => {
		if(vTable?.head?.length === 0) {
			return vTable?.body[0]?.cells?.every(cell => cell.tag === 'th');
		}

		return false;
	}, [vTable]);

	useEffect(() => {
		// If the first column's cells have all been manually set to <th>, toggle firstColumnIsHeaders on
		if(firstBodyColumnIsHeaders) {
			setAttributes({ firstColumnIsHeaders: true });
			// Resetting the selection simplifies re-rendering of controls and is easier than updating the selection when things get moved dynamically
			setSelectedCells(undefined);
			setSelectedLine(undefined);
		}

		// If there is no <thead> and the first row's cells have all been manually set to <th>, turn them into a <thead>
		if(firstBodyRowIsHeaders) {
			const newVTable = toggleSection(vTable, 'head');
			newVTable.head = [vTable.body[0]];
			newVTable.body = vTable.body.slice(1);
			setAttributes(toTableAttributes(newVTable));
			// Resetting the selection simplifies re-rendering of controls and is easier than updating the selection when things get moved dynamically
			setSelectedCells(undefined);
			setSelectedLine(undefined);
		}
	}, [firstBodyColumnIsHeaders, firstBodyRowIsHeaders, setAttributes]);


	const availableStickyControls = useMemo(() => {
		// Only allow fixed header to be selected if there is a header section enabled by the attribute toggles
		return STICKY_CONTROLS.filter((control) => {
			if(head.length === 0 && control.value === 'header') {
				return false;
			}

			// noinspection RedundantIfStatementJS
			if(!firstColumnIsHeaders && control.value === 'first-column') {
				return false;
			}

			return true;
		});

	}, [sticky, head, foot, firstColumnIsHeaders]);

	const onChangeIsStackedOnMobile = () => {
		setAttributes({ isStackedOnMobile: !isStackedOnMobile });
	};

	const onToggleFirstColIsHeaders = () => {
		const newVal = !firstColumnIsHeaders;

		setAttributes({
			firstColumnIsHeaders: newVal,
			body: attributes.body.map((row: Row) => {
				return {
					cells: row.cells.map((cell, index) => {
						if(index === 0) {
							if(newVal) {
								return { ...cell, tag: 'th', scope: 'row' };
							}

							return { ...cell, 'tag': 'td', scope: undefined };
						}

						return cell;
					})
				};
			}),
		});
	};

	const onChangeSticky = (value: StickyValue) => {
		setAttributes({ sticky: value === 'none' ? undefined : value });
	};

	const onToggleHeaderSection = () => {
		const newVTable = toggleSection(vTable, 'head');
		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	const onToggleFooterSection = () => {
		const newVTable = toggleSection(vTable, 'foot');
		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	return (
		<>
			<ToggleControl
				label="Top header section"
				help={createInterpolateElement(
					__('<code>thead</code> element at the top', 'comet'),
					{ code: <code/> }
				)}
				checked={!!(head && head.length)}
				onChange={onToggleHeaderSection}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('First column header section', 'comet')}
				help={createInterpolateElement(
					__('<code>th scope="row"</code> for the cells', 'comet'),
					{ code: <code/> }
				)}
				checked={!!(firstColumnIsHeaders)}
				onChange={onToggleFirstColIsHeaders}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Footer section', 'comet')}
				help={createInterpolateElement(
					__('<code>tfoot</code> element at the bottom', 'comet'),
					{ code: <code/> }
				)}
				checked={!!(foot && foot.length)}
				onChange={onToggleFooterSection}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Stack when adapting to a narrow container or viewport', 'comet')}
				className="ftb-toggle-control"
				checked={isStackedOnMobile}
				onChange={onChangeIsStackedOnMobile}
				__nextHasNoMarginBottom
			/>
			<SelectControl
				label={__('Fixed headers if table scrolls', 'comet')}
				value={sticky}
				options={availableStickyControls.map(({ label, value }) => {
					return { label, value };
				})}
				// @ts-expect-error TS2322 Type string is not assignable to type "none" | "header" | "first-column"
				onChange={onChangeSticky}
				size="__unstable-large"
				__nextHasNoMarginBottom
			/>
		</>
	);
}
