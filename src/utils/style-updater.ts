/**
 * Internal dependencies
 */
import { toUnitVal } from './helper';
import type { Properties } from 'csstype';
import type { Corners, Direction } from './style-picker';
import { pickBy, omit, mapValues } from 'lodash';

function getCssPropertyWithFourDirection(
	property: keyof Properties,
	top: string,
	right: string,
	bottom: string,
	left: string
): Properties {
	if ( top === right && top === bottom && top === left ) {
		return {
			[ property ]: top,
		};
	}
	if ( top === bottom && left === right ) {
		return {
			[ property ]: `${ top } ${ left }`,
		};
	}

	if ( left === right ) {
		return {
			[ property ]: `${ top } ${ left } ${ bottom }`,
		};
	}

	return {
		[ property ]: `${ top } ${ right } ${ bottom } ${ left } `,
	};
}

/**
 * Update padding style of styles object.
 *
 * @param  styles Styles object.
 * @param  values padding values object.
 * @return  New Styles object.
 */
export function updatePadding( styles: Properties, values: Partial< Direction > ): Properties {
	const shortHandPropName = 'padding';
	const { top, right, bottom, left } = mapValues( pickBy( values ), toUnitVal );
	const newValues = {
		paddingTop: top,
		paddingRight: right,
		paddingBottom: bottom,
		paddingLeft: left,
	};

	const newStyles = omit( styles, [ shortHandPropName, ...Object.keys( newValues ) ] );

	if ( ! top || ! right || ! bottom || ! right ) {
		return pickBy( {
			...newStyles,
			...newValues,
		} );
	}

	return {
		...newStyles,
		...getCssPropertyWithFourDirection( shortHandPropName, top, right, bottom, left ),
	};
}

/**
 * Update border-width style of styles object.
 *
 * @param  styles Styles object.
 * @param  values border-width values object.
 * @return  New Styles object.
 */
export function updateBorderWidth( styles: Properties, values: Partial< Direction > ): Properties {
	const shortHandPropName = 'borderWidth';
	const { top, right, bottom, left } = mapValues( pickBy( values ), toUnitVal );
	const newValues = {
		borderTopWidth: top,
		borderRightWidth: right,
		borderBottomWidth: bottom,
		borderLeftWidth: left,
	};

	const newStyles = omit( styles, [ shortHandPropName, ...Object.keys( newValues ) ] );

	if ( ! top || ! right || ! bottom || ! right ) {
		return pickBy( {
			...newStyles,
			...newValues,
		} );
	}

	return {
		...newStyles,
		...getCssPropertyWithFourDirection( shortHandPropName, top, right, bottom, left ),
	};
}

/**
 * Update border-style style of styles object.
 *
 * @param  styles Styles object.
 * @param  values border-style values object.
 * @return New Styles object.
 */
export function updateBorderStyle( styles: Properties, values: Partial< Direction > ): Properties {
	const shortHandPropName = 'borderStyle';
	const { top, right, bottom, left } = pickBy( values );
	const newValues = {
		borderTopStyle: top,
		borderRightStyle: right,
		borderBottomStyle: bottom,
		borderLeftStyle: left,
	};

	const newStyles = omit( styles, [ shortHandPropName, ...Object.keys( newValues ) ] );

	if ( ! top || ! right || ! bottom || ! right ) {
		return pickBy( {
			...newStyles,
			...newValues,
		} );
	}

	return {
		...newStyles,
		...getCssPropertyWithFourDirection( shortHandPropName, top, right, bottom, left ),
	};
}

/**
 * Update border-scoloryle style of styles object.
 *
 * @param  styles Styles object.
 * @param  values border-color values object.
 * @return New Styles object.
 */
export function updateBorderColor( styles: Properties, values: Partial< Direction > ): Properties {
	const shortHandPropName = 'borderColor';
	const { top, right, bottom, left } = pickBy( values );
	const newValues = {
		borderTopColor: top,
		borderRightColor: right,
		borderBottomColor: bottom,
		borderLeftColor: left,
	};

	const newStyles = omit( styles, [ shortHandPropName, ...Object.keys( newValues ) ] );

	if ( ! top || ! right || ! bottom || ! right ) {
		return pickBy( {
			...newStyles,
			...newValues,
		} );
	}

	return {
		...newStyles,
		...getCssPropertyWithFourDirection( shortHandPropName, top, right, bottom, left ),
	};
}

/**
 * Update border-spacing style of styles object.
 *
 * @param  styles            Styles object.
 * @param  values            border-spacing values object.
 * @param  values.horizontal
 * @param  values.vertical
 * @return New Styles object.
 */
export function updateBorderSpacing(
	styles: Properties,
	values: { horizontal?: string; vertical?: string }
): Properties {
	const newStyles = omit( styles, [ 'borderSpacing' ] );
	const { horizontal, vertical } = mapValues( pickBy( values ), toUnitVal );
	if ( horizontal === undefined && vertical === undefined ) {
		return newStyles;
	}
	if ( horizontal === vertical ) {
		return {
			...newStyles,
			borderSpacing: horizontal,
		};
	}

	return {
		...newStyles,
		borderSpacing: `${ horizontal } ${ vertical }`,
	};
}

/**
 * Update border-radius style of styles object.
 *
 * @param  styles Styles object.
 * @param  values border-radius values object.
 * @return  New Styles object.
 */
export function updateBorderRadius( styles: Properties, values: Partial< Corners > ): Properties {
	const shortHandPropName = 'borderRadius';
	const { topLeft, topRight, bottomRight, bottomLeft } = mapValues( pickBy( values ), toUnitVal );
	const newValues = {
		borderTopLeftRadius: topLeft,
		borderTopRightRadius: topRight,
		borderBottomRightRadius: bottomRight,
		borderBottomLeftRadius: bottomLeft,
	};

	const newStyles = omit( styles, [ shortHandPropName, ...Object.keys( newValues ) ] );

	if ( typeof values === 'string' ) {
		return {
			...newStyles,
			borderRadius: toUnitVal( values ),
		};
	}

	if ( ! topLeft || ! topRight || ! bottomRight || ! bottomLeft ) {
		return pickBy( {
			...newStyles,
			...newValues,
		} );
	}

	return {
		...newStyles,
		...getCssPropertyWithFourDirection(
			shortHandPropName,
			topLeft,
			topRight,
			bottomRight,
			bottomLeft
		),
	};
}
