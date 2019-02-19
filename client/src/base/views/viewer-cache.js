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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var types_1 = require("../types");
/**
 * Updating the view is rather expensive, and it doesn't make sense to calculate
 * more then one update per animation (rendering) frame. So this class batches
 * all incoming model changes and only renders the last one when the next animation
 * frame comes.
 */
var ViewerCache = /** @class */ (function () {
    function ViewerCache(delegate, syncer) {
        this.delegate = delegate;
        this.syncer = syncer;
    }
    ViewerCache.prototype.isCacheEmpty = function () {
        return this.cachedModelRoot === undefined && this.cachedHiddenModelRoot === undefined &&
            this.cachedPopup === undefined;
    };
    ViewerCache.prototype.updatePopup = function (model) {
        var isCacheEmpty = this.isCacheEmpty();
        this.cachedPopup = model;
        if (isCacheEmpty)
            this.scheduleUpdate();
    };
    ViewerCache.prototype.update = function (model) {
        var isCacheEmpty = this.isCacheEmpty();
        this.cachedModelRoot = model;
        if (isCacheEmpty)
            this.scheduleUpdate();
    };
    ViewerCache.prototype.updateHidden = function (hiddenModel) {
        var isCacheEmpty = this.isCacheEmpty();
        this.cachedHiddenModelRoot = hiddenModel;
        if (isCacheEmpty)
            this.scheduleUpdate();
    };
    ViewerCache.prototype.scheduleUpdate = function () {
        var _this = this;
        this.syncer.onEndOfNextFrame(function () {
            if (_this.cachedHiddenModelRoot) {
                var nextHiddenModelRoot = _this.cachedHiddenModelRoot;
                _this.delegate.updateHidden(nextHiddenModelRoot);
                _this.cachedHiddenModelRoot = undefined;
            }
            if (_this.cachedModelRoot) {
                var nextModelRoot = _this.cachedModelRoot;
                _this.delegate.update(nextModelRoot);
                _this.cachedModelRoot = undefined;
            }
            if (_this.cachedPopup) {
                var nextModelRoot = _this.cachedPopup;
                _this.delegate.updatePopup(nextModelRoot);
                _this.cachedPopup = undefined;
            }
        });
    };
    ViewerCache = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IViewer)), __param(0, inversify_1.named('delegate')),
        __param(1, inversify_1.inject(types_1.TYPES.AnimationFrameSyncer))
    ], ViewerCache);
    return ViewerCache;
}());
exports.ViewerCache = ViewerCache;
