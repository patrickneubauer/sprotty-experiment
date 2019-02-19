"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var inversify_1 = require("inversify");
var button_handler_1 = require("./button-handler");
var buttonModule = new inversify_1.ContainerModule(function (bind) {
    bind(button_handler_1.ButtonHandlerRegistry).toSelf().inSingletonScope();
});
exports["default"] = buttonModule;
