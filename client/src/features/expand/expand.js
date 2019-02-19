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
var smodel_utils_1 = require("../../base/model/smodel-utils");
var model_1 = require("./model");
var inversify_1 = require("inversify");
/**
 * Sent from the client to the model source to recalculate a diagram when elements
 * are collapsed/expanded by the client.
 */
var CollapseExpandAction = /** @class */ (function () {
    function CollapseExpandAction(expandIds, collapseIds) {
        this.expandIds = expandIds;
        this.collapseIds = collapseIds;
        this.kind = CollapseExpandAction.KIND;
    }
    CollapseExpandAction.KIND = 'collapseExpand';
    return CollapseExpandAction;
}());
exports.CollapseExpandAction = CollapseExpandAction;
/**
 * Programmatic action for expanding or collapsing all elements.
 */
var CollapseExpandAllAction = /** @class */ (function () {
    /**
     * If `expand` is true, all elements are expanded, othewise they are collapsed.
     */
    function CollapseExpandAllAction(expand) {
        if (expand === void 0) { expand = true; }
        this.expand = expand;
        this.kind = CollapseExpandAllAction.KIND;
    }
    CollapseExpandAllAction.KIND = 'collapseExpandAll';
    return CollapseExpandAllAction;
}());
exports.CollapseExpandAllAction = CollapseExpandAllAction;
var ExpandButtonHandler = /** @class */ (function () {
    function ExpandButtonHandler() {
    }
    ExpandButtonHandler.prototype.buttonPressed = function (button) {
        var expandable = smodel_utils_1.findParentByFeature(button, model_1.isExpandable);
        if (expandable !== undefined) {
            return [new CollapseExpandAction(expandable.expanded ? [] : [expandable.id], expandable.expanded ? [expandable.id] : [])];
        }
        else {
            return [];
        }
    };
    ExpandButtonHandler.TYPE = 'button:expand';
    ExpandButtonHandler = __decorate([
        inversify_1.injectable()
    ], ExpandButtonHandler);
    return ExpandButtonHandler;
}());
exports.ExpandButtonHandler = ExpandButtonHandler;
