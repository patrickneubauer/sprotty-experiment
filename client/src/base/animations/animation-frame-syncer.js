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
var AnimationFrameSyncer = /** @class */ (function () {
    function AnimationFrameSyncer() {
        this.tasks = [];
        this.endTasks = [];
        this.triggered = false;
    }
    AnimationFrameSyncer.prototype.isAvailable = function () {
        return typeof requestAnimationFrame === "function";
    };
    AnimationFrameSyncer.prototype.onNextFrame = function (task) {
        this.tasks.push(task);
        this.trigger();
    };
    AnimationFrameSyncer.prototype.onEndOfNextFrame = function (task) {
        this.endTasks.push(task);
        this.trigger();
    };
    AnimationFrameSyncer.prototype.trigger = function () {
        var _this = this;
        if (!this.triggered) {
            this.triggered = true;
            if (this.isAvailable())
                requestAnimationFrame(function (time) { return _this.run(time); });
            else
                setTimeout(function (time) { return _this.run(time); });
        }
    };
    AnimationFrameSyncer.prototype.run = function (time) {
        var tasks = this.tasks;
        var endTasks = this.endTasks;
        this.triggered = false;
        this.tasks = [];
        this.endTasks = [];
        tasks.forEach(function (task) { return task.call(undefined, time); });
        endTasks.forEach(function (task) { return task.call(undefined, time); });
    };
    AnimationFrameSyncer = __decorate([
        inversify_1.injectable()
    ], AnimationFrameSyncer);
    return AnimationFrameSyncer;
}());
exports.AnimationFrameSyncer = AnimationFrameSyncer;
