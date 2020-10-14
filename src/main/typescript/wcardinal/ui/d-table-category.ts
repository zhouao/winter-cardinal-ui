/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { DBase } from "./d-base";
import { DTableCategoryCell, DTableCategoryCellOptions } from "./d-table-category-cell";
import { DTableRow, DTableRowOptions, DThemeTableRow } from "./d-table-row";

export interface DTableCategoryColumn {
	label?: string;
	weight?: number;
	width?: number;
	offset: number;
}

export interface DTableCategoryOptions<
	THEME extends DThemeTableCategory = DThemeTableCategory
> extends DTableRowOptions<unknown, DTableCategoryColumn, THEME> {
	offset?: number;
	cell?: DTableCategoryCellOptions;
}

export interface DThemeTableCategory extends DThemeTableRow {

}

export class DTableCategory<
	THEME extends DThemeTableCategory = DThemeTableCategory,
	OPTIONS extends DTableCategoryOptions<THEME> = DTableCategoryOptions<THEME>
> extends DTableRow<unknown, DTableCategoryColumn, THEME, OPTIONS> {
	protected _offset!: number;

	constructor( options: OPTIONS ) {
		super( options );
	}

	protected init( options: OPTIONS ) {
		this._offset = this.transform.position.y = options.offset || 0;
		super.init( options );
	}

	protected onParentMove( newX: number, newY: number, oldX: number, oldY: number ): void {
		super.onParentMove( newX, newY, oldX, oldY );
		this.transform.position.y = -newY + this._offset;
		this.updateFrozenCellPosition( newX );
	}

	protected getContentPositionX(): number {
		const content = this.parent;
		if( content ) {
			return content.position.x;
		}
		return 0;
	}

	protected newCell(
		columnIndex: number,
		columnData: DTableCategoryColumn,
		columnDataList: DTableCategoryColumn[],
		options: OPTIONS
	): DBase {
		return new DTableCategoryCell( this.toCellOptions( columnIndex, columnData, options ) );
	}

	protected toCellOptions(
		columnIndex: number,
		columnData: DTableCategoryColumn,
		options: OPTIONS
	): DTableCategoryCellOptions {
		const result = options.cell;
		if( result ) {
			result.weight = columnData.weight;
			result.width = columnData.width;
			const text = result.text = result.text || {};
			text.value = text.value || columnData.label;
			return result;
		} else {
			return {
				weight: columnData.weight,
				width: columnData.width,
				text: {
					value: columnData.label
				}
			};
		}
	}

	protected getType(): string {
		return "DTableCategory";
	}
}
