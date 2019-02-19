"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var smodel_1 = require("../../base/model/smodel");
exports.viewportFeature = Symbol('viewportFeature');
function isViewport(element) {
    return element instanceof smodel_1.SModelRoot
        && element.hasFeature(exports.viewportFeature)
        && 'zoom' in element
        && 'scroll' in element;
}
exports.isViewport = isViewport;
