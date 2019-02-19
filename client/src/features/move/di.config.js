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
var move_1 = require("./move");
var moveModule = new inversify_1.ContainerModule(function (bind) {
    bind(types_1.TYPES.MouseListener).to(move_1.MoveMouseListener);
    bind(types_1.TYPES.ICommand).toConstructor(move_1.MoveCommand);
    bind(types_1.TYPES.IVNodeDecorator).to(move_1.LocationDecorator);
    bind(types_1.TYPES.HiddenVNodeDecorator).to(move_1.LocationDecorator);
});
exports["default"] = moveModule;
