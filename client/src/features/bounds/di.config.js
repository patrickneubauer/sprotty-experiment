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
var bounds_manipulation_1 = require("./bounds-manipulation");
var hidden_bounds_updater_1 = require("./hidden-bounds-updater");
var layout_1 = require("./layout");
var boundsModule = new inversify_1.ContainerModule(function (bind) {
    bind(types_1.TYPES.ICommand).toConstructor(bounds_manipulation_1.SetBoundsCommand);
    bind(types_1.TYPES.ICommand).toConstructor(bounds_manipulation_1.RequestBoundsCommand);
    bind(types_1.TYPES.HiddenVNodeDecorator).to(hidden_bounds_updater_1.HiddenBoundsUpdater).inSingletonScope();
    bind(types_1.TYPES.Layouter).to(layout_1.Layouter).inSingletonScope();
    bind(types_1.TYPES.LayoutRegistry).to(layout_1.LayoutRegistry).inSingletonScope();
});
exports["default"] = boundsModule;
