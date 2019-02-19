"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var inversify_1 = require("inversify");
var types_1 = require("../../base/types");
var open_1 = require("./open");
var openModule = new inversify_1.ContainerModule(function (bind) {
    bind(types_1.TYPES.MouseListener).to(open_1.OpenMouseListener);
});
exports["default"] = openModule;
