/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { caption as captionIcon } from '@wordpress/icons';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { usePrevious } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import type { BlockAttributes } from '../BlockAttributes';

type Props = {
	attributes: BlockAttributes;
	setAttributes: (attrs: Partial<BlockAttributes>) => void;
	isSelected?: boolean;
	onFocus: () => void
};

export function TableCaption({
	attributes,
	setAttributes,
	isSelected,
	onFocus
}: Props) {
	const { caption = '', captionStyles } = attributes;
	const prevCaption = usePrevious(caption);
	const isCaptionEmpty = RichText.isEmpty(caption);
	const isPrevCaptionEmpty = RichText.isEmpty(prevCaption || '');
	const [showCaption, setShowCaption] = useState(!isCaptionEmpty);

	const onChange = (value: string | undefined) => setAttributes({ caption: value });

	useEffect(() => {
		if(!isCaptionEmpty && isPrevCaptionEmpty) {
			setShowCaption(true);
		}
	}, [isCaptionEmpty, isPrevCaptionEmpty]);

	useEffect(() => {
		if(!isSelected && isCaptionEmpty) {
			setShowCaption(false);
		}
	}, [isSelected, isCaptionEmpty]);

	const ref = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(node: any) => {
			if (node && isCaptionEmpty) {
				node?.focus();
			}
		},
		[isCaptionEmpty]
	);

	return (
		<>
			{isSelected && (
				<BlockControls group="block">
					<ToolbarButton
						onClick={() => {
							setShowCaption(!showCaption);
							if (showCaption && caption) {
								onChange(undefined);
							}
						}}
						icon={captionIcon}
						isPressed={showCaption}
						label={
							showCaption
								? __('Remove caption', 'comet')
								: __('Add caption', 'comet')
						}
					/>
				</BlockControls>
			)}
			{showCaption && (!RichText.isEmpty(caption) || isSelected) && (
				<RichText
					aria-label={__('Table caption text', 'comet')}
					placeholder={__('Add caption', 'comet')}
					tagName="caption"
					style={captionStyles}
					value={caption}
					ref={ref}
					onChange={onChange}
					onFocus={onFocus}
				/>
			)}
		</>
	);
}
