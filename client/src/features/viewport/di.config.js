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
var center_fit_1 = require("./center-fit");
var viewport_1 = require("./viewport");
var scroll_1 = require("./scroll");
var zoom_1 = require("./zoom");
var viewportModule = new inversify_1.ContainerModule(function (bind) {
    bind(types_1.TYPES.ICommand).toConstructor(center_fit_1.CenterCommand);
    bind(types_1.TYPES.ICommand).toConstructor(center_fit_1.FitToScreenCommand);
    bind(types_1.TYPES.ICommand).toConstructor(viewport_1.ViewportCommand);
    bind(types_1.TYPES.KeyListener).to(center_fit_1.CenterKeyboardListener);
    bind(types_1.TYPES.MouseListener).to(scroll_1.ScrollMouseListener);
    bind(types_1.TYPES.MouseListener).to(zoom_1.ZoomMouseListener);
});
exports["default"] = viewportModule;
