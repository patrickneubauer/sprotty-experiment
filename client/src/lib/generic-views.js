"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var strings_1 = require("snabbdom-virtualize/strings");
var PreRenderedView = /** @class */ (function () {
    function PreRenderedView() {
    }
    PreRenderedView.prototype.render = function (model, context) {
        var node = strings_1["default"](model.code);
        this.correctNamespace(node);
        return node;
    };
    PreRenderedView.prototype.correctNamespace = function (node) {
        if (node.sel === 'svg' || node.sel === 'g')
            this.setNamespace(node, 'http://www.w3.org/2000/svg');
    };
    PreRenderedView.prototype.setNamespace = function (node, ns) {
        if (node.data === undefined)
            node.data = {};
        node.data.ns = ns;
        var children = node.children;
        if (children !== undefined) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (typeof child !== 'string')
                    this.setNamespace(child, ns);
            }
        }
    };
    return PreRenderedView;
}());
exports.PreRenderedView = PreRenderedView;
