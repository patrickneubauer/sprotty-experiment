"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var types_1 = require("../types");
function overrideCommandStackOptions(container, options) {
    var defaultOptions = container.get(types_1.TYPES.CommandStackOptions);
    for (var p in options) {
        if (options.hasOwnProperty(p))
            defaultOptions[p] = options[p];
    }
    return defaultOptions;
}
exports.overrideCommandStackOptions = overrideCommandStackOptions;
