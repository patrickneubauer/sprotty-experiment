"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var snabbdom_1 = require("snabbdom");
/**
 * An view that avoids calculation and patching of VNodes unless some model properties have changed.
 * Based on snabbdom's thunks.
 */
var ThunkView = /** @class */ (function () {
    function ThunkView() {
    }
    ThunkView.prototype.render = function (model, context) {
        var _this = this;
        return snabbdom_1.h(this.selector(model), {
            key: model.id,
            hook: {
                init: this.init.bind(this),
                prepatch: this.prepatch.bind(this)
            },
            fn: function () { return _this.renderAndDecorate(model, context); },
            args: this.watchedArgs(model),
            thunk: true
        });
    };
    ThunkView.prototype.renderAndDecorate = function (model, context) {
        var vnode = this.doRender(model, context);
        context.decorate(vnode, model);
        return vnode;
    };
    ThunkView.prototype.copyToThunk = function (vnode, thunk) {
        thunk.elm = vnode.elm;
        vnode.data.fn = thunk.data.fn;
        vnode.data.args = thunk.data.args;
        thunk.data = vnode.data;
        thunk.children = vnode.children;
        thunk.text = vnode.text;
        thunk.elm = vnode.elm;
    };
    ThunkView.prototype.init = function (thunk) {
        var cur = thunk.data;
        var vnode = cur.fn.apply(undefined, cur.args);
        this.copyToThunk(vnode, thunk);
    };
    ThunkView.prototype.prepatch = function (oldVnode, thunk) {
        var old = oldVnode.data, cur = thunk.data;
        if (!this.equals(old.args, cur.args))
            this.copyToThunk(cur.fn.apply(undefined, cur.args), thunk);
        else
            this.copyToThunk(oldVnode, thunk);
    };
    ThunkView.prototype.equals = function (oldArg, newArg) {
        if (Array.isArray(oldArg) && Array.isArray(newArg)) {
            if (oldArg.length !== newArg.length)
                return false;
            for (var i = 0; i < newArg.length; ++i) {
                if (!this.equals(oldArg[i], newArg[i]))
                    return false;
            }
        }
        else if (typeof oldArg === 'object' && typeof newArg === 'object') {
            if (Object.keys(oldArg).length !== Object.keys(newArg).length)
                return false;
            for (var key in oldArg) {
                if (key !== 'parent' && key !== 'root' && (!(key in newArg) || !this.equals(oldArg[key], newArg[key])))
                    return false;
            }
        }
        else if (oldArg !== newArg) {
            return false;
        }
        return true;
    };
    return ThunkView;
}());
exports.ThunkView = ThunkView;
function isThunk(vnode) {
    return 'thunk' in vnode;
}
exports.isThunk = isThunk;
