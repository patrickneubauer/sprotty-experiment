"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
exports.fadeFeature = Symbol('fadeFeature');
function isFadeable(element) {
    return element.hasFeature(exports.fadeFeature) && element['opacity'] !== undefined;
}
exports.isFadeable = isFadeable;
