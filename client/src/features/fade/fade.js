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
exports.__esModule = true;
var inversify_1 = require("inversify");
var animation_1 = require("../../base/animations/animation");
var smodel_1 = require("../../base/model/smodel");
var vnode_utils_1 = require("../../base/views/vnode-utils");
var model_1 = require("./model");
var FadeAnimation = /** @class */ (function (_super) {
    __extends(FadeAnimation, _super);
    function FadeAnimation(model, elementFades, context, removeAfterFadeOut) {
        if (removeAfterFadeOut === void 0) { removeAfterFadeOut = false; }
        var _this = _super.call(this, context) || this;
        _this.model = model;
        _this.elementFades = elementFades;
        _this.removeAfterFadeOut = removeAfterFadeOut;
        return _this;
    }
    FadeAnimation.prototype.tween = function (t, context) {
        for (var _i = 0, _a = this.elementFades; _i < _a.length; _i++) {
            var elementFade = _a[_i];
            var element = elementFade.element;
            if (elementFade.type === 'in') {
                element.opacity = t;
            }
            else if (elementFade.type === 'out') {
                element.opacity = 1 - t;
                if (t === 1 && this.removeAfterFadeOut && element instanceof smodel_1.SChildElement) {
                    element.parent.remove(element);
                }
            }
        }
        return this.model;
    };
    return FadeAnimation;
}(animation_1.Animation));
exports.FadeAnimation = FadeAnimation;
var ElementFader = /** @class */ (function () {
    function ElementFader() {
    }
    ElementFader.prototype.decorate = function (vnode, element) {
        if (model_1.isFadeable(element)) {
            vnode_utils_1.setAttr(vnode, 'opacity', element.opacity);
        }
        return vnode;
    };
    ElementFader.prototype.postUpdate = function () {
    };
    ElementFader = __decorate([
        inversify_1.injectable()
    ], ElementFader);
    return ElementFader;
}());
exports.ElementFader = ElementFader;
