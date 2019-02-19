"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var command_1 = require("../../base/commands/command");
var model_1 = require("../select/model");
var smodel_1 = require("../../base/model/smodel");
var key_tool_1 = require("../../base/views/key-tool");
var keyboard_1 = require("../../utils/keyboard");
var model_2 = require("./model");
var smodel_factory_1 = require("../../base/model/smodel-factory");
var model_3 = require("../viewport/model");
var model_4 = require("../hover/model");
var types_1 = require("../../base/types");
var ExportSvgKeyListener = /** @class */ (function (_super) {
    __extends(ExportSvgKeyListener, _super);
    function ExportSvgKeyListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportSvgKeyListener.prototype.keyDown = function (element, event) {
        if (keyboard_1.matchesKeystroke(event, 'KeyE', 'ctrlCmd', 'shift'))
            return [new RequestExportSvgAction()];
        else
            return [];
    };
    ExportSvgKeyListener = __decorate([
        inversify_1.injectable()
    ], ExportSvgKeyListener);
    return ExportSvgKeyListener;
}(key_tool_1.KeyListener));
exports.ExportSvgKeyListener = ExportSvgKeyListener;
var RequestExportSvgAction = /** @class */ (function () {
    function RequestExportSvgAction() {
        this.kind = ExportSvgCommand.KIND;
    }
    return RequestExportSvgAction;
}());
exports.RequestExportSvgAction = RequestExportSvgAction;
var ExportSvgCommand = /** @class */ (function (_super) {
    __extends(ExportSvgCommand, _super);
    function ExportSvgCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportSvgCommand.prototype.execute = function (context) {
        if (model_2.isExportable(context.root)) {
            var root = context.modelFactory.createRoot(context.modelFactory.createSchema(context.root));
            if (model_2.isExportable(root)) {
                root["export"] = true;
                if (model_3.isViewport(root)) {
                    root.zoom = 1;
                    root.scroll = {
                        x: 0,
                        y: 0
                    };
                }
                root.index.all().forEach(function (element) {
                    if (model_1.isSelectable(element) && element.selected)
                        element.selected = false;
                    if (model_4.isHoverable(element) && element.hoverFeedback)
                        element.hoverFeedback = false;
                });
                return root;
            }
        }
        return context.modelFactory.createRoot(smodel_factory_1.EMPTY_ROOT);
    };
    ExportSvgCommand.KIND = 'requestExportSvg';
    return ExportSvgCommand;
}(command_1.HiddenCommand));
exports.ExportSvgCommand = ExportSvgCommand;
var ExportSvgDecorator = /** @class */ (function () {
    function ExportSvgDecorator(svgExporter) {
        this.svgExporter = svgExporter;
    }
    ExportSvgDecorator.prototype.decorate = function (vnode, element) {
        if (element instanceof smodel_1.SModelRoot)
            this.root = element;
        return vnode;
    };
    ExportSvgDecorator.prototype.postUpdate = function () {
        if (this.root && model_2.isExportable(this.root) && this.root["export"])
            this.svgExporter["export"](this.root);
    };
    ExportSvgDecorator = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.SvgExporter))
    ], ExportSvgDecorator);
    return ExportSvgDecorator;
}());
exports.ExportSvgDecorator = ExportSvgDecorator;
