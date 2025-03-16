/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import './store';
import './style.scss';
import metadata from './block.json';
import example from './example';
import { blockIcon as icon } from './icons';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

// Register block.
const config = {
	title: __('Table', 'comet'),
	category: 'text',
	description: __('Create structured content in rows and columns to display tabular data.', 'comet'),
	icon,
	example,
	transforms,
	edit,
	save,
	deprecated,
	styles: [
		{
			name: 'stripes',
			label: __('Stripes', 'comet'),
		},
	],
};
registerBlockType(metadata.name, config);

const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name } = props;

		if (name !== 'comet/table') {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<InspectorControls/>
				<BlockEdit {...props} />
			</>
		);
	};
}, 'withInspectorControl');

addFilter(
	'editor.BlockEdit',
	'comet/tableWithInspectorControls',
	withInspectorControls
);
