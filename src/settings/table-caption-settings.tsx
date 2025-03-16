/**
 * External dependencies
 */
import type { Properties } from 'csstype';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Flex,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TEXT_ALIGNMENT_CONTROLS, CAPTION_POSITION_CONTROLS } from '../constants';
import type { captionPositionValue, BlockAttributes } from '../BlockAttributes';

type Props = {
	attributes: BlockAttributes;
	setAttributes: (attrs: Partial<BlockAttributes>) => void;
};

export function TableCaptionSettings({ attributes, setAttributes }: Props) {
	const { captionStyles } = attributes;

	const onChangePosition = (value: string | number | undefined) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const isAllowedValue = (_value: any): _value is captionPositionValue => {
			return CAPTION_POSITION_CONTROLS.some((control) => control.value === _value);
		};
		if (isAllowedValue(value)) {
			setAttributes({
				...attributes,
				captionStyles: {
					...captionStyles,
					captionSide: value
				}
			});
		}
	};

	const onChangeAlign = (value: string | number | undefined) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const isAllowedValue = (_value: any): _value is Properties[ 'textAlign' ] => {
			return !value || TEXT_ALIGNMENT_CONTROLS.some((control) => control.value === _value);
		};
		if (isAllowedValue(value)) {
			setAttributes({
				...attributes,
				captionStyles: {
					...captionStyles,
					textAlign: value === captionStyles?.textAlign ? undefined : value,
				}
			});
		}
	};

	return (
		<Flex wrap={false} align="flex-start">
			<ToggleGroupControl
				label={__('Position', 'comet')}
				value={captionStyles?.captionSide ?? 'bottom'}
				onChange={onChangePosition}
				isBlock
			>
				{CAPTION_POSITION_CONTROLS.map(({ label, value }) => (
					<ToggleGroupControlOption key={value} value={value} label={label}/>
				))}
			</ToggleGroupControl>
			<ToggleGroupControl
				label={__('Text alignment', 'comet')}
				value={captionStyles?.textAlign}
				isDeselectable
				onChange={onChangeAlign}
				isBlock
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
		</Flex>
	);
}
