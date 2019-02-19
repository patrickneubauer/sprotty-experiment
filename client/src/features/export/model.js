"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
exports.exportFeature = Symbol('exportFeature');
function isExportable(element) {
    return element.hasFeature(exports.exportFeature) && element['export'] !== undefined;
}
exports.isExportable = isExportable;
