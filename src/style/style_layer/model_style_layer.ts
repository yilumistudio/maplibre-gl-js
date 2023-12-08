import {StyleLayer} from '../style_layer';

import type {LayerSpecification} from '@maplibre/maplibre-gl-style-spec';
import type {ModelLayerSpecification} from '../style';

export class ModelStyleLayer extends StyleLayer {

    constructor(layer: ModelLayerSpecification) {
        super(layer, {});
    }

    is3D() {
        return true;
    }

    recalculate() {}
    updateTransitions() {}
    hasTransition() { return false; }

    serialize(): LayerSpecification {
        throw new Error('Model layers cannot be serialized');
    }
}

