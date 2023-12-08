import {Event, ErrorEvent, Evented} from '../util/evented';
import {loadTileJson} from './load_tilejson';
import {extend} from '../util/util';
import {ResourceType} from '../util/request_manager';

import type {Map} from '../ui/map';
import type {Dispatcher} from '../util/dispatcher';
import {Source} from './source';
import {TileBounds} from './tile_bounds';
import {Callback} from '../types/callback';
import {OverscaledTileID} from './tile_id';
import {Cancelable} from '../types/cancelable';
import {Tile} from './tile';

/**
 * Options to add a tiled 3d model source type to the map.
 */
export type Tiled3DModelSourceSpecification = {
    type: 'batched-model';
    maxzoom?: number;
    minzoom?: number;
    tiles?: Array<string>;
    url?: string;
};

/**
 * A source containing tiled 3d models (pre-batch processed).
 *
 * @group Sources
 *
 */
export class Tiled3DModelSource extends Evented implements Source {
    type: 'batched-model';
    id: string;
    scope: string;
    minzoom: number;
    maxzoom: number;
    url?: string;
    tileBounds: TileBounds;
    roundZoom: boolean;
    reparseOverscaled: boolean;
    tileSize: number;
    tiles: Array<string>;
    dispatcher: Dispatcher;
    scheme: string;
    _loaded: boolean;
    _options: Tiled3DModelSourceSpecification;
    _tileJSONRequest: Cancelable;
    map: Map;

    /** @internal */
    constructor(id: string, options: Tiled3DModelSourceSpecification, dispatcher: Dispatcher, eventedParent: Evented) {
        super();
        this.type = 'batched-model';
        this.id = id;
        this.tileSize = 512;
        this.url = options.url;

        this.tiles = options.tiles || [];
        this.maxzoom = options.maxzoom || 19;
        this.minzoom = options.minzoom || 0;
        this.roundZoom = true;
        this.dispatcher = dispatcher;
        this.reparseOverscaled = false;
        this.scheme = 'xyz';
        this._loaded = false;
        this._options = extend({}, options);

        this.setEventedParent(eventedParent);
    }

    onAdd(map: Map) {
        this.map = map;
        this.load();
    }

    load = (callback?: Callback<void>) => {
        this._loaded = false;
        this.fire(new Event('dataloading', {dataType: 'source'}));
        this._tileJSONRequest = loadTileJson(this._options, this.map._requestManager, (err, tileJSON) => {
            this._tileJSONRequest = null;
            this._loaded = true;
            if (err) {
                this.fire(new ErrorEvent(err));
            } else if (tileJSON) {
                extend(this, tileJSON);
                if (tileJSON.bounds) this.tileBounds = new TileBounds(tileJSON.bounds, this.minzoom, this.maxzoom);

                // `content` is included here to prevent a race condition where `Style#_updateSources` is called
                // before the TileJSON arrives. this makes sure the tiles needed are loaded once TileJSON arrives
                // ref: https://github.com/mapbox/mapbox-gl-js/pull/4347#discussion_r104418088
                this.fire(new Event('data', {dataType: 'source', sourceDataType: 'metadata'}));
                this.fire(new Event('data', {dataType: 'source', sourceDataType: 'content'}));
            }

            if (callback) callback(err);
        });
    };

    hasTransition() {
        return false;
    }

    hasTile(tileID: OverscaledTileID): boolean {
        return !this.tileBounds || this.tileBounds.contains(tileID.canonical);
    }

    loaded(): boolean {
        return this._loaded;
    }

    loadTile(tile: Tile, callback: Callback<void>) {
        const url = tile.tileID.canonical.url(this.tiles, this.map.getPixelRatio(), this.scheme);
        const params = {
            request: this.map._requestManager.transformRequest(url, ResourceType.Tile),
            data: undefined,
            uid: tile.uid,
            tileID: tile.tileID,
            zoom: tile.tileID.overscaledZ,
            tileSize: this.tileSize * tile.tileID.overscaleFactor(),
            type: this.type,
            source: this.id,
            scope: this.scope,
            pixelRatio: this.map.getPixelRatio(),
            showCollisionBoxes: this.map.showCollisionBoxes,
        };

        if (!tile.actor || tile.state === 'expired') {
            tile.actor = this.dispatcher.getActor();
            tile.request = tile.actor.send('loadTile', params, done.bind(this), undefined, true);
        } else if (tile.state === 'loading') {
            // schedule tile reloading after it has been loaded
            tile.reloadCallback = callback;
        } else {
            tile.request = tile.actor.send('reloadTile', params, done.bind(this));
        }

        // $FlowFixMe[missing-this-annot]
        function done(err: Error | any, data: any) {
            delete tile.request;
            if (tile.aborted) return callback(null);

            if (err && err.status !== 404) {
                return callback(err);
            }

            if (data) {
                if (data.resourceTiming) tile.resourceTiming = data.resourceTiming;
                if (this.map._refreshExpiredTiles) tile.setExpiryData(data);
                tile.buckets = {...tile.buckets, ...data.buckets};
            }
            tile.load3dModelData(data);

            tile.state = 'loaded';
            callback(null);
        }
    }

    serialize(): Tiled3DModelSourceSpecification {
        return extend({}, this._options);
    }
}
