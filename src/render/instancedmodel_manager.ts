import {Event, Evented} from '../util/evented';
import type {InstancedModelsSpecification} from '../style/style';

// Just load the model array buffer.
export class InstancedModelManager extends Evented {
    modelBuffers: {[_: string]: ArrayBuffer};
    numModelsLoading: number;

    constructor() {
        super();
        this.modelBuffers = {};
        this.numModelsLoading = 0;
    }

    async loadModelBuffer(id: string, url: string): Promise<ArrayBuffer | undefined> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok for URL: ${url}`);
            }
            const buffer = await response.arrayBuffer();
            return buffer;
        } catch (error) {
            console.error(`Failed to load model buffer for id ${id} from ${url}:`, error);
            return undefined;
        }
    }

    async load(modelUris: { [_: string]: string }) {
        const modelIds = Object.keys(modelUris);
        this.numModelsLoading += modelIds.length;

        const modelLoads: Promise<ArrayBuffer | undefined>[] = modelIds.map(modelId =>
            this.loadModelBuffer(modelId, modelUris[modelId]).catch(e => {
                console.error(`Error loading model ${modelId}:`, e);
                return undefined;
            })
        );

        const results = await Promise.all(modelLoads);

        for (let i = 0; i < results.length; i++) {
            const buffer = results[i];
            if (buffer) {
                this.modelBuffers[modelIds[i]] = buffer;
            }
        }

        this.numModelsLoading -= modelIds.length;
        this.fire(new Event('data', {dataType: 'style'}));
    }

    addModels(models: InstancedModelsSpecification) {
        return this.load(models);
    }

    getModelBuffer(modelId: string): ArrayBuffer | undefined {
        if (modelId in this.modelBuffers) {
            return this.modelBuffers[modelId];
        } else {
            return undefined;
        }
    }
}
