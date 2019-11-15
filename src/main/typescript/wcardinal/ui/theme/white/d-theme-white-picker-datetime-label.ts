/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { DAlignHorizontal } from "../../d-align-horizontal";
import { DBaseState } from "../../d-base-state";
import { DCoordinateSize } from "../../d-coordinate";
import { DFontWeight } from "../../d-font";
import { DThemePickerDatetimeLabel } from "../../d-picker-datetime-label";
import { DThemeWhiteText } from "./d-theme-white-text";

export class DThemeWhitePickerDatetimeLabel extends DThemeWhiteText implements DThemePickerDatetimeLabel {
	getWidth(): DCoordinateSize {
		return 30;
	}

	getHeight(): DCoordinateSize {
		return 30;
	}

	getTextStyleClipping(): boolean {
		return false;
	}

	getTextAlignHorizontal(): DAlignHorizontal {
		return DAlignHorizontal.CENTER;
	}

	getColor(): number {
		return 0x6f6f6f;
	}

	getFontWeight(): DFontWeight {
		return "bold";
	}

	getFontSize(): number {
		return Math.round( super.getFontSize() * 1.25 );
	}

	newTextValue(): any {
		return new Date();
	}

	getTextValue( state: DBaseState ): any {
		return new Date();
	}
}
