/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { convertToObject } from './utils/style-converter';
import { toInteger } from './utils/helper';
import type { BlockAttributes, SectionName, Row } from './BlockAttributes';

export default function save({ attributes }: BlockSaveProps<BlockAttributes>) {
	const {
		isStackedOnMobile,
		sticky,
		head,
		body,
		foot,
		caption,
		captionStyles
	} = attributes;

	const isEmpty: boolean = !head.length && !body.length && !foot.length;

	if (isEmpty) {
		return null;
	}

	const blockProps = useBlockProps.save({
		className: 'table',
		'data-allow-layout-stacking': isStackedOnMobile,
		'data-sticky': sticky
	});

	const hasCaption: boolean = !RichText.isEmpty(caption || '');

	const Section = ({ type, rows }: { type: SectionName; rows: Row[] }) => {
		if (!rows.length) {
			return null;
		}

		const Tag = `t${type}` as const;

		return (
			<Tag>
				{rows.map(({ cells }, rowIndex) => (
					<tr key={rowIndex}>
						{cells.map(
							(
								{ content, tag, className, id, headers, scope, rowSpan, colSpan, styles },
								cellIndex
							) => (
								<RichText.Content
									key={cellIndex}
									tagName={tag}
									className={className || undefined}
									id={(tag === 'th' && id) || undefined}
									headers={headers || undefined}
									scope={(tag === 'th' && scope) || undefined}
									value={content}
									rowSpan={toInteger(rowSpan) > 1 ? toInteger(rowSpan) : undefined}
									colSpan={toInteger(colSpan) > 1 ? toInteger(colSpan) : undefined}
									style={convertToObject(styles)}
								/>
							)
						)}
					</tr>
				))}
			</Tag>
		);
	};

	const Caption = () => (
		<RichText.Content tagName="caption" value={caption || ''} style={captionStyles}/>
	);

	return (
		<div className="wp-block-comet-table">
			<table {...blockProps}>
				{hasCaption && <Caption />}
				<Section type="head" rows={head}/>
				<Section type="body" rows={body}/>
				<Section type="foot" rows={foot}/>
			</table>
		</div>
	);
}
