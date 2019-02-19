"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
function setAttr(vnode, name, value) {
    getAttrs(vnode)[name] = value;
}
exports.setAttr = setAttr;
function setClass(vnode, name, value) {
    getClass(vnode)[name] = value;
}
exports.setClass = setClass;
function copyClassesFromVNode(source, target) {
    var classList = getClass(source);
    for (var c in classList) {
        if (classList.hasOwnProperty(c))
            setClass(target, c, true);
    }
}
exports.copyClassesFromVNode = copyClassesFromVNode;
function copyClassesFromElement(element, target) {
    var classList = element.classList;
    for (var i = 0; i < classList.length; i++) {
        var item = classList.item(i);
        if (item)
            setClass(target, item, true);
    }
}
exports.copyClassesFromElement = copyClassesFromElement;
function mergeStyle(vnode, style) {
    getData(vnode).style = __assign({}, (getData(vnode).style || {}), style);
}
exports.mergeStyle = mergeStyle;
function on(vnode, event, listener, element) {
    var val = getOn(vnode);
    if (val[event]) {
        throw new Error('EventListener for ' + event + ' already registered on VNode');
    }
    val[event] = [listener, element];
}
exports.on = on;
function getAttrs(vnode) {
    var data = getData(vnode);
    if (!data.attrs)
        data.attrs = {};
    return data.attrs;
}
exports.getAttrs = getAttrs;
function getData(vnode) {
    if (!vnode.data)
        vnode.data = {};
    return vnode.data;
}
function getClass(vnode) {
    var data = getData(vnode);
    if (!data["class"])
        data["class"] = {};
    return data["class"];
}
function getOn(vnode) {
    var data = getData(vnode);
    if (!data.on)
        data.on = {};
    return data.on;
}
