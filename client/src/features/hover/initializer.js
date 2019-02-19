"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var hover_1 = require("./hover");
var smodel_factory_1 = require("../../base/model/smodel-factory");
var center_fit_1 = require("../viewport/center-fit");
var viewport_1 = require("../viewport/viewport");
var move_1 = require("../move/move");
var ClosePopupActionHandler = /** @class */ (function () {
    function ClosePopupActionHandler() {
        this.popupOpen = false;
    }
    ClosePopupActionHandler.prototype.handle = function (action) {
        if (action.kind === hover_1.SetPopupModelCommand.KIND) {
            this.popupOpen = action.newRoot.type !== smodel_factory_1.EMPTY_ROOT.type;
        }
        else if (this.popupOpen) {
            return new hover_1.SetPopupModelAction({ id: smodel_factory_1.EMPTY_ROOT.id, type: smodel_factory_1.EMPTY_ROOT.type });
        }
    };
    return ClosePopupActionHandler;
}());
var PopupActionHandlerInitializer = /** @class */ (function () {
    function PopupActionHandlerInitializer() {
    }
    PopupActionHandlerInitializer.prototype.initialize = function (registry) {
        var closePopupActionHandler = new ClosePopupActionHandler();
        registry.register(center_fit_1.FitToScreenCommand.KIND, closePopupActionHandler);
        registry.register(center_fit_1.CenterCommand.KIND, closePopupActionHandler);
        registry.register(viewport_1.ViewportCommand.KIND, closePopupActionHandler);
        registry.register(hover_1.SetPopupModelCommand.KIND, closePopupActionHandler);
        registry.register(move_1.MoveCommand.KIND, closePopupActionHandler);
    };
    PopupActionHandlerInitializer = __decorate([
        inversify_1.injectable()
    ], PopupActionHandlerInitializer);
    return PopupActionHandlerInitializer;
}());
exports.PopupActionHandlerInitializer = PopupActionHandlerInitializer;
