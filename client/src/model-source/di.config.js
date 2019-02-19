"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var inversify_1 = require("inversify");
var types_1 = require("../base/types");
/**
 * This container module does NOT provide any binding for TYPES.ModelSource because that needs to be
 * done according to the needs of the application. You can choose between a local (LocalModelSource)
 * and a remote (e.g. WebSocketDiagramServer) implementation.
 */
var modelSourceModule = new inversify_1.ContainerModule(function (bind) {
    bind(types_1.TYPES.ModelSourceProvider).toProvider(function (context) {
        return function () {
            return new Promise(function (resolve) {
                resolve(context.container.get(types_1.TYPES.ModelSource));
            });
        };
    });
});
exports["default"] = modelSourceModule;
