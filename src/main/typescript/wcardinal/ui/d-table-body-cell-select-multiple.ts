/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { DSelectMultiple, DSelectMultipleOptions, DThemeSelectMultiple } from "./d-select-multiple";
import { DTableBodyCell } from "./d-table-body-cell";
import { DTableBodyCells } from "./d-table-body-cells";
import { DTableColumn } from "./d-table-column";

export interface DTableBodyCellSelectMultipleOptions<
	ROW = unknown,
	VALUE = unknown,
	THEME extends DThemeTableBodyCellSelectMultiple = DThemeTableBodyCellSelectMultiple
> extends DSelectMultipleOptions<VALUE, THEME> {

}

export interface DThemeTableBodyCellSelectMultiple extends DThemeSelectMultiple {

}

export class DTableBodyCellSelectMultiple<
	ROW = unknown,
	VALUE = unknown,
	THEME extends DThemeTableBodyCellSelectMultiple = DThemeTableBodyCellSelectMultiple,
	OPTIONS extends DTableBodyCellSelectMultipleOptions<ROW, VALUE, THEME>
		= DTableBodyCellSelectMultipleOptions<ROW, VALUE, THEME>
> extends DSelectMultiple<VALUE, THEME, OPTIONS> implements DTableBodyCell<ROW> {
	protected _row?: ROW;
	protected _rowIndex!: number;
	protected _columnIndex!: number;
	protected _columnData!: DTableColumn<ROW>;

	constructor( columnIndex: number, columnData: DTableColumn<ROW>, options: OPTIONS ) {
		super( options );

		this._rowIndex = -1;
		this._columnIndex = columnIndex;
		this._columnData = columnData;

		this.on( "change", ( newValues: unknown, oldValues: unknown ): void => {
			const row = this._row;
			if( row !== undefined ) {
				const rowIndex = this._rowIndex;
				this._columnData.setter( row, columnIndex, newValues );
				this.emit( "cellchange", newValues, oldValues, row, rowIndex, columnIndex, this );
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
		this.values = value as VALUE[];

		const columnData = this._columnData;
		DTableBodyCells.setReadOnly( this, row, columnIndex, columnData );
		DTableBodyCells.setRenderable( this, row, columnIndex, columnData );
	}

	unset(): void {
		this._row = undefined;
		this._rowIndex = -1;
	}

	protected getType(): string {
		return "DTableBodyCellSelectMultiple";
	}
}
