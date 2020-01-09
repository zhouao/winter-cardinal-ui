/*
 * Copyright (C) 2019 Toshiba Corporation
 * SPDX-License-Identifier: Apache-2.0
 */

import { IPoint, utils } from "pixi.js";
import { DApplications } from "./d-applications";
import { DBaseOnOptions } from "./d-base";
import { DBaseState } from "./d-base-state";
import { DChartRegionImmutable } from "./d-chart-region";
import { DChartRegionImpl } from "./d-chart-region-impl";
import { DChartSeries, DChartSeriesHitResult } from "./d-chart-series";
import { DChartSeriesBaseCoordinateContainer } from "./d-chart-series-base-coordinate-container";
import { DChartSeriesContainer } from "./d-chart-series-container";
import { DChartSeriesCoordinateContainer, DChartSeriesCoordinateOptions } from "./d-chart-series-coordinate";
import { EShape } from "./shape/e-shape";
import { EShapePointsHitThreshold } from "./shape/e-shape-points";
import { utilCeilingIndex } from "./util/util-ceiling-index";

/**
 * {@link DChartSeriesBase} options.
 */
export interface DChartSeriesBaseOptions {
	coordinate?: DChartSeriesCoordinateOptions;
	on?: DBaseOnOptions;
}

/**
 * A series represents a polyline.
 */
export abstract class DChartSeriesBase extends utils.EventEmitter implements DChartSeries {
	protected _coordinate: DChartSeriesBaseCoordinateContainer;

	protected _container?: DChartSeriesContainer;
	protected _index: number;

	protected _domain: DChartRegionImpl;
	protected _range: DChartRegionImpl;
	protected _regionPointId: number;

	protected _state: DBaseState;
	protected _stateLocal: DBaseState;

	abstract readonly shape: EShape | null;

	constructor( options?: DChartSeriesBaseOptions ) {
		super();

		this._coordinate = new DChartSeriesBaseCoordinateContainer( this, options && options.coordinate );
		this._index = 0;
		this._domain = new DChartRegionImpl( NaN, NaN );
		this._range = new DChartRegionImpl( NaN, NaN );
		this._regionPointId = NaN;

		this._state = DBaseState.NONE;
		this._stateLocal = DBaseState.NONE;

		// Events
		if( options ) {
			const on = options.on;
			if( on != null ) {
				for( const name in on ) {
					this.on( name, on[ name ] );
				}
			}
		}
	}

	bind( container: DChartSeriesContainer, index: number ): void {
		this._container = container;
		this._coordinate.reset();
		this._index = index;
	}

	unbind(): void {
		this._container = undefined;
	}

	abstract toDirty(): void;
	abstract update(): void;

	get domain(): DChartRegionImmutable {
		this.updateRegion();
		return this._domain;
	}

	get range(): DChartRegionImmutable {
		this.updateRegion();
		return this._range;
	}

	get container(): DChartSeriesContainer | null {
		return this._container || null;
	}

	get index(): number {
		return this._index;
	}

	get coordinate(): DChartSeriesCoordinateContainer {
		return this._coordinate;
	}

	protected abstract updateRegion(): void;

	destroy(): void {
		this._container = undefined;
		this._coordinate.destroy();
	}

	hitTest( global: IPoint ): boolean {
		return false;
	}

	calcHitPoint( global: IPoint, threshold: EShapePointsHitThreshold, result: DChartSeriesHitResult ): boolean {
		return false;
	}

	calcHitPointTestRange(
		this: unknown,
		shape: unknown,
		x: number, y: number,
		threshold: number,
		values: number[],
		result: [ number, number ]
	): [ number, number ] {
		const index = utilCeilingIndex( values, x, 2, 0 );
		result[ 0 ] = Math.max( 0, index - 1 );
		result[ 1 ] = index;
		return result;
	}

	calcHitPointHitTester(
		this: unknown,
		shape: EShape,
		x: number, y: number,
		p0x: number, p0y: number,
		p1x: number, p1y: number,
		index: number,
		threshold: number,
		result: DChartSeriesHitResult
	): boolean {
		if( p0x <= x && x < p1x ) {
			const l = p1x - p0x;
			if( 0.0001 < Math.abs( l ) ) {
				const t = (x - p0x) / l;
				const p2x = x;
				const p2y = p0y + t * (p1y - p0y);
				const distance = Math.abs(p2y - y);
				if( distance < threshold ) {
					const position = shape.transform.position;
					const px = position.x;
					const py = position.y;
					result.x = px + p2x;
					result.y = py + p2y;
					result.p0x = px + p0x;
					result.p0y = py + p0y;
					result.p1x = px + p1x;
					result.p1y = py + p1y;
					result.t = t;
					result.index = index;
					result.distance = distance;
					return true;
				}
			}
		}
		return false;
	}

	setState( state: DBaseState, isOn: boolean ): void {
		const oldStateLocal = this._stateLocal;
		const newStateLocal = ( isOn ? (oldStateLocal | state) : (oldStateLocal & ~state) );
		if( oldStateLocal !== newStateLocal ) {
			this._stateLocal = newStateLocal;
			this.updateState();
		}
	}

	protected updateState(): void {
		const container = this._container;
		const chart = container && container.plotArea.chart;
		const stateLocal = this._stateLocal;
		const newState = ( chart ?
			this.mergeState( stateLocal, chart.state ) :
			stateLocal
		);
		const oldState = this._state;
		if( oldState !== newState ) {
			this._state = newState;
			this.onStateChange( newState, oldState );
		}
	}

	protected mergeState( stateLocal: DBaseState, stateParent: DBaseState ): DBaseState {
		return stateLocal | ( stateParent & DBaseState.DISABLED ) |
			( stateParent & (DBaseState.FOCUSED | DBaseState.FOCUSED_IN) ? DBaseState.FOCUSED_IN : DBaseState.NONE ) |
			( stateParent & (DBaseState.ACTIVE | DBaseState.ACTIVE_IN) ? DBaseState.ACTIVE_IN : DBaseState.NONE );
	}

	protected onStateChange( newState: number, oldState: number ) {
		this.toDirty();
		const container = this._container;
		const chart = container && container.plotArea.chart;
		DApplications.update( chart );
		this.emit( "statechange", newState, oldState, this );
	}
}
