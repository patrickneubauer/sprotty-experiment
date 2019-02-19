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
exports.__esModule = true;
var easing_1 = require("./easing");
/**
 * An animation uses the rendering loop of the browser to smoothly
 * calculate a transition between two states of a model element.
 */
var Animation = /** @class */ (function () {
    function Animation(context, ease) {
        if (ease === void 0) { ease = easing_1.easeInOut; }
        this.context = context;
        this.ease = ease;
    }
    Animation.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var start = undefined;
            var frames = 0;
            var lambda = function (time) {
                frames++;
                var dtime;
                if (start === undefined) {
                    start = time;
                    dtime = 0;
                }
                else {
                    dtime = time - start;
                }
                var t = Math.min(1, dtime / _this.context.duration);
                var current = _this.tween(_this.ease(t), _this.context);
                _this.context.modelChanged.update(current);
                if (t === 1) {
                    _this.context.logger.log(_this, (frames * 1000 / _this.context.duration) + ' fps');
                    resolve(current);
                }
                else {
                    _this.context.syncer.onNextFrame(lambda);
                }
            };
            if (_this.context.syncer.isAvailable()) {
                _this.context.syncer.onNextFrame(lambda);
            }
            else {
                var finalModel = _this.tween(1, _this.context);
                resolve(finalModel);
            }
        });
    };
    return Animation;
}());
exports.Animation = Animation;
var CompoundAnimation = /** @class */ (function (_super) {
    __extends(CompoundAnimation, _super);
    function CompoundAnimation(model, context, components, ease) {
        if (components === void 0) { components = []; }
        if (ease === void 0) { ease = easing_1.easeInOut; }
        var _this = _super.call(this, context, ease) || this;
        _this.model = model;
        _this.context = context;
        _this.components = components;
        _this.ease = ease;
        return _this;
    }
    CompoundAnimation.prototype.include = function (animation) {
        this.components.push(animation);
        return this;
    };
    CompoundAnimation.prototype.tween = function (t, context) {
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var a = _a[_i];
            a.tween(t, context);
        }
        return this.model;
    };
    return CompoundAnimation;
}(Animation));
exports.CompoundAnimation = CompoundAnimation;
