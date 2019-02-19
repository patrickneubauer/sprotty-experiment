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
var hover_1 = require("./hover");
var popup_position_updater_1 = require("./popup-position-updater");
var initializer_1 = require("./initializer");
var hoverModule = new inversify_1.ContainerModule(function (bind) {
    bind(types_1.TYPES.PopupVNodeDecorator).to(popup_position_updater_1.PopupPositionUpdater).inSingletonScope();
    bind(types_1.TYPES.IActionHandlerInitializer).to(initializer_1.PopupActionHandlerInitializer);
    bind(types_1.TYPES.ICommand).toConstructor(hover_1.HoverFeedbackCommand);
    bind(types_1.TYPES.ICommand).toConstructor(hover_1.SetPopupModelCommand);
    bind(types_1.TYPES.MouseListener).to(hover_1.HoverMouseListener);
    bind(types_1.TYPES.PopupMouseListener).to(hover_1.PopupHoverMouseListener);
    bind(types_1.TYPES.KeyListener).to(hover_1.HoverKeyListener);
    bind(types_1.TYPES.HoverState).toConstantValue({
        mouseOverTimer: undefined,
        mouseOutTimer: undefined,
        popupOpen: false,
        previousPopupElement: undefined
    });
});
exports["default"] = hoverModule;
