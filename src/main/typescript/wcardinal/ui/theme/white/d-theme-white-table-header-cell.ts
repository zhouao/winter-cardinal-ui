/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { DisplayObject, Texture } from "pixi.js";
import { DAlignHorizontal } from "../../d-align-horizontal";
import { DAlignWith } from "../../d-align-with";
import { DBaseState } from "../../d-base-state";
import { DBaseStates } from "../../d-base-states";
import { DBorderMask } from "../../d-border-mask";
import { DCoordinateSize } from "../../d-coordinate";
import { DCornerMask } from "../../d-corner-mask";
import { DStateAwareOrValueMightBe } from "../../d-state-aware";
import { DTableCellState } from "../../d-table-cell-state";
import { DThemeTableHeaderCell } from "../../d-table-header-cell";
import { UtilRgb } from "../../util/util-rgb";
import { DThemeWhiteAtlas } from "./d-theme-white-atlas";
import { DThemeWhiteConstants } from "./d-theme-white-constants";
import { DThemeWhiteImage } from "./d-theme-white-image";

// Material Design icons by Google.
// Apache license version 2.0.
DThemeWhiteAtlas.add( "sorted_descending", 24, 24,
	`<g transform="scale(0.875,0.875)">` +
		`<path d="M7 16l5-5 5 5H7z" fill="#fff" />` +
	`</g>`
);

DThemeWhiteAtlas.add( "sorted_ascending", 24, 24,
	`<g transform="scale(0.875,0.875)">` +
		`<path d="M7 12l5 5 5-5H7z" fill="#fff" />` +
	`</g>`
);

export class DThemeWhiteTableHeaderCell extends DThemeWhiteImage implements DThemeTableHeaderCell {
	BACKGROUND_COLOR = UtilRgb.darken( DThemeWhiteConstants.BACKGROUND_COLOR_ON_BOARD, 0.02 );
	BACKGROUND_COLOR_HOVERED = UtilRgb.darken( this.BACKGROUND_COLOR, 0.017 );
	BACKGROUND_COLOR_PRESSED = UtilRgb.darken( this.BACKGROUND_COLOR, 0.034 );
	BORDER_COLOR = UtilRgb.darken( DThemeWhiteConstants.BACKGROUND_COLOR_ON_BOARD, 0.055 );

	getBackgroundColor( state: DBaseState ): number | null {
		if( DBaseStates.isDisabled( state ) ) {
			return ( state & DTableCellState.FROZEN ) ?
				this.BACKGROUND_COLOR : null;
		} else if( DBaseStates.isActive( state ) ) {
			return DThemeWhiteConstants.HIGHLIGHT_COLOR;
		} else if( DBaseStates.isPressed( state ) ) {
			return this.BACKGROUND_COLOR_PRESSED;
		} else if( DBaseStates.isFocused( state ) || DBaseStates.isHovered( state ) ) {
			return this.BACKGROUND_COLOR_HOVERED;
		} else {
			return ( state & DTableCellState.FROZEN ) ?
				this.BACKGROUND_COLOR : null;
		}
	}

	getBackgroundAlpha( state: DBaseState ): number {
		return 1;
	}

	getBorderColor( state: DBaseState ): number | null {
		return this.BORDER_COLOR;
	}

	getBorderAlign( state: DBaseState ): number {
		return 0;
	}

	getBorderMask( state: DBaseState ): DBorderMask {
		if( state & DTableCellState.END ) {
			return DBorderMask.ALL;
		} else {
			return DBorderMask.NOT_RIGHT;
		}
	}

	getTextAlignHorizontal(): DAlignHorizontal {
		return DAlignHorizontal.CENTER;
	}

	getCornerMask(): DCornerMask {
		return DCornerMask.ALL;
	}

	getHeight(): DCoordinateSize {
		return "padding";
	}

	getPaddingLeft(): number {
		return 10;
	}

	getPaddingRight(): number {
		return 10;
	}

	getTextValue( state: DBaseState ): string | null {
		return null;
	}

	newTextValue(): DStateAwareOrValueMightBe<string | null> {
		return null;
	}

	getSecondaryImageSource( state: DBaseState ): Texture | DisplayObject | null {
		if( state & DTableCellState.SORTED_ASCENDING ) {
			return DThemeWhiteAtlas.mappings.sorted_ascending;
		} else if( state & DTableCellState.SORTED_DESCENDING ) {
			return DThemeWhiteAtlas.mappings.sorted_descending;
		} else {
			return null;
		}
	}

	getSecondaryImageAlignHorizontal(): DAlignHorizontal {
		return DAlignHorizontal.RIGHT;
	}

	getSecondaryImageAlignWith(): DAlignWith {
		return DAlignWith.PADDING;
	}
}
