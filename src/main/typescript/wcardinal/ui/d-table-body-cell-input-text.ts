/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { DInputText, DInputTextOptions, DThemeInputText } from "./d-input-text";
import { DTableBodyCell } from "./d-table-body-cell";
import { DTableBodyCells } from "./d-table-body-cells";
import { DTableColumn } from "./d-table-column";

export interface DTableBodyCellInputTextOptions<
	ROW = unknown,
	THEME extends DThemeTableBodyCellInputText = DThemeTableBodyCellInputText
> extends DInputTextOptions<THEME> {
}

export interface DThemeTableBodyCellInputText extends DThemeInputText {

}

export class DTableBodyCellInputText<
	ROW = unknown,
	THEME extends DThemeTableBodyCellInputText = DThemeTableBodyCellInputText,
	OPTIONS extends DTableBodyCellInputTextOptions<ROW, THEME> = DTableBodyCellInputTextOptions<ROW, THEME>
> extends DInputText<THEME, OPTIONS> implements DTableBodyCell<ROW> {
	protected _row?: ROW;
	protected _rowIndex: number;
	protected _columnIndex: number;
	protected _columnData: DTableColumn<ROW>;

	constructor( columnIndex: number, columnData: DTableColumn<ROW>, options: OPTIONS ) {
		super( options );

		this._rowIndex = -1;
		this._columnIndex = columnIndex;
		this._columnData = columnData;

		this.on( "change", ( newValue: unknown, oldValue: unknown ): void => {
			const row = this._row;
			if( row !== undefined ) {
				const rowIndex = this._rowIndex;
				this._columnData.setter( row, columnIndex, newValue );
				this.emit( "cellchange", newValue, oldValue, row, rowIndex, columnIndex, this );
			}
		});
	}

	get row(): ROW | undefined {
		return this._row;
	}

	get rowIndex(): number {
		return this._rowIndex;
	}

	get columnIndex(): number {
		return this._columnIndex;
	}

	set(
		value: unknown, row: ROW, supplimental: unknown,
		rowIndex: number, columnIndex: number,
		forcibly?: boolean
	): void {
		this._row = row;
		this._rowIndex = rowIndex;
		this.text = String( value );

		const columnData = this._columnData;
		DTableBodyCells.setReadOnly( this, row, columnIndex, columnData );
		DTableBodyCells.setRenderable( this, row, columnIndex, columnData );
	}

	unset(): void {
		this._row = undefined;
		this._rowIndex = -1;
	}

	protected getType(): string {
		return "DTableBodyCellInputText";
	}
}
