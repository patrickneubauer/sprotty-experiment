/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { SNodeSchema, /*Bounds,*/ moveFeature, CircularNode/*, RectangularNode */} from "../../../src";

export interface TaskNodeSchema extends SNodeSchema {
    name?: string
}

export class TaskNode extends CircularNode {
    name: string = '';

    hasFeature(feature: symbol): boolean {
        if (feature === moveFeature)
            return false;
        else
            return super.hasFeature(feature);
    }
}

export class SinkNode extends TaskNode {
}

export class SourceNode extends TaskNode {
}


