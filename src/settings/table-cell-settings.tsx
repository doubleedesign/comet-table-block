// noinspection ES6PreferShortImport

/**
 * External dependencies
 */
import type { Property } from 'csstype';
import { useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import {
	BaseControl,
	Flex,
	TextControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits, SelectControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	CELL_WIDTH_UNITS,
	CELL_TAG_CONTROLS,
	CELL_SCOPE_CONTROLS,
	TEXT_ALIGNMENT_CONTROLS,
	VERTICAL_ALIGNMENT_CONTROLS,
} from '../constants';
import {
	ColorControl,
} from '../controls';
import {
	toTableAttributes,
	updateCells,
	type VTable,
	type VSelectedCells,
} from '../utils/table-state';
import { convertToObject } from '../utils/style-converter';
import { sanitizeUnitValue } from '../utils/helper';
import type {
	CellTagValue,
	CellScopeValue,
	SectionName,
	BlockAttributes,
} from '../BlockAttributes';

type Props = {
	firstColumnIsHeaders?: boolean;
	setAttributes: (attrs: Partial<BlockAttributes>) => void;
	vTable: VTable;
	selectedCells: VSelectedCells;
};

export function TableCellSettings({ firstColumnIsHeaders, setAttributes, vTable, selectedCells = [] }: Props) {
	const cellWidthUnits = useCustomUnits({ availableUnits: CELL_WIDTH_UNITS });

	if (!selectedCells.length) {
		return null;
	}

	const { sectionName, rowIndex, vColIndex } = selectedCells[0];

	const targetCell = vTable[sectionName as SectionName][rowIndex].cells[vColIndex];

	if (!targetCell) {
		return null;
	}

	const showCellTypeAndScopeControls = useMemo(() => {
		// If the selected cells are in the first column and firstColumnIsHeaders is on, do not show type control
		if(firstColumnIsHeaders && selectedCells.every((cell) => cell.vColIndex === 0 && cell.tag === 'th')) return false;

		// If the selected cells are in the <thead>, do not show type control
		const theadRowQty = vTable.head.length;
		const selectedCellsAreInThead = theadRowQty > 0 && selectedCells.every(cell => cell.rowIndex <= theadRowQty && cell.tag === 'th');
		if(selectedCellsAreInThead) return false;

		return true;
	}, [firstColumnIsHeaders, selectedCells, vTable]);

	const selectedCellTags = selectedCells.reduce((result: CellTagValue[], selectedCell) => {
		const { tag } =
			vTable[selectedCell.sectionName][selectedCell.rowIndex].cells[selectedCell.vColIndex];
		if (!result.includes(tag)) {
			result.push(tag);
		}

		return result;
	}, []);

	const cellStylesObj = convertToObject(targetCell.styles);

	const updateCellsState = (state: {
		styles?: Object;
		tag?: CellTagValue;
		className?: string;
		id?: string;
		headers?: string;
		scope?: CellScopeValue;
	}) => {
		const newVTable = updateCells(vTable, state, selectedCells);
		setAttributes(toTableAttributes(newVTable));
	};

	const onChangeBackgroundColor = (value: Property.BackgroundColor) => {
		updateCellsState({ styles: { backgroundColor: value } });
	};

	const onChangeWidth = (value: string | number | undefined) => {
		updateCellsState({ styles: { width: sanitizeUnitValue(value) } });
	};

	const onChangeTextAlign = (value: string | number | undefined) => {
		updateCellsState({
			styles: { textAlign: value === cellStylesObj.textAlign ? undefined : value },
		});
	};

	const onChangeVerticalAlign = (value: string | number | undefined) => {
		updateCellsState({
			styles: { verticalAlign: value === cellStylesObj.verticalAlign ? undefined : value },
		});
	};

	const onChangeTag = (value: string | number | undefined) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const isAllowedTag = (_value: any): _value is CellTagValue => {
			return CELL_TAG_CONTROLS.some((control) => control.value === _value);
		};
		if (isAllowedTag(value)) {
			updateCellsState({ tag: value, id: undefined, headers: undefined, scope: undefined });
		}
	};

	const onChangeClass = (value: string) => {
		updateCellsState({ className: value !== '' ? value : undefined });
	};

	const onChangeId = (value: string) => {
		updateCellsState({ id: value !== '' ? value : undefined });
	};

	const onChangeHeaders = (value: string) => {
		updateCellsState({ headers: value !== '' ? value : undefined });
	};

	const onChangeScope = (value: CellScopeValue) => {
		updateCellsState({ scope: value === targetCell.scope ? undefined : value });
	};

	const CellTypeControl = () => {
		if(!showCellTypeAndScopeControls) return null;

		return <ToggleGroupControl
			label={__('Cell type', 'comet')}
			value={targetCell.tag}
			isBlock
			onChange={onChangeTag}
		>
			{CELL_TAG_CONTROLS.map(({ label, value }) => (
				<ToggleGroupControlOption key={value} value={value} label={label}/>
			))}
		</ToggleGroupControl>;
	};

	const CellScopeControl = () => {
		if(!showCellTypeAndScopeControls) return null;

		return <SelectControl
			label={__('Scope', 'comet')}
			value={targetCell.scope}
			options={CELL_SCOPE_CONTROLS.map(({ label, value }) => {
				return { label, value };
			})}
			/** @ts-expect-error TS2322 Type string is not assignable to type "col" | "colgroup" | "row" | "rowgroup" */
			onChange={onChangeScope}
			help="Does this label its row or column?"
			__next40pxDefaultSize
		/>;
	};

	return (
		<>
			<CellTypeControl />
			{selectedCellTags.length === 1 && (
				<>
					{selectedCellTags.includes('th') && (
						<CellScopeControl />
					)}
					{selectedCellTags.includes('th') && (
						<UnitControl
							label={__('Preferred column width', 'comet')}
							value={cellStylesObj?.width}
							units={cellWidthUnits}
							min={0}
							onChange={onChangeWidth}
							__next40pxDefaultSize
						/>
					)}
					{selectedCellTags.includes('th') && (
						<TextControl
							label={__('Cell ID', 'comet')}
							autoComplete="off"
							value={targetCell.id || ''}
							onChange={onChangeId}
							help="No spaces; must start with a letter and be unique to the page"
							__next40pxDefaultSize
						/>
					)}
					{selectedCellTags.includes('td') && (
						<TextControl
							label={createInterpolateElement(
								__('<code>headers</code> attribute', 'comet'),
								{ code: <code/> }
							)}
							autoComplete="off"
							value={targetCell.headers || ''}
							onChange={onChangeHeaders}
							help="Unique ID of a header cell to associate with this cell"
						/>)}
				</>
			)}
			<hr/>
			<BaseControl>
				<div className="comet-cell-text-align" role="group">
					<Flex style={{ marginBottom: '-16px' }} justify="start" align="start">
						<ToggleGroupControl
							label={__('Text alignment', 'comet')}
							value={cellStylesObj?.textAlign ?? 'left'}
							isDeselectable
							onChange={onChangeTextAlign}
						>
							{TEXT_ALIGNMENT_CONTROLS.map(({ icon, label, value }) => (
								<ToggleGroupControlOptionIcon
									key={value}
									value={value}
									icon={icon}
									label={label}
								/>
							))}
						</ToggleGroupControl>
						<ToggleGroupControl
							label={__('Vertical alignment', 'comet')}
							value={cellStylesObj?.verticalAlign ?? 'top'}
							isDeselectable
							onChange={onChangeVerticalAlign}
						>
							{VERTICAL_ALIGNMENT_CONTROLS.map(({ icon, label, value }) => (
								<ToggleGroupControlOptionIcon
									key={value}
									value={value}
									icon={icon}
									label={label}
								/>
							))}
						</ToggleGroupControl>
					</Flex>
				</div>
			</BaseControl>
			<hr/>
			<ColorControl
				label={__('Cell background (override default)', 'comet')}
				value={cellStylesObj.backgroundColor}
				onChange={onChangeBackgroundColor}
			/>
			<TextControl
				label={__('Cell CSS class(es)', 'comet')}
				autoComplete="off"
				value={targetCell.className || ''}
				onChange={onChangeClass}
				help={__('Separate multiple classes with spaces.', 'comet')}
			/>
		</>
	);
}
