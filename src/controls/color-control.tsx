/**
 * External dependencies
 */
import type { Property } from 'csstype';
import type { ReactElement } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import {
	BaseControl,
	FlexBlock,
	Popover,
	ColorPalette,
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
	__experimentalText as Text,
} from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import ColorIndicatorButton from './color-indicator-button';

type Props = {
	label: string | ReactElement;
	help?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (event: any) => void;
	colors?: {
		name: string;
		slug: string;
		color: Property.Color;
	}[];
	value: Property.Color | undefined;
};

export default function ColorControl({
	label = __('Color', 'comet'),
	help,
	onChange,
	colors: colorsProp = [],
	value,
}: Props) {
	const instanceId = useInstanceId(ColorControl, 'ftb-color-control');
	const headingId = `${instanceId}-heading`;

	const colors = useSelect((select) => {
		const settings = select(
			blockEditorStore
			// @ts-ignore
		).getSettings();

		return settings?.colors ?? [];
	}, []);

	const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

	const handleOnChange = (inputValue: Property.Color | undefined) => onChange(inputValue);

	const handleOnPickerOpen = () => setIsPickerOpen(true);

	const handleOnPickerClose = () => setIsPickerOpen(false);

	return (
		<BaseControl className="ftb-color-control" help={help} __nextHasNoMarginBottom>
			<VStack aria-labelledby={headingId} role="group">
				<Text id={headingId} upperCase size="11" weight="500" as={FlexBlock}>
					{label}
				</Text>
				<ColorIndicatorButton
					label={__('Color', 'comet')}
					value={value}
					onClick={handleOnPickerOpen}
					isNone={!value}
					isTransparent={value === 'transparent'}
				/>
			</VStack>
			{isPickerOpen && (
				<Popover placement="left-start" shift offset={36} onClose={handleOnPickerClose}>
					<Spacer padding={4} marginBottom={0}>
						<ColorPalette
							colors={[...colors, ...colorsProp]}
							value={value || ''}
							onChange={handleOnChange}
						/>
					</Spacer>
				</Popover>
			)}
		</BaseControl>
	);
}
