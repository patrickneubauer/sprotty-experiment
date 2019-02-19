"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var ExpansionState = /** @class */ (function () {
    function ExpansionState(root) {
        this.expandedElementIds = [];
        this.initialize(root);
    }
    ExpansionState.prototype.initialize = function (element) {
        var _this = this;
        if (element.expanded)
            this.expandedElementIds.push(element.id);
        if (element.children !== undefined)
            element.children.forEach(function (child) { return _this.initialize(child); });
    };
    ExpansionState.prototype.apply = function (action) {
        for (var _i = 0, _a = action.collapseIds; _i < _a.length; _i++) {
            var collapsed = _a[_i];
            var index = this.expandedElementIds.indexOf(collapsed);
            if (index !== -1)
                this.expandedElementIds.splice(index, 1);
        }
        for (var _b = 0, _c = action.expandIds; _b < _c.length; _b++) {
            var expanded = _c[_b];
            this.expandedElementIds.push(expanded);
        }
    };
    ExpansionState.prototype.collapseAll = function () {
        this.expandedElementIds = [];
    };
    return ExpansionState;
}());
exports.ExpansionState = ExpansionState;
