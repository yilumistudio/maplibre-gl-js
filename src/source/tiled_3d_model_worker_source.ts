import type {
    WorkerSource,
    WorkerTileParameters,
    WorkerTileCallback,
    TileParameters,
} from '../source/worker_source';
import {getArrayBuffer} from '../../src/util/ajax.js';

import type {Actor} from '../util/actor';
import type {StyleLayerIndex} from '../style/style_layer_index';

// Do nothing tiled 3d worker tile. No parsing at the moment.
class Tiled3dWorkerTile {
    uid: string;

    constructor(params: WorkerTileParameters) {
        this.uid = params.uid;
    }
}

export class Tiled3dModelWorkerSource implements WorkerSource {
    actor: Actor;
    layerIndex: StyleLayerIndex;
    availableImages: Array<string>;
    loading: {[_: string]: Tiled3dWorkerTile };
    loaded: {[_: string]: Tiled3dWorkerTile };

    constructor(actor: Actor, layerIndex: StyleLayerIndex, availableImages: Array<string>) {
        this.actor = actor;
        this.layerIndex = layerIndex;
        this.availableImages = availableImages;
        this.loading = {};
        this.loaded = {};
    }

    loadTile(params: WorkerTileParameters, callback: WorkerTileCallback) {
        const uid = params.uid;
        const workerTile = this.loading[uid] = new Tiled3dWorkerTile(params);
        getArrayBuffer(params.request, (err?: Error, data?: ArrayBuffer) => {
            const aborted = !this.loading[uid];
            delete this.loading[uid];

            if (aborted || err) {
                if (!aborted) this.loaded[uid] = workerTile;
                return callback(err);
            }

            if (!data || data.byteLength === 0) {
                this.loaded[uid] = workerTile;
                return callback();
            }

            this.loaded = this.loaded || {};
            this.loaded[uid] = workerTile;

            callback(null, {
                buckets: [],
                featureIndex: null,
                collisionBoxArray: null,
                rawTileData: data,
                imageAtlas: undefined,
                glyphAtlasImage: undefined
            });
        });
    }

    /**
     * Do nothing.
     * {@link WorkerSource#loadTile}.
     */
    reloadTile(_: WorkerTileParameters, __: WorkerTileCallback) {

    }

    /**
     * Aborts loading a tile that is in progress.
     */
    abortTile(params: TileParameters, callback: WorkerTileCallback) {
        const uid = params.uid;
        const tile = this.loading[uid];
        if (tile) {
            delete this.loading[uid];
        }
        callback();
    }

    /**
     * Removes this tile from any local caches.
     */
    removeTile(params: TileParameters, callback: WorkerTileCallback) {
        const loaded = this.loaded,
            uid = params.uid;
        if (loaded && loaded[uid]) {
            delete loaded[uid];
        }
        callback();
    }
}
