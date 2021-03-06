/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { interaction } from "pixi.js";
import { DBasePaddingAdjustable } from "./d-base-padding-adjustable";
import { DBaseState } from "./d-base-state";
import { DLink, DThemeLink } from "./d-link";
import { DLinkTarget } from "./d-link-target";
import {
	DTableBodyCellButton, DTableBodyCellButtonOptions, DThemeTableBodyCellButton
} from "./d-table-body-cell-button";
import { DTableBodyCellLinkLinkOptions, toLinkOptions } from "./d-table-body-cell-link";
import { DTableBodyCells } from "./d-table-body-cells";
import { DTableCellState } from "./d-table-cell-state";
import { DTableColumn } from "./d-table-column";
import { isNumber } from "./util/is-number";
import { UtilPointerEvent } from "./util/util-pointer-event";

export interface DTableBodyCellTreeOptions<
	ROW,
	THEME extends DThemeTableBodyCellTree = DThemeTableBodyCellTree
> extends DTableBodyCellButtonOptions<ROW, THEME> {
	link?: DTableBodyCellLinkLinkOptions<ROW>;
}

export interface DThemeTableBodyCellTree extends DThemeTableBodyCellButton, DThemeLink {
	getLevelPadding( level: number ): number;
}

const toOptions = <
	ROW,
	THEME extends DThemeTableBodyCellTree = DThemeTableBodyCellTree,
	OPTIONS extends DTableBodyCellTreeOptions<ROW, THEME> = DTableBodyCellTreeOptions<ROW, THEME>
>( options: OPTIONS ): OPTIONS => {
	if( options?.link?.target === DLinkTarget.NEW_WINDOW ) {
		options.state = ( options.state || DBaseState.NONE ) || DTableCellState.NEW_WINDOW;
	}
	return options;
};

export class DTableBodyCellTree<
	ROW,
	THEME extends DThemeTableBodyCellTree = DThemeTableBodyCellTree,
	OPTIONS extends DTableBodyCellTreeOptions<ROW, THEME> = DTableBodyCellTreeOptions<ROW, THEME>
> extends DTableBodyCellButton<ROW, THEME, OPTIONS> {
	protected _padding!: DBasePaddingAdjustable;
	protected _link?: DLink | null;

	constructor( columnIndex: number, columnData: DTableColumn<ROW>, options: OPTIONS ) {
		super( columnIndex, columnData, toOptions<ROW, THEME, OPTIONS>( options ) );
		this._padding = new DBasePaddingAdjustable( this._padding );
	}

	protected initOnClick( options: OPTIONS ): void {
		const link = this.link;
		if( link ) {
			link.apply( this, ( e ): void => this.onActive( e ) );
			UtilPointerEvent.onClick( this, ( e: interaction.InteractionEvent ): void => {
				if( link.enable && this.state.isActionable ) {
					this.onActive( e );
				}
			});
		} else {
			super.initOnClick( options );
		}
	}

	get link(): DLink | null {
		let result = this._link;
		if( result === undefined ) {
			result = this.newLink();
			this._link = result;
		}
		return result;
	}

	protected newLink(): DLink | null {
		const options = this._options?.link;
		if( options ) {
			return new DLink( this.theme, toLinkOptions( this, options ) );
		}
		return null;
	}

	protected onActive( e: KeyboardEvent | interaction.InteractionEvent ): void {
		this.emit( "active", this );
		const row = this._row;
		if( row !== undefined ) {
			const rowIndex = this._rowIndex;
			const columnIndex = this._columnIndex;
			this.emit( "cellchange", null, null, row, rowIndex, columnIndex, this );

			const link = this.link;
			if( link?.enable ) {
				link.open( link.inNewWindow( e ) );
			} else {
				const parent = this.parent;
				if( parent ) {
					const body = parent.parent as any;
					if( body ) {
						const data = body.data;
						if( data && data.toggle ) {
							data.toggle( row );
						}
					}
				}
			}
		}
	}

	set(
		value: unknown, row: ROW, supplimental: unknown,
		rowIndex: number, columnIndex: number,
		forcibly?: boolean
	): void {
		this._row = row;
		this._rowIndex = rowIndex;
		this.text = value;

		const columnData = this._columnData;
		DTableBodyCells.setRenderable( this, row, columnIndex, columnData );

		const link = this.link;
		const adjuster = this._padding.adjuster;
		if( isNumber( supplimental ) ) {
			const isOpened = !! (supplimental & 0x1);
			const hasChildren = !! (supplimental & 0x2);
			const level = (supplimental >> 2);
			if( hasChildren ) {
				if( isOpened ) {
					this.state.add( DTableCellState.HAS_CHILDREN | DTableCellState.OPENED );
				} else {
					this.state.set( DTableCellState.HAS_CHILDREN, DTableCellState.OPENED );
				}
				if( link ) {
					link.enable = true;
				}
			} else {
				if( isOpened ) {
					this.state.set( DTableCellState.OPENED, DTableCellState.HAS_CHILDREN );
				} else {
					this.state.remove( DTableCellState.HAS_CHILDREN | DTableCellState.OPENED );
				}
				if( link ) {
					link.enable = true;
				}
			}
			adjuster.left = this.theme.getLevelPadding( level );
		} else {
			this.state.remove( DTableCellState.OPENED | DTableCellState.HAS_CHILDREN );
			adjuster.left = 0;
			if( link ) {
				link.enable = false;
			}
		}
	}

	protected getType(): string {
		return "DTableBodyCellTree";
	}
}
