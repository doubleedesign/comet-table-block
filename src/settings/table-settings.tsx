/**
 * External dependencies
 */
import type { Dispatch, SetStateAction } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	STICKY_CONTROLS,
} from '../constants';
import {
	toggleSection,
	toTableAttributes,
	type VTable,
	type VSelectedCells,
	type VSelectedLine,
} from '../utils/table-state';
import type { StickyValue, BlockAttributes } from '../BlockAttributes';

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
	const { isStackedOnMobile, sticky, head, foot } =
		attributes;

	const onChangeIsStackedOnMobile = () => {
		setAttributes({ isStackedOnMobile: !isStackedOnMobile });
	};

	const onChangeSticky = (value: string) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const isAllowedValue = (_value: any): _value is StickyValue => {
			return !value || STICKY_CONTROLS.some((control) => control.value === _value);
		};
		if (isAllowedValue(value)) {
			setAttributes({ sticky: 'none' === value ? undefined : value });
		}
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
				label={__('Header section (<thead>)', 'comet')}
				checked={!!(head && head.length)}
				onChange={onToggleHeaderSection}
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={__('Footer section (<tfoot>)', 'comet')}
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
				label={__('Fixed headers', 'comet')}
				value={sticky}
				options={STICKY_CONTROLS.map(({ label, value }) => {
					return { label, value };
				})}
				onChange={onChangeSticky}
				size="__unstable-large"
				__nextHasNoMarginBottom
			/>
		</>
	);
}
