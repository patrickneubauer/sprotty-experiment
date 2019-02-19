"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
/**
 * Returns whether the mouse or keyboard event includes the CMD key
 * on Mac or CTRL key on Linux / others.
 */
function isCtrlOrCmd(event) {
    if (isMac())
        return event.metaKey;
    else
        return event.ctrlKey;
}
exports.isCtrlOrCmd = isCtrlOrCmd;
function isMac() {
    return window.navigator.userAgent.indexOf("Mac") !== -1;
}
exports.isMac = isMac;
function isCrossSite(url) {
    if (url && typeof window !== 'undefined' && window.location) {
        var baseURL = '';
        if (window.location.protocol)
            baseURL += window.location.protocol + '//';
        if (window.location.host)
            baseURL += window.location.host;
        return baseURL.length > 0 && !url.startsWith(baseURL);
    }
    return false;
}
exports.isCrossSite = isCrossSite;
