/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	// @ts-ignore: has no exported member
	useBlockEditingMode,
} from '@wordpress/block-editor';
import { ToolbarDropdownMenu, PanelBody } from '@wordpress/components';
import { blockTable } from '@wordpress/icons';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './editor.scss';

import { TableSettings, TableCaptionSettings, TableCellSettings } from './settings';
import { Table, TablePlaceholder } from './elements';
import {
	insertRow,
	deleteRow,
	insertColumn,
	deleteColumn,
	mergeCells,
	splitMergedCells,
	hasMergedCells,
	isRectangleSelected,
	toTableAttributes,
	toVirtualTable,
	isEmptySection,
	type VTable,
	type VSelectedLine,
	type VSelectedCells,
} from './utils/table-state';
import {
	tableRowAfter,
	tableRowBefore,
	tableColumnBefore,
	tableColumnAfter,
	tableColumnDelete,
	tableRowDelete,
	tableMergeCell,
	tableSplitCell,
} from './icons';
import type { BlockAttributes, SectionName } from './BlockAttributes';

function TableEdit(props: BlockEditProps<BlockAttributes>) {
	const {
		attributes,
		setAttributes,
		isSelected: isSingleSelected
	} = props;
	const [selectedCells, setSelectedCells] = useState<VSelectedCells>(undefined);
	const [selectedLine, setSelectedLine] = useState<VSelectedLine>(undefined);
	const blockEditingMode = useBlockEditingMode();
	const isContentOnlyMode = blockEditingMode === 'contentOnly';

	// Release cell selection.
	useEffect(() => {
		if (!isSingleSelected) {
			setSelectedCells(undefined);
			setSelectedLine(undefined);
		}
	}, [isSingleSelected]);

	// Create virtual table object with the cells placed in positions based on how they actually look.
	const vTable: VTable = toVirtualTable(attributes);

	const onInsertRow = (offset: number) => {
		if (!selectedCells || selectedCells.length !== 1) {
			return;
		}

		const { sectionName, rowIndex, rowSpan } = selectedCells[0];

		// Calculate row index to be inserted considering rowspan of the selected cell.
		const insertRowIndex = offset === 0 ? rowIndex : rowIndex + offset + rowSpan - 1;

		const newVTable = insertRow(vTable, { sectionName, rowIndex: insertRowIndex });

		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	const onDeleteRow = () => {
		if (!selectedCells || selectedCells.length !== 1) {
			return;
		}

		const { sectionName, rowIndex } = selectedCells[0];

		const newVTable = deleteRow(vTable, { sectionName, rowIndex });
		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	const onInsertColumn = (offset: number) => {
		if (!selectedCells || selectedCells.length !== 1) {
			return;
		}

		const { vColIndex, colSpan } = selectedCells[0];

		// Calculate column index to be inserted considering colspan of the selected cell.
		const insertVColIndex = offset === 0 ? vColIndex : vColIndex + offset + colSpan - 1;

		const newVTable = insertColumn(vTable, { vColIndex: insertVColIndex });

		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	const onDeleteColumn = () => {
		if (!selectedCells || selectedCells.length !== 1) {
			return;
		}

		const { vColIndex } = selectedCells[0];

		const newVTable = deleteColumn(vTable, { vColIndex });
		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	const onMergeCells = () => {
		const newVTable = mergeCells(vTable, selectedCells);
		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	const onSplitMergedCells = () => {
		const newVTable = splitMergedCells(vTable, selectedCells);
		setAttributes(toTableAttributes(newVTable));
		setSelectedCells(undefined);
		setSelectedLine(undefined);
	};

	const TableEditControls = [
		{
			icon: tableRowBefore,
			title: __('Insert row before', 'comet'),
			isDisabled: (selectedCells || []).length !== 1,
			onClick: () => onInsertRow(0),
		},
		{
			icon: tableRowAfter,
			title: __('Insert row after', 'comet'),
			isDisabled: (selectedCells || []).length !== 1,
			onClick: () => onInsertRow(1),
		},
		{
			icon: tableRowDelete,
			title: __('Delete row', 'comet'),
			isDisabled: (selectedCells || []).length !== 1,
			onClick: () => onDeleteRow(),
		},
		{
			icon: tableColumnBefore,
			title: __('Insert column before', 'comet'),
			isDisabled: (selectedCells || []).length !== 1,
			onClick: () => onInsertColumn(0),
		},
		{
			icon: tableColumnAfter,
			title: __('Insert column after', 'comet'),
			isDisabled: (selectedCells || []).length !== 1,
			onClick: () => onInsertColumn(1),
		},
		{
			icon: tableColumnDelete,
			title: __('Delete column', 'comet'),
			isDisabled: (selectedCells || []).length !== 1,
			onClick: () => onDeleteColumn(),
		},
		{
			icon: tableSplitCell,
			title: __('Split merged cells', 'comet'),
			isDisabled: !selectedCells || !hasMergedCells(selectedCells),
			onClick: () => onSplitMergedCells(),
		},
		{
			icon: tableMergeCell,
			title: __('Merge cells', 'comet'),
			isDisabled: !selectedCells || !isRectangleSelected(selectedCells),
			onClick: () => onMergeCells(),
		},
	];

	const isEmpty: boolean = !['head', 'body', 'foot'].filter(
		(sectionName) => !isEmptySection(vTable[sectionName as SectionName])
	).length;

	const tablePlaceholderProps = useBlockProps({});

	const tableFigureProps = useBlockProps({});

	const tableProps = {
		attributes,
		setAttributes,
		isSelected: isSingleSelected,
		vTable,
		selectedCells,
		setSelectedCells,
		selectedLine,
		setSelectedLine,
		isContentOnlyMode,
	};

	const tableSettingsProps = {
		attributes,
		setAttributes,
		vTable,
		setSelectedCells,
		setSelectedLine,
	};

	const tableCellSettingsProps = {
		firstColumnIsHeaders: attributes?.firstColumnIsHeaders,
		setAttributes,
		vTable,
		selectedCells,
	};

	const tableCellSettingsLabel: string =
		selectedCells && selectedCells.length > 1
			? __('Selected cells', 'comet')
			: __('Selected cell', 'comet');

	const tableCaptionSettingProps = {
		attributes,
		setAttributes,
	};

	return (
		<>
			{isEmpty && (
				<div {...tablePlaceholderProps}>
					<TablePlaceholder {...props} />
				</div>
			)}
			{!isEmpty && (
				<div {...tableFigureProps}>
					{!isContentOnlyMode && (
						<>
							<BlockControls group="block">
								<ToolbarDropdownMenu
									label={__('Edit table', 'comet')}
									icon={blockTable}
									controls={TableEditControls}
								/>
							</BlockControls>
						</>
					)}
					<InspectorControls>
						<PanelBody
							title={__('Table layout', 'comet')}
							initialOpen={true}
						>
							<TableSettings {...tableSettingsProps} />
						</PanelBody>
						<PanelBody
							title={__('Table caption', 'comet')}
							initialOpen={false}
						>
							<TableCaptionSettings {...tableCaptionSettingProps} />
						</PanelBody>
						{selectedCells && !!selectedCells.length && (
							<PanelBody title={tableCellSettingsLabel} initialOpen={true}>
								<TableCellSettings {...tableCellSettingsProps} />
							</PanelBody>
						)}
					</InspectorControls>
					<div className="wp-block-comet-table">
						<Table {...tableProps} />
					</div>
				</div>
			)}
		</>
	);
}

export default TableEdit;
