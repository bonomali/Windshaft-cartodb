/*
 Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin
 Leaflet is a BSD-licensed JavaScript library for map display and interaction.
 See http://leaflet.cloudmade.com for more information.
*/
(function (a) { var b = { VERSION: '0.3', ROOT_URL: (function () { for (var a = document.getElementsByTagName('script'), b = /^(.*\/)leaflet-?([\w-]*)\.js.*$/, e = 0, f = a.length; e < f; e++) { var g = a[e].src; if (g = g && g.match(b)) { if (g[2] == 'include') break; return g[1]; } } return '../../dist/'; }()), noConflict: function () { a.L = this._originalL; return this; }, _originalL: a.L }; window.L = b; })(this); L.Util = {
    extend: function (a) { for (var b = Array.prototype.slice.call(arguments, 1), c = 0, d = b.length, e; c < d; c++) { e = b[c] || {}; for (var f in e)e.hasOwnProperty(f) && (a[f] = e[f]); } return a; },
    bind: function (a, b) { return function () { return a.apply(b, arguments); }; },
    stamp: (function () { var a = 0; return function (b) { b._leaflet_id = b._leaflet_id || ++a; return b._leaflet_id; }; }()),
    requestAnimFrame: (function () {
        function a (a) { window.setTimeout(a, 1E3 / 60); } var b = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame || window.msRequestAnimationFrame || a; return function (c, d, e) { c = d ? L.Util.bind(c, d) : d; e && b === a ? c() : b(c); };
    }()),
    limitExecByInterval: function (a, b, c) { function d () { e = !1; f && (g.callee.apply(c, g), f = !1); } var e, f, g; return function () { g = arguments; e ? f = !0 : (e = !0, setTimeout(d, b), a.apply(c, g)); }; },
    falseFn: function () { return !1; },
    formatNum: function (a, b) { var c = Math.pow(10, b || 5); return Math.round(a * c) / c; },
    setOptions: function (a, b) { a.options = L.Util.extend({}, a.options, b); },
    getParamString: function (a) {
        var b =
[]; var c; for (c in a)a.hasOwnProperty(c) && b.push(c + '=' + a[c]); return '?' + b.join('&');
    }
}; L.Class = function () {};
L.Class.extend = function (a) {
    var b = function () { this.initialize && this.initialize.apply(this, arguments); }; var c = function () {}; c.prototype = this.prototype; c = new c(); c.constructor = b; b.prototype = c; b.superclass = this.prototype; for (var d in this) this.hasOwnProperty(d) && d != 'prototype' && d != 'superclass' && (b[d] = this[d]); a.statics && (L.Util.extend(b, a.statics), delete a.statics); a.includes && (L.Util.extend.apply(null, [c].concat(a.includes)), delete a.includes); if (a.options && c.options)a.options = L.Util.extend({}, c.options, a.options);
    L.Util.extend(c, a); b.extend = arguments.callee; b.include = function (a) { L.Util.extend(this.prototype, a); }; return b;
}; L.Mixin = {};
L.Mixin.Events = {
    addEventListener: function (a, b, c) { var d = this._leaflet_events = this._leaflet_events || {}; d[a] = d[a] || []; d[a].push({ action: b, context: c }); return this; },
    hasEventListeners: function (a) { return '_leaflet_events' in this && a in this._leaflet_events && this._leaflet_events[a].length > 0; },
    removeEventListener: function (a, b, c) { if (!this.hasEventListeners(a)) return this; for (var d = 0, e = this._leaflet_events, f = e[a].length; d < f; d++) if (e[a][d].action === b && (!c || e[a][d].context === c)) { e[a].splice(d, 1); break; } return this; },
    fireEvent: function (a,
        b) { if (this.hasEventListeners(a)) { for (var c = L.Util.extend({ type: a, target: this }, b), d = this._leaflet_events[a].slice(), e = 0, f = d.length; e < f; e++)d[e].action.call(d[e].context || this, c); return this; } }
}; L.Mixin.Events.on = L.Mixin.Events.addEventListener; L.Mixin.Events.off = L.Mixin.Events.removeEventListener; L.Mixin.Events.fire = L.Mixin.Events.fireEvent; (function () { var a = navigator.userAgent.toLowerCase(); var b = !!window.ActiveXObject; var c = a.indexOf('webkit') != -1; var d = typeof orientation !== 'undefined' ? !0 : !1; var e = a.indexOf('android') != -1; var f = window.opera; L.Browser = { ie: b, ie6: b && !window.XMLHttpRequest, webkit: c, webkit3d: c && 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(), gecko: a.indexOf('gecko') != -1, opera: f, android: e, mobileWebkit: d && c, mobileOpera: d && f, mobile: d, touch: 'ontouchstart' in document.documentElement }; })(); L.Point = function (a, b, c) { this.x = c ? Math.round(a) : a; this.y = c ? Math.round(b) : b; };
L.Point.prototype = {
    add: function (a) { return this.clone()._add(a); },
    _add: function (a) { this.x += a.x; this.y += a.y; return this; },
    subtract: function (a) { return this.clone()._subtract(a); },
    _subtract: function (a) { this.x -= a.x; this.y -= a.y; return this; },
    divideBy: function (a, b) { return new L.Point(this.x / a, this.y / a, b); },
    multiplyBy: function (a) { return new L.Point(this.x * a, this.y * a); },
    distanceTo: function (a) { var b = a.x - this.x; var a = a.y - this.y; return Math.sqrt(b * b + a * a); },
    round: function () { return this.clone()._round(); },
    _round: function () {
        this.x =
Math.round(this.x); this.y = Math.round(this.y); return this;
    },
    clone: function () { return new L.Point(this.x, this.y); },
    toString: function () { return 'Point(' + L.Util.formatNum(this.x) + ', ' + L.Util.formatNum(this.y) + ')'; }
}; L.Bounds = L.Class.extend({
    initialize: function (a, b) { if (a) for (var c = a instanceof Array ? a : [a, b], d = 0, e = c.length; d < e; d++) this.extend(c[d]); },
    extend: function (a) { !this.min && !this.max ? (this.min = new L.Point(a.x, a.y), this.max = new L.Point(a.x, a.y)) : (this.min.x = Math.min(a.x, this.min.x), this.max.x = Math.max(a.x, this.max.x), this.min.y = Math.min(a.y, this.min.y), this.max.y = Math.max(a.y, this.max.y)); },
    getCenter: function (a) { return new L.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, a); },
    contains: function (a) {
        var b;
        a instanceof L.Bounds ? (b = a.min, a = a.max) : b = a; return b.x >= this.min.x && a.x <= this.max.x && b.y >= this.min.y && a.y <= this.max.y;
    }
}); L.Transformation = L.Class.extend({ initialize: function (a, b, c, d) { this._a = a; this._b = b; this._c = c; this._d = d; }, transform: function (a, b) { return this._transform(a.clone(), b); }, _transform: function (a, b) { b = b || 1; a.x = b * (this._a * a.x + this._b); a.y = b * (this._c * a.y + this._d); return a; }, untransform: function (a, b) { b = b || 1; return new L.Point((a.x / b - this._b) / this._a, (a.y / b - this._d) / this._c); } }); L.LineUtil = {
    simplify: function (a, b) { if (!b || !a.length) return a.slice(); a = this.reducePoints(a, b); return a = this.simplifyDP(a, b); },
    pointToSegmentDistance: function (a, b, c) { return Math.sqrt(this._sqPointToSegmentDist(a, b, c)); },
    closestPointOnSegment: function (a, b, c) { a = this._sqClosestPointOnSegment(a, b, c); a.distance = Math.sqrt(a._sqDist); return a; },
    simplifyDP: function (a, b) {
        for (var c = 0, d = 0, e = b * b, f = 1, g = a.length, h; f < g - 1; f++)h = this._sqPointToSegmentDist(a[f], a[0], a[g - 1]), h > c && (d = f, c = h); return c >= e ? (c = a.slice(0, d), d =
a.slice(d), g = this.simplifyDP(c, b).slice(0, g - 2), d = this.simplifyDP(d, b), g.concat(d)) : [a[0], a[g - 1]];
    },
    reducePoints: function (a, b) { for (var c = [a[0]], d = b * b, e = 1, f = 0, g = a.length; e < g; e++) this._sqDist(a[e], a[f]) < d || (c.push(a[e]), f = e); f < g - 1 && c.push(a[g - 1]); return c; },
    clipSegment: function (a, b, c, d) {
        var d = d ? this._lastCode : this._getBitCode(a, c); var e = this._getBitCode(b, c); for (this._lastCode = e; ;) {
            if (d | e) if (d & e) return !1; else { var f = d || e; var g = this._getEdgeIntersection(a, b, f, c); var h = this._getBitCode(g, c); f == d ? (a = g, d = h) : (b = g, e = h); } else {
                return [a,
                    b];
            }
        }
    },
    _getEdgeIntersection: function (a, b, c, d) { var e = b.x - a.x; var b = b.y - a.y; var f = d.min; var d = d.max; if (c & 8) return new L.Point(a.x + e * (d.y - a.y) / b, d.y); else if (c & 4) return new L.Point(a.x + e * (f.y - a.y) / b, f.y); else if (c & 2) return new L.Point(d.x, a.y + b * (d.x - a.x) / e); else if (c & 1) return new L.Point(f.x, a.y + b * (f.x - a.x) / e); },
    _getBitCode: function (a, b) { var c = 0; a.x < b.min.x ? c |= 1 : a.x > b.max.x && (c |= 2); a.y < b.min.y ? c |= 4 : a.y > b.max.y && (c |= 8); return c; },
    _sqDist: function (a, b) { var c = b.x - a.x; var d = b.y - a.y; return c * c + d * d; },
    _sqClosestPointOnSegment: function (a,
        b, c) { var d = c.x - b.x; var e = c.y - b.y; var f = b; if (d || e) { var g = ((a.x - b.x) * d + (a.y - b.y) * e) / this._sqDist(b, c); g > 1 ? f = c : g > 0 && (f = new L.Point(b.x + d * g, b.y + e * g)); }f._sqDist = this._sqDist(a, f); return f; },
    _sqPointToSegmentDist: function (a, b, c) { return this._sqClosestPointOnSegment(a, b, c)._sqDist; }
}; L.PolyUtil = {}; L.PolyUtil.clipPolygon = function (a, b) { var c; var d = [1, 4, 2, 8]; var e; var f; var g; var h; var j; var k; var l = L.LineUtil; e = 0; for (j = a.length; e < j; e++)a[e]._code = l._getBitCode(a[e], b); for (g = 0; g < 4; g++) { k = d[g]; c = []; e = 0; j = a.length; for (f = j - 1; e < j; f = e++) if (h = a[e], f = a[f], h._code & k) { if (!(f._code & k))f = l._getEdgeIntersection(f, h, k, b), f._code = l._getBitCode(f, b), c.push(f); } else { if (f._code & k)f = l._getEdgeIntersection(f, h, k, b), f._code = l._getBitCode(f, b), c.push(f); c.push(h); }a = c; } return a; }; L.DomEvent = {
    addListener: function (a, b, c, d) {
        function e (b) { return c.call(d || a, b || L.DomEvent._getEvent()); } var f = L.Util.stamp(c); if (L.Browser.touch && b == 'dblclick' && this.addDoubleTapListener) this.addDoubleTapListener(a, e, f); else if ('addEventListener' in a) {
            if (b == 'mousewheel')a.addEventListener('DOMMouseScroll', e, !1), a.addEventListener(b, e, !1); else if (b == 'mouseenter' || b == 'mouseleave') {
                var g = e; var e = function (b) { if (L.DomEvent._checkMouse(a, b)) return g(b); }; a.addEventListener(b == 'mouseenter' ? 'mouseover' : 'mouseout',
                    e, !1);
            } else a.addEventListener(b, e, !1);
        } else 'attachEvent' in a && a.attachEvent('on' + b, e); a['_leaflet_' + b + f] = e;
    },
    removeListener: function (a, b, c) {
        var c = L.Util.stamp(c); var d = '_leaflet_' + b + c; handler = a[d]; L.Browser.touch && b == 'dblclick' && this.removeDoubleTapListener ? this.removeDoubleTapListener(a, c) : 'removeEventListener' in a ? b == 'mousewheel' ? (a.removeEventListener('DOMMouseScroll', handler, !1), a.removeEventListener(b, handler, !1)) : b == 'mouseenter' || b == 'mouseleave' ? a.removeEventListener(b == 'mouseenter' ? 'mouseover' : 'mouseout',
            handler, !1) : a.removeEventListener(b, handler, !1) : 'detachEvent' in a && a.detachEvent('on' + b, handler); a[d] = null;
    },
    _checkMouse: function (a, b) { var c = b.relatedTarget; if (!c) return !0; try { for (;c && c != a;)c = c.parentNode; } catch (d) { return !1; } return c != a; },
    _getEvent: function () { var a = window.event; if (!a) for (var b = arguments.callee.caller; b;) { if ((a = b.arguments[0]) && Event == a.constructor) break; b = b.caller; } return a; },
    stopPropagation: function (a) { a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0; },
    disableClickPropagation: function (a) {
        L.DomEvent.addListener(a,
            'mousedown', L.DomEvent.stopPropagation); L.DomEvent.addListener(a, 'click', L.DomEvent.stopPropagation); L.DomEvent.addListener(a, 'dblclick', L.DomEvent.stopPropagation);
    },
    preventDefault: function (a) { a.preventDefault ? a.preventDefault() : a.returnValue = !1; },
    stop: function (a) { L.DomEvent.preventDefault(a); L.DomEvent.stopPropagation(a); },
    getMousePosition: function (a, b) {
        var c = new L.Point(a.pageX ? a.pageX : a.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, a.pageY ? a.pageY : a.clientY + document.body.scrollTop +
document.documentElement.scrollTop); return b ? c.subtract(L.DomUtil.getViewportOffset(b)) : c;
    },
    getWheelDelta: function (a) { var b = 0; a.wheelDelta && (b = a.wheelDelta / 120); a.detail && (b = -a.detail / 3); return b; }
}; L.Util.extend(L.DomEvent, {
    addDoubleTapListener: function (a, b, c) { function d (a) { if (a.touches.length == 1) { var b = Date.now(); var c = b - (f || b); j = a.touches[0]; g = c > 0 && c <= h; f = b; } } function e () { if (g)j.type = 'dblclick', b(j), f = null; } var f; var g = !1; var h = 250; var j; a['_leaflet_touchstart' + c] = d; a['_leaflet_touchend' + c] = e; a.addEventListener('touchstart', d, !1); a.addEventListener('touchend', e, !1); },
    removeDoubleTapListener: function (a, b) {
        a.removeEventListener(a, a['_leaflet_touchstart' + b], !1); a.removeEventListener(a, a['_leaflet_touchend' + b],
            !1);
    }
}); L.DomUtil = {
    get: function (a) { return typeof a === 'string' ? document.getElementById(a) : a; },
    getStyle: function (a, b) { var c = a.style[b]; !c && a.currentStyle && (c = a.currentStyle[b]); if (!c || c == 'auto')c = (c = document.defaultView.getComputedStyle(a, null)) ? c[b] : null; return c == 'auto' ? null : c; },
    getViewportOffset: function (a) {
        var b = 0; var c = 0; var d = a; var e = document.body; do if (b += d.offsetTop || 0, c += d.offsetLeft || 0, d.offsetParent == e && L.DomUtil.getStyle(d, 'position') == 'absolute') break; while (d = d.offsetParent);d = a; do {
            if (d === e) break; b -= d.scrollTop ||
0; c -= d.scrollLeft || 0;
        } while (d = d.parentNode);return new L.Point(c, b);
    },
    create: function (a, b, c) { a = document.createElement(a); a.className = b; c && c.appendChild(a); return a; },
    disableTextSelection: function () { document.selection && document.selection.empty && document.selection.empty(); if (!this._onselectstart) this._onselectstart = document.onselectstart, document.onselectstart = L.Util.falseFn; },
    enableTextSelection: function () { document.onselectstart = this._onselectstart; this._onselectstart = null; },
    hasClass: function (a, b) {
        return a.className.length >
0 && RegExp('(^|\\s)' + b + '(\\s|$)').test(a.className);
    },
    addClass: function (a, b) { L.DomUtil.hasClass(a, b) || (a.className += (a.className ? ' ' : '') + b); },
    removeClass: function (a, b) { a.className = a.className.replace(/(\S+)\s*/g, function (a, d) { if (d == b) return ''; return a; }).replace(/^\s+/, ''); },
    setOpacity: function (a, b) { L.Browser.ie ? a.style.filter = 'alpha(opacity=' + Math.round(b * 100) + ')' : a.style.opacity = b; },
    testProp: function (a) { for (var b = document.documentElement.style, c = 0; c < a.length; c++) if (a[c] in b) return a[c]; return !1; },
    getTranslateString: function (a) {
        return L.DomUtil.TRANSLATE_OPEN +
a.x + 'px,' + a.y + 'px' + L.DomUtil.TRANSLATE_CLOSE;
    },
    getScaleString: function (a, b) { return L.DomUtil.getTranslateString(b) + ' scale(' + a + ') ' + L.DomUtil.getTranslateString(b.multiplyBy(-1)); },
    setPosition: function (a, b) { a._leaflet_pos = b; L.Browser.webkit ? a.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(b) : (a.style.left = b.x + 'px', a.style.top = b.y + 'px'); },
    getPosition: function (a) { return a._leaflet_pos; }
};
L.Util.extend(L.DomUtil, { TRANSITION: L.DomUtil.testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition']), TRANSFORM: L.DomUtil.testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']), TRANSLATE_OPEN: 'translate' + (L.Browser.webkit3d ? '3d(' : '('), TRANSLATE_CLOSE: L.Browser.webkit3d ? ',0)' : ')' }); L.Draggable = L.Class.extend({
    includes: L.Mixin.Events,
    statics: { START: L.Browser.touch ? 'touchstart' : 'mousedown', END: L.Browser.touch ? 'touchend' : 'mouseup', MOVE: L.Browser.touch ? 'touchmove' : 'mousemove', TAP_TOLERANCE: 15 },
    initialize: function (a, b) { this._element = a; this._dragStartTarget = b || a; },
    enable: function () { if (!this._enabled)L.DomEvent.addListener(this._dragStartTarget, L.Draggable.START, this._onDown, this), this._enabled = !0; },
    disable: function () {
        if (this._enabled) {
            L.DomEvent.removeListener(this._dragStartTarget,
                L.Draggable.START, this._onDown), this._enabled = !1;
        }
    },
    _onDown: function (a) {
        if (!(a.shiftKey || a.which != 1 && a.button != 1 && !a.touches) && !(a.touches && a.touches.length > 1)) {
            var b = a.touches && a.touches.length == 1 ? a.touches[0] : a; L.DomEvent.preventDefault(a); L.Browser.touch && (b.target.className += ' leaflet-active'); this._moved = !1; L.DomUtil.disableTextSelection(); this._setMovingCursor(); this._startPos = this._newPos = L.DomUtil.getPosition(this._element); this._startPoint = new L.Point(b.clientX, b.clientY); L.DomEvent.addListener(document,
                L.Draggable.MOVE, this._onMove, this); L.DomEvent.addListener(document, L.Draggable.END, this._onUp, this);
        }
    },
    _onMove: function (a) { if (!(a.touches && a.touches.length > 1)) { L.DomEvent.preventDefault(a); a = a.touches && a.touches.length == 1 ? a.touches[0] : a; if (!this._moved) this.fire('dragstart'), this._moved = !0; this._newPos = this._startPos.add(new L.Point(a.clientX, a.clientY)).subtract(this._startPoint); L.Util.requestAnimFrame(this._updatePosition, this, !0); } },
    _updatePosition: function () {
        L.DomUtil.setPosition(this._element,
            this._newPos); this.fire('drag');
    },
    _onUp: function (a) { if (a.changedTouches) { var a = a.changedTouches[0]; var b = a.target; var c = this._newPos && this._newPos.distanceTo(this._startPos) || 0; b.className = b.className.replace(' leaflet-active', ''); c < L.Draggable.TAP_TOLERANCE && this._simulateEvent('click', a); }L.DomUtil.enableTextSelection(); this._restoreCursor(); L.DomEvent.removeListener(document, L.Draggable.MOVE, this._onMove); L.DomEvent.removeListener(document, L.Draggable.END, this._onUp); this._moved && this.fire('dragend'); },
    _removeActiveClass: function () {},
    _setMovingCursor: function () { this._bodyCursor = document.body.style.cursor; document.body.style.cursor = 'move'; },
    _restoreCursor: function () { document.body.style.cursor = this._bodyCursor; },
    _simulateEvent: function (a, b) { var c = document.createEvent('MouseEvent'); c.initMouseEvent(a, !0, !0, window, 1, b.screenX, b.screenY, b.clientX, b.clientY, !1, !1, !1, !1, 0, null); b.target.dispatchEvent(c); }
}); L.Transition = L.Class.extend({ includes: L.Mixin.Events, statics: { CUSTOM_PROPS_SETTERS: { position: L.DomUtil.setPosition }, implemented: function () { return L.Transition.NATIVE || L.Transition.TIMER; } }, options: { easing: 'ease', duration: 0.5 }, _setProperty: function (a, b) { var c = L.Transition.CUSTOM_PROPS_SETTERS; if (a in c)c[a](this._el, b); else this._el.style[a] = b; } }); L.Transition = L.Transition.extend({
    statics: (function () { var a = L.DomUtil.TRANSITION; return { NATIVE: !!a, TRANSITION: a, PROPERTY: a + 'Property', DURATION: a + 'Duration', EASING: a + 'TimingFunction', END: a == 'webkitTransition' || a == 'OTransition' ? a + 'End' : 'transitionend', CUSTOM_PROPS_PROPERTIES: { position: L.Browser.webkit ? L.DomUtil.TRANSFORM : 'top, left' } }; }()),
    options: { fakeStepInterval: 100 },
    initialize: function (a, b) {
        this._el = a; L.Util.setOptions(this, b); L.DomEvent.addListener(a, L.Transition.END, this._onTransitionEnd, this); this._onFakeStep =
L.Util.bind(this._onFakeStep, this);
    },
    run: function (a) {
        var b; var c = []; var d = L.Transition.CUSTOM_PROPS_PROPERTIES; for (b in a)a.hasOwnProperty(b) && (b = d[b] ? d[b] : b, b = b.replace(/([A-Z])/g, function (a) { return '-' + a.toLowerCase(); }), c.push(b)); this._onTransitionEnd(); this._el.style[L.Transition.DURATION] = this.options.duration + 's'; this._el.style[L.Transition.EASING] = this.options.easing; this._el.style[L.Transition.PROPERTY] = c.join(', '); for (b in a)a.hasOwnProperty(b) && this._setProperty(b, a[b]); this._inProgress = !0; this.fire('start');
        L.Transition.NATIVE ? this._timer = setInterval(this._onFakeStep, this.options.fakeStepInterval) : this._onTransitionEnd();
    },
    _onFakeStep: function () { this.fire('step'); },
    _onTransitionEnd: function () { if (this._inProgress) this._inProgress = !1, clearInterval(this._timer), this._el.style[L.Transition.PROPERTY] = 'none', this.fire('step'), this.fire('end'); }
}); L.Transition = L.Transition.NATIVE ? L.Transition : L.Transition.extend({
    statics: { getTime: Date.now || function () { return +new Date(); }, TIMER: !0, EASINGS: { ease: [0.25, 0.1, 0.25, 1], linear: [0, 0, 1, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1] }, CUSTOM_PROPS_GETTERS: { position: L.DomUtil.getPosition }, UNIT_RE: /^[\d\.]+(\D*)$/ },
    options: { fps: 50 },
    initialize: function (a, b) {
        this._el = a; L.Util.extend(this.options, b); var c = L.Transition.EASINGS[this.options.easing] || L.Transition.EASINGS.ease; this._p1 =
new L.Point(0, 0); this._p2 = new L.Point(c[0], c[1]); this._p3 = new L.Point(c[2], c[3]); this._p4 = new L.Point(1, 1); this._step = L.Util.bind(this._step, this); this._interval = Math.round(1E3 / this.options.fps);
    },
    run: function (a) {
        this._props = {}; var b = L.Transition.CUSTOM_PROPS_GETTERS; var c = L.Transition.UNIT_RE; this.fire('start'); for (var d in a) if (a.hasOwnProperty(d)) { var e = {}; if (d in b)e.from = b[d](this._el); else { var f = this._el.style[d].match(c); e.from = parseFloat(f[0]); e.unit = f[1]; }e.to = a[d]; this._props[d] = e; }clearInterval(this._timer);
        this._timer = setInterval(this._step, this._interval); this._startTime = L.Transition.getTime();
    },
    _step: function () { var a = L.Transition.getTime() - this._startTime; var b = this.options.duration * 1E3; a < b ? this._runFrame(this._cubicBezier(a / b)) : (this._runFrame(1), this._complete()); },
    _runFrame: function (a) {
        var b = L.Transition.CUSTOM_PROPS_SETTERS; var c; var d; for (c in this._props) {
            this._props.hasOwnProperty(c) && (d = this._props[c], c in b ? (d = d.to.subtract(d.from).multiplyBy(a).add(d.from), b[c](this._el, d)) : this._el.style[c] = (d.to - d.from) *
a + d.from + d.unit);
        } this.fire('step');
    },
    _complete: function () { clearInterval(this._timer); this.fire('end'); },
    _cubicBezier: function (a) { var b = 3 * Math.pow(1 - a, 2) * a; var c = 3 * (1 - a) * Math.pow(a, 2); var d = Math.pow(a, 3); var a = this._p1.multiplyBy(Math.pow(1 - a, 3)); var b = this._p2.multiplyBy(b); var c = this._p3.multiplyBy(c); var d = this._p4.multiplyBy(d); return a.add(b).add(c).add(d).y; }
}); L.LatLng = function (a, b, c) { var d = parseFloat(a); var e = parseFloat(b); if (isNaN(d) || isNaN(e)) throw Error('Invalid LatLng object: (' + a + ', ' + b + ')'); c !== !0 && (d = Math.max(Math.min(d, 90), -90), e = (e + 180) % 360 + (e < -180 ? 180 : -180)); this.lat = d; this.lng = e; }; L.Util.extend(L.LatLng, { DEG_TO_RAD: Math.PI / 180, RAD_TO_DEG: 180 / Math.PI, MAX_MARGIN: 1.0E-9 });
L.LatLng.prototype = { equals: function (a) { if (!(a instanceof L.LatLng)) return !1; return Math.max(Math.abs(this.lat - a.lat), Math.abs(this.lng - a.lng)) <= L.LatLng.MAX_MARGIN; }, toString: function () { return 'LatLng(' + L.Util.formatNum(this.lat) + ', ' + L.Util.formatNum(this.lng) + ')'; } }; L.LatLngBounds = L.Class.extend({
    initialize: function (a, b) { if (a) for (var c = a instanceof Array ? a : [a, b], d = 0, e = c.length; d < e; d++) this.extend(c[d]); },
    extend: function (a) { !this._southWest && !this._northEast ? (this._southWest = new L.LatLng(a.lat, a.lng), this._northEast = new L.LatLng(a.lat, a.lng)) : (this._southWest.lat = Math.min(a.lat, this._southWest.lat), this._southWest.lng = Math.min(a.lng, this._southWest.lng), this._northEast.lat = Math.max(a.lat, this._northEast.lat), this._northEast.lng = Math.max(a.lng, this._northEast.lng)); },
    getCenter: function () { return new L.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2); },
    getSouthWest: function () { return this._southWest; },
    getNorthEast: function () { return this._northEast; },
    getNorthWest: function () { return new L.LatLng(this._northEast.lat, this._southWest.lng); },
    getSouthEast: function () { return new L.LatLng(this._southWest.lat, this._northEast.lng); },
    contains: function (a) {
        var b = this._southWest; var c = this._northEast; var d; a instanceof L.LatLngBounds ? (d = a.getSouthWest(),
        a = a.getNorthEast()) : d = a; return d.lat >= b.lat && a.lat <= c.lat && d.lng >= b.lng && a.lng <= c.lng;
    }
}); L.Projection = {}; L.Projection.SphericalMercator = { MAX_LATITUDE: 85.0511287798, project: function (a) { var b = L.LatLng.DEG_TO_RAD; var c = this.MAX_LATITUDE; var d = a.lng * b; var a = Math.max(Math.min(c, a.lat), -c) * b; var a = Math.log(Math.tan(Math.PI / 4 + a / 2)); return new L.Point(d, a); }, unproject: function (a, b) { var c = L.LatLng.RAD_TO_DEG; return new L.LatLng((2 * Math.atan(Math.exp(a.y)) - Math.PI / 2) * c, a.x * c, b); } }; L.Projection.LonLat = { project: function (a) { return new L.Point(a.lng, a.lat); }, unproject: function (a, b) { return new L.LatLng(a.y, a.x, b); } }; L.Projection.Mercator = {
    MAX_LATITUDE: 85.0840591556,
    R_MINOR: 6356752.3142,
    R_MAJOR: 6378137,
    project: function (a) { var b = L.LatLng.DEG_TO_RAD; var c = this.MAX_LATITUDE; var d = this.R_MAJOR; var e = a.lng * b * d; var a = Math.max(Math.min(c, a.lat), -c) * b; var b = this.R_MINOR / d; var b = Math.sqrt(1 - b * b); var c = b * Math.sin(a); var c = Math.pow((1 - c) / (1 + c), b * 0.5); var a = -d * Math.log(Math.tan(0.5 * (Math.PI * 0.5 - a)) / c); return new L.Point(e, a); },
    unproject: function (a, b) {
        for (var c = L.LatLng.RAD_TO_DEG, d = this.R_MAJOR, e = a.x * c / d, f = this.R_MINOR / d, f = Math.sqrt(1 - f * f), d = Math.exp(-a.y / d),
            g = Math.PI / 2 - 2 * Math.atan(d), h = 15, j = 0.1; Math.abs(j) > 1.0E-7 && --h > 0;)j = f * Math.sin(g), j = Math.PI / 2 - 2 * Math.atan(d * Math.pow((1 - j) / (1 + j), 0.5 * f)) - g, g += j; return new L.LatLng(g * c, e, b);
    }
}; L.CRS = { latLngToPoint: function (a, b) { return this.transformation._transform(this.projection.project(a), b); }, pointToLatLng: function (a, b, c) { return this.projection.unproject(this.transformation.untransform(a, b), c); }, project: function (a) { return this.projection.project(a); } }; L.CRS.EPSG3857 = L.Util.extend({}, L.CRS, { code: 'EPSG:3857', projection: L.Projection.SphericalMercator, transformation: new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5), project: function (a) { return this.projection.project(a).multiplyBy(6378137); } }); L.CRS.EPSG900913 = L.Util.extend({}, L.CRS.EPSG3857, { code: 'EPSG:900913' }); L.CRS.EPSG4326 = L.Util.extend({}, L.CRS, { code: 'EPSG:4326', projection: L.Projection.LonLat, transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5) }); L.CRS.EPSG3395 = L.Util.extend({}, L.CRS, { code: 'EPSG:3395', projection: L.Projection.Mercator, transformation: (function () { var a = L.Projection.Mercator; return new L.Transformation(0.5 / (Math.PI * a.R_MAJOR), 0.5, -0.5 / (Math.PI * a.R_MINOR), 0.5); }()) }); L.LayerGroup = L.Class.extend({
    initialize: function (a) { this._layers = {}; if (a) for (var b = 0, c = a.length; b < c; b++) this.addLayer(a[b]); },
    addLayer: function (a) { this._layers[L.Util.stamp(a)] = a; this._map && this._map.addLayer(a); return this; },
    removeLayer: function (a) { delete this._layers[L.Util.stamp(a)]; this._map && this._map.removeLayer(a); return this; },
    clearLayers: function () { this._iterateLayers(this.removeLayer, this); return this; },
    onAdd: function (a) { this._map = a; this._iterateLayers(a.addLayer, a); },
    onRemove: function (a) {
        this._iterateLayers(a.removeLayer,
            a); delete this._map;
    },
    _iterateLayers: function (a, b) { for (var c in this._layers) this._layers.hasOwnProperty(c) && a.call(b, this._layers[c]); }
}); L.FeatureGroup = L.LayerGroup.extend({
    includes: L.Mixin.Events,
    addLayer: function (a) { this._initEvents(a); L.LayerGroup.prototype.addLayer.call(this, a); this._popupContent && a.bindPopup && a.bindPopup(this._popupContent); },
    bindPopup: function (a) { this._popupContent = a; for (var b in this._layers) this._layers.hasOwnProperty(b) && this._layers[b].bindPopup && this._layers[b].bindPopup(a); },
    _events: ['click', 'dblclick', 'mouseover', 'mouseout'],
    _initEvents: function (a) {
        for (var b = 0, c = this._events.length; b < c; b++) {
            a.on(this._events[b],
                this._propagateEvent, this);
        }
    },
    _propagateEvent: function (a) { a.layer = a.target; a.target = this; this.fire(a.type, a); }
}); L.TileLayer = L.Class.extend({
    includes: L.Mixin.Events,
    options: { minZoom: 0, maxZoom: 18, tileSize: 256, subdomains: 'abc', errorTileUrl: '', attribution: '', opacity: 1, scheme: 'xyz', continuousWorld: !1, noWrap: !1, unloadInvisibleTiles: L.Browser.mobile, updateWhenIdle: L.Browser.mobile },
    initialize: function (a, b) { L.Util.setOptions(this, b); this._url = a; if (typeof this.options.subdomains === 'string') this.options.subdomains = this.options.subdomains.split(''); },
    onAdd: function (a, b) {
        this._map = a; this._insertAtTheBottom = b; this._initContainer();
        this._createTileProto(); a.on('viewreset', function (a) { this._reset(a.hard); }, this); if (this.options.updateWhenIdle)a.on('moveend', this._update, this); else this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this), a.on('move', this._limitedUpdate, this); this._reset(); this._update();
    },
    onRemove: function () {
        this._map.getPanes().tilePane.removeChild(this._container); this._container = null; this._map.off('viewreset', this._reset, this); this.options.updateWhenIdle ? this._map.off('moveend', this._update, this)
            : this._map.off('move', this._limitedUpdate, this);
    },
    getAttribution: function () { return this.options.attribution; },
    setOpacity: function (a) { this.options.opacity = a; this._setOpacity(a); if (L.Browser.webkit) for (i in this._tiles) this._tiles[i].style.webkitTransform += ' translate(0,0)'; },
    _setOpacity: function (a) { a < 1 && L.DomUtil.setOpacity(this._container, a); },
    _initContainer: function () {
        var a = this._map.getPanes().tilePane; var b = a.firstChild; if (!this._container || a.empty) {
            this._container = L.DomUtil.create('div', 'leaflet-layer'),
            this._insertAtTheBottom && b ? a.insertBefore(this._container, b) : a.appendChild(this._container), this._setOpacity(this.options.opacity);
        }
    },
    _reset: function (a) { this._tiles = {}; if (a && this._container) this._container.innerHTML = ''; this._initContainer(); this._container.innerHTML = ''; },
    _update: function () {
        var a = this._map.getPixelBounds(); var b = this.options.tileSize; var c = new L.Point(Math.floor(a.min.x / b), Math.floor(a.min.y / b)); var a = new L.Point(Math.floor(a.max.x / b), Math.floor(a.max.y / b)); var c = new L.Bounds(c, a); this._addTilesFromCenterOut(c);
        this.options.unloadInvisibleTiles && this._removeOtherTiles(c);
    },
    _addTilesFromCenterOut: function (a) { for (var b = [], c = a.getCenter(), d = a.min.y; d <= a.max.y; d++) for (var e = a.min.x; e <= a.max.x; e++)e + ':' + d in this._tiles || b.push(new L.Point(e, d)); b.sort(function (a, b) { return a.distanceTo(c) - b.distanceTo(c); }); a = document.createDocumentFragment(); this._tilesToLoad = b.length; d = 0; for (e = this._tilesToLoad; d < e; d++) this._addTile(b[d], a); this._container.appendChild(a); },
    _removeOtherTiles: function (a) {
        var b, c, d; for (d in this._tiles) {
            if (this._tiles.hasOwnProperty(d) &&
(b = d.split(':'), c = parseInt(b[0], 10), b = parseInt(b[1], 10), c < a.min.x || c > a.max.x || b < a.min.y || b > a.max.y)) this._tiles[d].parentNode == this._container && this._container.removeChild(this._tiles[d]), delete this._tiles[d];
        }
    },
    _addTile: function (a, b) {
        var c = this._getTilePos(a); var d = this._map.getZoom(); var e = a.x + ':' + a.y; var f = 1 << d; if (!this.options.continuousWorld) { if (this.options.noWrap) { if (a.x < 0 || a.x >= f) { this._tilesToLoad--; return; } } else a.x = (a.x % f + f) % f; if (a.y < 0 || a.y >= f) { this._tilesToLoad--; return; } } var g = this._createTile(); L.DomUtil.setPosition(g,
            c); this._tiles[e] = g; if (this.options.scheme == 'tms')a.y = f - a.y - 1; this._loadTile(g, a, d); b.appendChild(g);
    },
    _getTilePos: function (a) { var b = this._map.getPixelOrigin(); return a.multiplyBy(this.options.tileSize).subtract(b); },
    getTileUrl: function (a, b) { return this._url.replace('{s}', this.options.subdomains[(a.x + a.y) % this.options.subdomains.length]).replace('{z}', b).replace('{x}', a.x).replace('{y}', a.y); },
    _createTileProto: function () {
        this._tileImg = L.DomUtil.create('img', 'leaflet-tile'); this._tileImg.galleryimg = 'no';
        var a = this.options.tileSize; this._tileImg.style.width = a + 'px'; this._tileImg.style.height = a + 'px';
    },
    _createTile: function () { var a = this._tileImg.cloneNode(!1); a.onselectstart = a.onmousemove = L.Util.falseFn; return a; },
    _loadTile: function (a, b, c) { a._layer = this; a.onload = this._tileOnLoad; a.onerror = this._tileOnError; a.src = this.getTileUrl(b, c); },
    _tileOnLoad: function () { var a = this._layer; this.className += ' leaflet-tile-loaded'; a.fire('tileload', { tile: this, url: this.src }); a._tilesToLoad--; a._tilesToLoad || a.fire('load'); },
    _tileOnError: function () { var a = this._layer; a.fire('tileerror', { tile: this, url: this.src }); if (a = a.options.errorTileUrl) this.src = a; }
}); L.TileLayer.WMS = L.TileLayer.extend({
    defaultWmsParams: { service: 'WMS', request: 'GetMap', version: '1.1.1', layers: '', styles: '', format: 'image/jpeg', transparent: !1 },
    initialize: function (a, b) { this._url = a; this.wmsParams = L.Util.extend({}, this.defaultWmsParams); this.wmsParams.width = this.wmsParams.height = this.options.tileSize; for (var c in b) this.options.hasOwnProperty(c) || (this.wmsParams[c] = b[c]); L.Util.setOptions(this, b); },
    onAdd: function (a) {
        this.wmsParams[parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs'] = a.options.crs.code;
        L.TileLayer.prototype.onAdd.call(this, a);
    },
    getTileUrl: function (a) { var b = this.options.tileSize; var a = a.multiplyBy(b); var b = a.add(new L.Point(b, b)); var a = this._map.unproject(a, this._zoom, !0); var b = this._map.unproject(b, this._zoom, !0); var a = this._map.options.crs.project(a); var b = this._map.options.crs.project(b); var b = [a.x, b.y, b.x, a.y].join(','); return this._url + L.Util.getParamString(this.wmsParams) + '&bbox=' + b; }
}); L.TileLayer.Canvas = L.TileLayer.extend({
    options: { async: !1 },
    initialize: function (a) { L.Util.setOptions(this, a); },
    _createTileProto: function () { this._canvasProto = L.DomUtil.create('canvas', 'leaflet-tile'); var a = this.options.tileSize; this._canvasProto.width = a; this._canvasProto.height = a; },
    _createTile: function () { var a = this._canvasProto.cloneNode(!1); a.onselectstart = a.onmousemove = L.Util.falseFn; return a; },
    _loadTile: function (a, b, c) { a._layer = this; this.drawTile(a, b, c); this.options.async || this.tileDrawn(a); },
    drawTile: function () {},
    tileDrawn: function (a) { this._tileOnLoad.call(a); }
}); L.ImageOverlay = L.Class.extend({
    includes: L.Mixin.Events,
    initialize: function (a, b) { this._url = a; this._bounds = b; },
    onAdd: function (a) { this._map = a; this._image || this._initImage(); a.getPanes().overlayPane.appendChild(this._image); a.on('viewreset', this._reset, this); this._reset(); },
    onRemove: function (a) { a.getPanes().overlayPane.removeChild(this._image); a.off('viewreset', this._reset, this); },
    _initImage: function () {
        this._image = L.DomUtil.create('img', 'leaflet-image-layer'); this._image.style.visibility = 'hidden'; L.Util.extend(this._image,
            { galleryimg: 'no', onselectstart: L.Util.falseFn, onmousemove: L.Util.falseFn, onload: this._onImageLoad, src: this._url });
    },
    _reset: function () { var a = this._map.latLngToLayerPoint(this._bounds.getNorthWest()); var b = this._map.latLngToLayerPoint(this._bounds.getSouthEast()).subtract(a); L.DomUtil.setPosition(this._image, a); this._image.style.width = b.x + 'px'; this._image.style.height = b.y + 'px'; },
    _onImageLoad: function () { this.style.visibility = ''; }
}); L.Popup = L.Class.extend({
    includes: L.Mixin.Events,
    options: { minWidth: 50, maxWidth: 300, autoPan: !0, closeButton: !0, offset: new L.Point(0, 2), autoPanPadding: new L.Point(5, 5) },
    initialize: function (a) { L.Util.setOptions(this, a); },
    onAdd: function (a) {
        this._map = a; this._container || this._initLayout(); this._updateContent(); this._container.style.opacity = '0'; this._map._panes.popupPane.appendChild(this._container); this._map.on('viewreset', this._updatePosition, this); if (this._map.options.closePopupOnClick) {
            this._map.on('preclick',
                this._close, this);
        } this._update(); this._container.style.opacity = '1'; this._opened = !0;
    },
    onRemove: function (a) { a._panes.popupPane.removeChild(this._container); a.off('viewreset', this._updatePosition, this); a.off('click', this._close, this); this._container.style.opacity = '0'; this._opened = !1; },
    setLatLng: function (a) { this._latlng = a; this._opened && this._update(); return this; },
    setContent: function (a) { this._content = a; this._opened && this._update(); return this; },
    _close: function () { this._opened && this._map.removeLayer(this); },
    _initLayout: function () {
        this._container = L.DomUtil.create('div', 'leaflet-popup'); if (this.options.closeButton) this._closeButton = L.DomUtil.create('a', 'leaflet-popup-close-button', this._container), this._closeButton.href = '#close', L.DomEvent.addListener(this._closeButton, 'click', this._onCloseButtonClick, this); this._wrapper = L.DomUtil.create('div', 'leaflet-popup-content-wrapper', this._container); L.DomEvent.disableClickPropagation(this._wrapper); this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content',
            this._wrapper); this._tipContainer = L.DomUtil.create('div', 'leaflet-popup-tip-container', this._container); this._tip = L.DomUtil.create('div', 'leaflet-popup-tip', this._tipContainer);
    },
    _update: function () { this._container.style.visibility = 'hidden'; this._updateContent(); this._updateLayout(); this._updatePosition(); this._container.style.visibility = ''; this._adjustPan(); },
    _updateContent: function () {
        if (this._content) {
            typeof this._content === 'string' ? this._contentNode.innerHTML = this._content : (this._contentNode.innerHTML =
'', this._contentNode.appendChild(this._content));
        }
    },
    _updateLayout: function () { this._container.style.width = ''; this._container.style.whiteSpace = 'nowrap'; var a = this._container.offsetWidth; this._container.style.width = (a > this.options.maxWidth ? this.options.maxWidth : a < this.options.minWidth ? this.options.minWidth : a) + 'px'; this._container.style.whiteSpace = ''; this._containerWidth = this._container.offsetWidth; },
    _updatePosition: function () {
        var a = this._map.latLngToLayerPoint(this._latlng); this._containerBottom = -a.y - this.options.offset.y;
        this._containerLeft = a.x - Math.round(this._containerWidth / 2) + this.options.offset.x; this._container.style.bottom = this._containerBottom + 'px'; this._container.style.left = this._containerLeft + 'px';
    },
    _adjustPan: function () {
        if (this.options.autoPan) {
            var a = this._container.offsetHeight; var b = this._map.layerPointToContainerPoint(new L.Point(this._containerLeft, -a - this._containerBottom)); var c = new L.Point(0, 0); var d = this.options.autoPanPadding; var e = this._map.getSize(); if (b.x < 0)c.x = b.x - d.x; if (b.x + this._containerWidth > e.x) {
                c.x = b.x +
this._containerWidth - e.x + d.x;
            } if (b.y < 0)c.y = b.y - d.y; if (b.y + a > e.y)c.y = b.y + a - e.y + d.y; (c.x || c.y) && this._map.panBy(c);
        }
    },
    _onCloseButtonClick: function (a) { this._close(); L.DomEvent.stop(a); }
}); L.Icon = L.Class.extend({
    iconUrl: L.ROOT_URL + 'images/marker.png',
    shadowUrl: L.ROOT_URL + 'images/marker-shadow.png',
    iconSize: new L.Point(25, 41),
    shadowSize: new L.Point(41, 41),
    iconAnchor: new L.Point(13, 41),
    popupAnchor: new L.Point(0, -33),
    initialize: function (a) { if (a) this.iconUrl = a; },
    createIcon: function () { return this._createIcon('icon'); },
    createShadow: function () { return this._createIcon('shadow'); },
    _createIcon: function (a) {
        var b = this[a + 'Size']; var c = this[a + 'Url']; var d = this._createImg(c); if (!c) return null; d.className = 'leaflet-marker-' +
a; d.style.marginLeft = -this.iconAnchor.x + 'px'; d.style.marginTop = -this.iconAnchor.y + 'px'; if (b)d.style.width = b.x + 'px', d.style.height = b.y + 'px'; return d;
    },
    _createImg: function (a) { var b; L.Browser.ie6 ? (b = document.createElement('div'), b.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + a + '")') : (b = document.createElement('img'), b.src = a); return b; }
}); L.Marker = L.Class.extend({
    includes: L.Mixin.Events,
    options: { icon: new L.Icon(), title: '', clickable: !0, draggable: !1 },
    initialize: function (a, b) { L.Util.setOptions(this, b); this._latlng = a; },
    onAdd: function (a) { this._map = a; this._initIcon(); a.on('viewreset', this._reset, this); this._reset(); },
    onRemove: function (a) { this._removeIcon(); this.closePopup && this.closePopup(); a.off('viewreset', this._reset, this); },
    getLatLng: function () { return this._latlng; },
    setLatLng: function (a) { this._latlng = a; this._icon && this._reset(); },
    setIcon: function (a) {
        this._removeIcon();
        this._icon = this._shadow = null; this.options.icon = a; this._initIcon(); this._reset();
    },
    _initIcon: function () { if (!this._icon) { this._icon = this.options.icon.createIcon(); if (this.options.title) this._icon.title = this.options.title; this._initInteraction(); } if (!this._shadow) this._shadow = this.options.icon.createShadow(); this._map._panes.markerPane.appendChild(this._icon); this._shadow && this._map._panes.shadowPane.appendChild(this._shadow); },
    _removeIcon: function () {
        this._map._panes.markerPane.removeChild(this._icon);
        this._shadow && this._map._panes.shadowPane.removeChild(this._shadow);
    },
    _reset: function () { var a = this._map.latLngToLayerPoint(this._latlng).round(); L.DomUtil.setPosition(this._icon, a); this._shadow && L.DomUtil.setPosition(this._shadow, a); this._icon.style.zIndex = a.y; },
    _initInteraction: function () {
        if (this.options.clickable) {
            this._icon.className += ' leaflet-clickable'; L.DomEvent.addListener(this._icon, 'click', this._onMouseClick, this); for (var a = ['dblclick', 'mousedown', 'mouseover', 'mouseout'], b = 0; b < a.length; b++) {
                L.DomEvent.addListener(this._icon,
                    a[b], this._fireMouseEvent, this);
            }
        } if (L.Handler.MarkerDrag) this.dragging = new L.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable();
    },
    _onMouseClick: function (a) { L.DomEvent.stopPropagation(a); (!this.dragging || !this.dragging.moved()) && this.fire(a.type); },
    _fireMouseEvent: function (a) { this.fire(a.type); L.DomEvent.stopPropagation(a); }
}); L.Marker.include({ openPopup: function () { this._popup.setLatLng(this._latlng); this._map.openPopup(this._popup); return this; }, closePopup: function () { this._popup && this._popup._close(); }, bindPopup: function (a, b) { b = L.Util.extend({ offset: this.options.icon.popupAnchor }, b); this._popup = new L.Popup(b); this._popup.setContent(a); this.on('click', this.openPopup, this); return this; } }); L.Path = L.Class.extend({
    includes: [L.Mixin.Events],
    statics: { CLIP_PADDING: 0.5 },
    options: { stroke: !0, color: '#0033ff', weight: 5, opacity: 0.5, fill: !1, fillColor: null, fillOpacity: 0.2, clickable: !0, updateOnMoveEnd: !0 },
    initialize: function (a) { L.Util.setOptions(this, a); },
    onAdd: function (a) {
        this._map = a; this._initElements(); this._initEvents(); this.projectLatlngs(); this._updatePath(); a.on('viewreset', this.projectLatlngs, this); this._updateTrigger = this.options.updateOnMoveEnd ? 'moveend' : 'viewreset'; a.on(this._updateTrigger,
            this._updatePath, this);
    },
    onRemove: function (a) { a._pathRoot.removeChild(this._container); a.off('viewreset', this._projectLatlngs, this); a.off(this._updateTrigger, this._updatePath, this); },
    projectLatlngs: function () {},
    setStyle: function (a) { L.Util.setOptions(this, a); this._container && this._updateStyle(); return this; },
    _initElements: function () { this._initRoot(); this._initPath(); this._initStyle(); },
    _updateViewport: function () {
        var a = L.Path.CLIP_PADDING; var b = this._map.getSize(); var c = L.DomUtil.getPosition(this._map._mapPane).multiplyBy(-1).subtract(b.multiplyBy(a));
        var a = c.add(b.multiplyBy(1 + a * 2)); this._map._pathViewport = new L.Bounds(c, a);
    },
    _redraw: function () { this.projectLatlngs(); this._updatePath(); }
}); L.Path.include({ bindPopup: function (a, b) { if (!this._popup || this._popup.options !== b) this._popup = new L.Popup(b); this._popup.setContent(a); if (!this._openPopupAdded) this.on('click', this._openPopup, this), this._openPopupAdded = !0; return this; }, _openPopup: function (a) { this._popup.setLatLng(a.latlng); this._map.openPopup(this._popup); } }); L.Path.SVG_NS = 'http://www.w3.org/2000/svg'; L.Browser.svg = !(!document.createElementNS || !document.createElementNS(L.Path.SVG_NS, 'svg').createSVGRect);
L.Path = L.Path.extend({
    statics: { SVG: L.Browser.svg },
    getPathString: function () {},
    _initElements: function () { this._initRoot(); this._initPath(); this._initStyle(); },
    _initRoot: function () { if (!this._map._pathRoot) this._map._pathRoot = this._createElement('svg'), this._map._panes.overlayPane.appendChild(this._map._pathRoot), this._map.on('moveend', this._updateSvgViewport, this), this._updateSvgViewport(); },
    _updateSvgViewport: function () {
        this._updateViewport(); var a = this._map._pathViewport; var b = a.min; var c = a.max; var a = c.x - b.x; var c = c.y -
b.y; var d = this._map._pathRoot; var e = this._map._panes.overlayPane; L.Browser.mobileWebkit && e.removeChild(d); L.DomUtil.setPosition(d, b); d.setAttribute('width', a); d.setAttribute('height', c); d.setAttribute('viewBox', [b.x, b.y, a, c].join(' ')); L.Browser.mobileWebkit && e.appendChild(d);
    },
    _initPath: function () { this._container = this._createElement('g'); this._path = this._createElement('path'); this._container.appendChild(this._path); this._map._pathRoot.appendChild(this._container); },
    _initStyle: function () {
        this.options.stroke &&
(this._path.setAttribute('stroke-linejoin', 'round'), this._path.setAttribute('stroke-linecap', 'round')); this.options.fill ? this._path.setAttribute('fill-rule', 'evenodd') : this._path.setAttribute('fill', 'none'); this._updateStyle();
    },
    _updateStyle: function () {
        this.options.stroke && (this._path.setAttribute('stroke', this.options.color), this._path.setAttribute('stroke-opacity', this.options.opacity), this._path.setAttribute('stroke-width', this.options.weight)); this.options.fill && (this._path.setAttribute('fill',
            this.options.fillColor || this.options.color), this._path.setAttribute('fill-opacity', this.options.fillOpacity));
    },
    _updatePath: function () { var a = this.getPathString(); a || (a = 'M0 0'); this._path.setAttribute('d', a); },
    _createElement: function (a) { return document.createElementNS(L.Path.SVG_NS, a); },
    _initEvents: function () {
        if (this.options.clickable) {
            L.Browser.vml || this._path.setAttribute('class', 'leaflet-clickable'); L.DomEvent.addListener(this._container, 'click', this._onMouseClick, this); for (var a = ['dblclick', 'mousedown',
                    'mouseover', 'mouseout'], b = 0; b < a.length; b++)L.DomEvent.addListener(this._container, a[b], this._fireMouseEvent, this);
        }
    },
    _onMouseClick: function (a) { (!this._map.dragging || !this._map.dragging.moved()) && this._fireMouseEvent(a); },
    _fireMouseEvent: function (a) { this.hasEventListeners(a.type) && (this.fire(a.type, { latlng: this._map.mouseEventToLatLng(a), layerPoint: this._map.mouseEventToLayerPoint(a) }), L.DomEvent.stopPropagation(a)); }
}); L.Browser.vml = (function () { var a = document.createElement('div'); a.innerHTML = '<v:shape adj="1"/>'; a = a.firstChild; a.style.behavior = 'url(#default#VML)'; return a && typeof a.adj === 'object'; }());
L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
    statics: { VML: !0, CLIP_PADDING: 0.02 },
    _createElement: (function () { try { return document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml'), function (a) { return document.createElement('<lvml:' + a + ' class="lvml">'); }; } catch (a) { return function (a) { return document.createElement('<' + a + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">'); }; } }()),
    _initRoot: function () {
        if (!this._map._pathRoot) {
            this._map._pathRoot = document.createElement('div'), this._map._pathRoot.className =
'leaflet-vml-container', this._map._panes.overlayPane.appendChild(this._map._pathRoot), this._map.on('moveend', this._updateViewport, this), this._updateViewport();
        }
    },
    _initPath: function () { this._container = this._createElement('shape'); this._container.className += ' leaflet-vml-shape' + (this.options.clickable ? ' leaflet-clickable' : ''); this._container.coordsize = '1 1'; this._path = this._createElement('path'); this._container.appendChild(this._path); this._map._pathRoot.appendChild(this._container); },
    _initStyle: function () {
        this.options.stroke
            ? (this._stroke = this._createElement('stroke'), this._stroke.endcap = 'round', this._container.appendChild(this._stroke)) : this._container.stroked = !1; this.options.fill ? (this._container.filled = !0, this._fill = this._createElement('fill'), this._container.appendChild(this._fill)) : this._container.filled = !1; this._updateStyle();
    },
    _updateStyle: function () {
        if (this.options.stroke) this._stroke.weight = this.options.weight + 'px', this._stroke.color = this.options.color, this._stroke.opacity = this.options.opacity; if (this.options.fill) {
            this._fill.color =
this.options.fillColor || this.options.color, this._fill.opacity = this.options.fillOpacity;
        }
    },
    _updatePath: function () { this._container.style.display = 'none'; this._path.v = this.getPathString() + ' '; this._container.style.display = ''; }
}); L.Browser.canvas = (function () { return !!document.createElement('canvas').getContext; }());
L.Path = L.Path.SVG && !window.L_PREFER_CANVAS || !L.Browser.canvas ? L.Path : L.Path.extend({
    statics: { CANVAS: !0, SVG: !1 },
    options: { updateOnMoveEnd: !0 },
    _initElements: function () { this._initRoot(); },
    _initRoot: function () {
        var a = this._map._pathRoot; var b = this._map._canvasCtx; if (!a) {
            a = this._map._pathRoot = document.createElement('canvas'), a.style.position = 'absolute', b = this._map._canvasCtx = a.getContext('2d'), b.lineCap = 'round', b.lineJoin = 'round', this._map._panes.overlayPane.appendChild(a), this._map.on('moveend', this._updateCanvasViewport,
                this), this._updateCanvasViewport();
        } this._ctx = b;
    },
    _updateStyle: function () { if (this.options.stroke) this._ctx.lineWidth = this.options.weight, this._ctx.strokeStyle = this.options.color; if (this.options.fill) this._ctx.fillStyle = this.options.fillColor || this.options.color; },
    _drawPath: function () { var a, b, c, d, e, f; this._ctx.beginPath(); a = 0; for (c = this._parts.length; a < c; a++) { b = 0; for (d = this._parts[a].length; b < d; b++)e = this._parts[a][b], f = (b === 0 ? 'move' : 'line') + 'To', this._ctx[f](e.x, e.y); this instanceof L.Polygon && this._ctx.closePath(); } },
    _checkIfEmpty: function () { return !this._parts.length; },
    _updatePath: function () { if (!this._checkIfEmpty()) { this._drawPath(); this._ctx.save(); this._updateStyle(); var a = this.options.opacity; var b = this.options.fillOpacity; if (this.options.fill) { if (b < 1) this._ctx.globalAlpha = b; this._ctx.fill(); } if (this.options.stroke) { if (a < 1) this._ctx.globalAlpha = a; this._ctx.stroke(); } this._ctx.restore(); } },
    _updateCanvasViewport: function () {
        this._updateViewport(); var a = this._map._pathViewport; var b = a.min; var a = a.max.subtract(b); var c = this._map._pathRoot;
        L.DomUtil.setPosition(c, b); c.width = a.x; c.height = a.y; c.getContext('2d').translate(-b.x, -b.y);
    },
    _initEvents: function () { if (this.options.clickable) this._map.on('click', this._onClick, this); },
    _onClick: function (a) { this._containsPoint(a.layerPoint) && this.fire('click', a); },
    onRemove: function (a) { a.off('viewreset', this._projectLatlngs, this); a.off(this._updateTrigger, this._updatePath, this); a.fire(this._updateTrigger); }
}); L.Polyline = L.Path.extend({
    initialize: function (a, b) { L.Path.prototype.initialize.call(this, b); this._latlngs = a; },
    options: { smoothFactor: 1, noClip: !1, updateOnMoveEnd: !0 },
    projectLatlngs: function () { this._originalPoints = []; for (var a = 0, b = this._latlngs.length; a < b; a++) this._originalPoints[a] = this._map.latLngToLayerPoint(this._latlngs[a]); },
    getPathString: function () { for (var a = 0, b = this._parts.length, c = ''; a < b; a++)c += this._getPathPartStr(this._parts[a]); return c; },
    getLatLngs: function () { return this._latlngs; },
    setLatLngs: function (a) {
        this._latlngs =
a; this._redraw(); return this;
    },
    addLatLng: function (a) { this._latlngs.push(a); this._redraw(); return this; },
    spliceLatLngs: function () { var a = [].splice.apply(this._latlngs, arguments); this._redraw(); return a; },
    closestLayerPoint: function (a) { for (var b = Infinity, c = this._parts, d, e, f = null, g = 0, h = c.length; g < h; g++) for (var j = c[g], k = 1, l = j.length; k < l; k++) if (d = j[k - 1], e = j[k], d = L.LineUtil._sqClosestPointOnSegment(a, d, e), d._sqDist < b)b = d._sqDist, f = d; if (f)f.distance = Math.sqrt(b); return f; },
    _getPathPartStr: function (a) {
        for (var b =
L.Path.VML, c = 0, d = a.length, e = '', f; c < d; c++)f = a[c], b && f._round(), e += (c ? 'L' : 'M') + f.x + ' ' + f.y; return e;
    },
    _clipPoints: function () { var a = this._originalPoints; var b = a.length; var c; var d; var e; if (this.options.noClip) this._parts = [a]; else { var f = this._parts = []; var g = this._map._pathViewport; var h = L.LineUtil; for (d = c = 0; c < b - 1; c++) if (e = h.clipSegment(a[c], a[c + 1], g, c)) if (f[d] = f[d] || [], f[d].push(e[0]), e[1] != a[c + 1] || c == b - 2)f[d].push(e[1]), d++; } },
    _simplifyPoints: function () {
        for (var a = this._parts, b = L.LineUtil, c = 0, d = a.length; c < d; c++) {
            a[c] = b.simplify(a[c],
                this.options.smoothFactor);
        }
    },
    _updatePath: function () { this._clipPoints(); this._simplifyPoints(); L.Path.prototype._updatePath.call(this); }
}); L.Polyline.include(!L.Path.CANVAS ? {} : { _containsPoint: function (a, b) { var c; var d; var e; var f; var g; var h; var j = this.options.weight / 2; L.Browser.touch && (j += 10); c = 0; for (f = this._parts.length; c < f; c++) { h = this._parts[c]; d = 0; g = h.length; for (e = g - 1; d < g; e = d++) if (b || d !== 0) if (e = L.LineUtil.pointToSegmentDistance(a, h[e], h[d]), e <= j) return !0; } return !1; } }); L.Polygon = L.Polyline.extend({
    options: { fill: !0 },
    initialize: function (a, b) { L.Polyline.prototype.initialize.call(this, a, b); if (a[0] instanceof Array) this._latlngs = a[0], this._holes = a.slice(1); },
    projectLatlngs: function () { L.Polyline.prototype.projectLatlngs.call(this); this._holePoints = []; if (this._holes) for (var a = 0, b = this._holes.length; a < b; a++) { this._holePoints[a] = []; for (var c = 0, d = this._holes[a].length; c < d; c++) this._holePoints[a][c] = this._map.latLngToLayerPoint(this._holes[a][c]); } },
    _clipPoints: function () {
        var a =
[]; this._parts = [this._originalPoints].concat(this._holePoints); if (!this.options.noClip) { for (var b = 0, c = this._parts.length; b < c; b++) { var d = L.PolyUtil.clipPolygon(this._parts[b], this._map._pathViewport); d.length && a.push(d); } this._parts = a; }
    },
    _getPathPartStr: function (a) { return L.Polyline.prototype._getPathPartStr.call(this, a) + (L.Browser.svg ? 'z' : 'x'); }
}); L.Polygon.include(!L.Path.CANVAS ? {} : { _containsPoint: function (a) { var b = !1; var c; var d; var e; var f; var g; var h; var j; if (L.Polyline.prototype._containsPoint.call(this, a, !0)) return !0; f = 0; for (h = this._parts.length; f < h; f++) { c = this._parts[f]; g = 0; j = c.length; for (e = j - 1; g < j; e = g++)d = c[g], e = c[e], d.y > a.y != e.y > a.y && a.x < (e.x - d.x) * (a.y - d.y) / (e.y - d.y) + d.x && (b = !b); } return b; } }); (function () { function a (a) { return L.FeatureGroup.extend({ initialize: function (a, b) { this._layers = {}; this._options = b; this.setLatLngs(a); }, setStyle: function (a) { for (var b in this._layers) this._layers.hasOwnProperty(b) && this._layers[b].setStyle && this._layers[b].setStyle(a); }, setLatLngs: function (c) { var d = 0; var e = c.length; for (this._iterateLayers(function (a) { d < e ? a.setLatLngs(c[d++]) : this.removeLayer(a); }, this); d < e;) this.addLayer(new a(c[d++], this._options)); } }); }L.MultiPolyline = a(L.Polyline); L.MultiPolygon = a(L.Polygon); })(); L.Circle = L.Path.extend({
    initialize: function (a, b, c) { L.Path.prototype.initialize.call(this, c); this._latlng = a; this._mRadius = b; },
    options: { fill: !0 },
    setLatLng: function (a) { this._latlng = a; this._redraw(); return this; },
    setRadius: function (a) { this._mRadius = a; this._redraw(); return this; },
    projectLatlngs: function () { var a = this._map.options.scale(this._map._zoom); this._point = this._map.latLngToLayerPoint(this._latlng); this._radius = this._mRadius / 40075017 * a; },
    getPathString: function () {
        var a = this._point; var b = this._radius; if (this._checkIfEmpty()) return '';
        return L.Browser.svg ? 'M' + a.x + ',' + (a.y - b) + 'A' + b + ',' + b + ',0,1,1,' + (a.x - 0.1) + ',' + (a.y - b) + ' z' : (a._round(), b = Math.round(b), 'AL ' + a.x + ',' + a.y + ' ' + b + ',' + b + ' 0,23592600');
    },
    _checkIfEmpty: function () { var a = this._map._pathViewport; var b = this._radius; var c = this._point; return c.x - b > a.max.x || c.y - b > a.max.y || c.x + b < a.min.x || c.y + b < a.min.y; }
}); L.Circle.include(!L.Path.CANVAS ? {} : { _drawPath: function () { var a = this._point; this._ctx.beginPath(); this._ctx.arc(a.x, a.y, this._radius, 0, Math.PI * 2); }, _containsPoint: function (a) { var b = this.options.stroke ? this.options.weight / 2 : 0; return a.distanceTo(this._point) <= this._radius + b; } }); L.CircleMarker = L.Circle.extend({ options: { radius: 10, weight: 2 }, initialize: function (a, b) { L.Circle.prototype.initialize.call(this, a, null, b); this._radius = this.options.radius; }, projectLatlngs: function () { this._point = this._map.latLngToLayerPoint(this._latlng); }, setRadius: function (a) { this._radius = a; this._redraw(); return this; } }); L.GeoJSON = L.LayerGroup.extend({ includes: L.Mixin.Events, initialize: function (a, b) { L.Util.setOptions(this, b); this._geojson = a; this._layers = {}; a && this.addGeoJSON(a); }, addGeoJSON: function (a) { if (a.features) for (var b = 0, c = a.features.length; b < c; b++) this.addGeoJSON(a.features[b]); else b = a.type == 'Feature' ? a.geometry : a, c = L.GeoJSON.geometryToLayer(b, this.options.pointToLayer), this.fire('featureparse', { layer: c, properties: a.properties, geometryType: b.type, bbox: a.bbox, id: a.id }), this.addLayer(c); } });
L.Util.extend(L.GeoJSON, {
    geometryToLayer: function (a, b) {
        var c = a.coordinates; var d; var e; var f; var g = []; switch (a.type) {
        case 'Point':return d = this.coordsToLatLng(c), b ? b(d) : new L.Marker(d); case 'MultiPoint':e = 0; for (f = c.length; e < f; e++)d = this.coordsToLatLng(c[e]), d = b ? b(d) : new L.Marker(d), g.push(d); return new L.FeatureGroup(g); case 'LineString':return c = this.coordsToLatLngs(c), new L.Polyline(c); case 'Polygon':return c = this.coordsToLatLngs(c, 1), new L.Polygon(c); case 'MultiLineString':return c = this.coordsToLatLngs(c, 1), new L.MultiPolyline(c);
        case 'MultiPolygon':return c = this.coordsToLatLngs(c, 2), new L.MultiPolygon(c); case 'GeometryCollection':e = 0; for (f = a.geometries.length; e < f; e++)d = this.geometryToLayer(a.geometries[e]), g.push(d); return new L.FeatureGroup(g); default:throw Error('Invalid GeoJSON object.');
        }
    },
    coordsToLatLng: function (a, b) { var c = parseFloat(a[b ? 0 : 1]); var d = parseFloat(a[b ? 1 : 0]); return new L.LatLng(c, d); },
    coordsToLatLngs: function (a, b, c) {
        var d; var e = []; var f; var g = a.length; for (f = 0; f < g; f++) {
            d = b ? this.coordsToLatLngs(a[f], b - 1, c) : this.coordsToLatLng(a[f],
                c), e.push(d);
        } return e;
    }
}); L.Handler = L.Class.extend({ initialize: function (a) { this._map = a; }, enabled: function () { return !!this._enabled; } }); L.Handler.MapDrag = L.Handler.extend({
    enable: function () { if (!this._enabled) { if (!this._draggable) this._draggable = new L.Draggable(this._map._mapPane, this._map._container), this._draggable.on('dragstart', this._onDragStart, this), this._draggable.on('drag', this._onDrag, this), this._draggable.on('dragend', this._onDragEnd, this); this._draggable.enable(); this._enabled = !0; } },
    disable: function () { if (this._enabled) this._draggable.disable(), this._enabled = !1; },
    moved: function () { return this._draggable && this._draggable._moved; },
    _onDragStart: function () { this._map.fire('movestart'); this._map.fire('dragstart'); },
    _onDrag: function () { this._map.fire('move'); this._map.fire('drag'); },
    _onDragEnd: function () { this._map.fire('moveend'); this._map.fire('dragend'); }
}); L.Handler.TouchZoom = L.Handler.extend({
    enable: function () { if (L.Browser.touch && !this._enabled)L.DomEvent.addListener(this._map._container, 'touchstart', this._onTouchStart, this), this._enabled = !0; },
    disable: function () { if (this._enabled)L.DomEvent.removeListener(this._map._container, 'touchstart', this._onTouchStart, this), this._enabled = !1; },
    _onTouchStart: function (a) {
        if (a.touches && !(a.touches.length != 2 || this._map._animatingZoom)) {
            var b = this._map.mouseEventToLayerPoint(a.touches[0]); var c = this._map.mouseEventToLayerPoint(a.touches[1]);
            var d = this._map.containerPointToLayerPoint(this._map.getSize().divideBy(2)); this._startCenter = b.add(c).divideBy(2, !0); this._startDist = b.distanceTo(c); this._moved = !1; this._zooming = !0; this._centerOffset = d.subtract(this._startCenter); L.DomEvent.addListener(document, 'touchmove', this._onTouchMove, this); L.DomEvent.addListener(document, 'touchend', this._onTouchEnd, this); L.DomEvent.preventDefault(a);
        }
    },
    _onTouchMove: function (a) {
        if (a.touches && a.touches.length == 2) {
            if (!this._moved) {
                this._map._mapPane.className += ' leaflet-zoom-anim',
                this._map._prepareTileBg(), this._moved = !0;
            } var b = this._map.mouseEventToLayerPoint(a.touches[0]); var c = this._map.mouseEventToLayerPoint(a.touches[1]); this._scale = b.distanceTo(c) / this._startDist; this._delta = b.add(c).divideBy(2, !0).subtract(this._startCenter); this._map._tileBg.style.webkitTransform = [L.DomUtil.getTranslateString(this._delta), L.DomUtil.getScaleString(this._scale, this._startCenter)].join(' '); L.DomEvent.preventDefault(a);
        }
    },
    _onTouchEnd: function () {
        if (this._moved && this._zooming) {
            this._zooming =
!1; var a = this._map.getZoom(); var b = Math.log(this._scale) / Math.LN2; var b = this._map._limitZoom(a + (b > 0 ? Math.ceil(b) : Math.floor(b))); var a = b - a; var c = this._centerOffset.subtract(this._delta).divideBy(this._scale); var d = this._map.unproject(this._map.getPixelOrigin().add(this._startCenter).add(c)); L.DomEvent.removeListener(document, 'touchmove', this._onTouchMove); L.DomEvent.removeListener(document, 'touchend', this._onTouchEnd); this._map._runAnimation(d, b, Math.pow(2, a) / this._scale, this._startCenter.add(c));
        }
    }
}); L.Handler.ScrollWheelZoom = L.Handler.extend({
    enable: function () { if (!this._enabled)L.DomEvent.addListener(this._map._container, 'mousewheel', this._onWheelScroll, this), this._delta = 0, this._enabled = !0; },
    disable: function () { if (this._enabled)L.DomEvent.removeListener(this._map._container, 'mousewheel', this._onWheelScroll), this._enabled = !1; },
    _onWheelScroll: function (a) {
        this._delta += L.DomEvent.getWheelDelta(a); this._lastMousePos = this._map.mouseEventToContainerPoint(a); clearTimeout(this._timer); this._timer = setTimeout(L.Util.bind(this._performZoom,
            this), 50); L.DomEvent.preventDefault(a);
    },
    _performZoom: function () { var a = Math.round(this._delta); var a = Math.max(Math.min(a, 4), -4); this._delta = 0; if (a) { var b = this._getCenterForScrollWheelZoom(this._lastMousePos, a); var a = this._map.getZoom() + a; this._map._limitZoom(a) != this._map._zoom && this._map.setView(b, a); } },
    _getCenterForScrollWheelZoom: function (a, b) {
        var c = this._map.getPixelBounds().getCenter(); var d = this._map.getSize().divideBy(2); var d = a.subtract(d).multiplyBy(1 - Math.pow(2, -b)); return this._map.unproject(c.add(d), this._map._zoom,
            !0);
    }
}); L.Handler.DoubleClickZoom = L.Handler.extend({ enable: function () { if (!this._enabled) this._map.on('dblclick', this._onDoubleClick, this._map), this._enabled = !0; }, disable: function () { if (this._enabled) this._map.off('dblclick', this._onDoubleClick, this._map), this._enabled = !1; }, _onDoubleClick: function (a) { this.setView(a.latlng, this._zoom + 1); } }); L.Handler.ShiftDragZoom = L.Handler.extend({
    initialize: function (a) { this._map = a; this._container = a._container; this._pane = a._panes.overlayPane; },
    enable: function () { if (!this._enabled)L.DomEvent.addListener(this._container, 'mousedown', this._onMouseDown, this), this._enabled = !0; },
    disable: function () { if (this._enabled)L.DomEvent.removeListener(this._container, 'mousedown', this._onMouseDown), this._enabled = !1; },
    _onMouseDown: function (a) {
        if (!a.shiftKey || a.which != 1 && a.button != 1) return !1; L.DomUtil.disableTextSelection();
        this._startLayerPoint = this._map.mouseEventToLayerPoint(a); this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane); L.DomUtil.setPosition(this._box, this._startLayerPoint); this._container.style.cursor = 'crosshair'; L.DomEvent.addListener(document, 'mousemove', this._onMouseMove, this); L.DomEvent.addListener(document, 'mouseup', this._onMouseUp, this); L.DomEvent.preventDefault(a);
    },
    _onMouseMove: function (a) {
        var b = this._map.mouseEventToLayerPoint(a); var a = b.x - this._startLayerPoint.x; var c = b.y - this._startLayerPoint.y;
        var b = new L.Point(Math.min(b.x, this._startLayerPoint.x), Math.min(b.y, this._startLayerPoint.y)); L.DomUtil.setPosition(this._box, b); this._box.style.width = Math.abs(a) - 4 + 'px'; this._box.style.height = Math.abs(c) - 4 + 'px';
    },
    _onMouseUp: function (a) {
        this._pane.removeChild(this._box); this._container.style.cursor = ''; L.DomUtil.enableTextSelection(); L.DomEvent.removeListener(document, 'mousemove', this._onMouseMove); L.DomEvent.removeListener(document, 'mouseup', this._onMouseUp); a = this._map.mouseEventToLayerPoint(a); this._map.fitBounds(new L.LatLngBounds(this._map.layerPointToLatLng(this._startLayerPoint),
            this._map.layerPointToLatLng(a)));
    }
}); L.Handler.MarkerDrag = L.Handler.extend({
    initialize: function (a) { this._marker = a; },
    enable: function () { if (!this._enabled) { if (!this._draggable) this._draggable = new L.Draggable(this._marker._icon, this._marker._icon), this._draggable.on('dragstart', this._onDragStart, this), this._draggable.on('drag', this._onDrag, this), this._draggable.on('dragend', this._onDragEnd, this); this._draggable.enable(); this._enabled = !0; } },
    disable: function () { if (this._enabled) this._draggable.disable(), this._enabled = !1; },
    moved: function () {
        return this._draggable &&
this._draggable._moved;
    },
    _onDragStart: function () { this._marker.closePopup(); this._marker.fire('movestart'); this._marker.fire('dragstart'); },
    _onDrag: function () { var a = L.DomUtil.getPosition(this._marker._icon); this._marker._shadow && L.DomUtil.setPosition(this._marker._shadow, a); this._marker._latlng = this._marker._map.layerPointToLatLng(a); this._marker.fire('move'); this._marker.fire('drag'); },
    _onDragEnd: function () { this._marker.fire('moveend'); this._marker.fire('dragend'); }
}); L.Control = {}; L.Control.Position = { TOP_LEFT: 'topLeft', TOP_RIGHT: 'topRight', BOTTOM_LEFT: 'bottomLeft', BOTTOM_RIGHT: 'bottomRight' }; L.Control.Zoom = L.Class.extend({
    onAdd: function (a) { this._map = a; this._container = L.DomUtil.create('div', 'leaflet-control-zoom'); this._zoomInButton = this._createButton('Zoom in', 'leaflet-control-zoom-in', this._map.zoomIn, this._map); this._zoomOutButton = this._createButton('Zoom out', 'leaflet-control-zoom-out', this._map.zoomOut, this._map); this._container.appendChild(this._zoomInButton); this._container.appendChild(this._zoomOutButton); },
    getContainer: function () { return this._container; },
    getPosition: function () { return L.Control.Position.TOP_LEFT; },
    _createButton: function (a, b, c, d) { var e = document.createElement('a'); e.href = '#'; e.title = a; e.className = b; L.DomEvent.disableClickPropagation(e); L.DomEvent.addListener(e, 'click', L.DomEvent.preventDefault); L.DomEvent.addListener(e, 'click', c, d); return e; }
}); L.Control.Attribution = L.Class.extend({
    onAdd: function (a) { this._container = L.DomUtil.create('div', 'leaflet-control-attribution'); this._map = a; this._prefix = 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a>'; this._attributions = {}; this._update(); },
    getPosition: function () { return L.Control.Position.BOTTOM_RIGHT; },
    getContainer: function () { return this._container; },
    setPrefix: function (a) { this._prefix = a; this._update(); },
    addAttribution: function (a) { a && (this._attributions[a] = !0, this._update()); },
    removeAttribution: function (a) {
        a &&
(delete this._attributions[a], this._update());
    },
    _update: function () { if (this._map) { var a = []; var b; for (b in this._attributions) this._attributions.hasOwnProperty(b) && a.push(b); b = []; this._prefix && b.push(this._prefix); a.length && b.push(a.join(', ')); this._container.innerHTML = b.join(' &mdash; '); } }
}); L.Control.Layers = L.Class.extend({
    options: { collapsed: !0 },
    initialize: function (a, b, c) { L.Util.setOptions(this, c); this._layers = {}; for (var d in a)a.hasOwnProperty(d) && this._addLayer(a[d], d); for (d in b)b.hasOwnProperty(d) && this._addLayer(b[d], d, !0); },
    onAdd: function (a) { this._map = a; this._initLayout(); this._update(); },
    getContainer: function () { return this._container; },
    getPosition: function () { return L.Control.Position.TOP_RIGHT; },
    addBaseLayer: function (a, b) { this._addLayer(a, b); this._update(); return this; },
    addOverlay: function (a,
        b) { this._addLayer(a, b, !0); this._update(); return this; },
    removeLayer: function (a) { delete this._layers[L.Util.stamp(a)]; this._update(); return this; },
    _initLayout: function () {
        this._container = L.DomUtil.create('div', 'leaflet-control-layers'); L.DomEvent.disableClickPropagation(this._container); this._form = L.DomUtil.create('form', 'leaflet-control-layers-list'); if (this.options.collapsed) {
            L.DomEvent.addListener(this._container, 'mouseover', this._expand, this); L.DomEvent.addListener(this._container, 'mouseout', this._collapse,
                this); var a = this._layersLink = L.DomUtil.create('a', 'leaflet-control-layers-toggle'); a.href = '#'; a.title = 'Layers'; L.DomEvent.addListener(a, 'focus', this._expand, this); L.DomEvent.addListener(this._map, L.Draggable.START, this._collapse, this); this._container.appendChild(a);
        } else this._expand(); this._baseLayersList = L.DomUtil.create('div', 'leaflet-control-layers-base', this._form); this._separator = L.DomUtil.create('div', 'leaflet-control-layers-separator', this._form); this._overlaysList = L.DomUtil.create('div', 'leaflet-control-layers-overlays',
            this._form); this._container.appendChild(this._form);
    },
    _addLayer: function (a, b, c) { this._layers[L.Util.stamp(a)] = { layer: a, name: b, overlay: c }; },
    _update: function () { if (this._container) { this._baseLayersList.innerHTML = ''; this._overlaysList.innerHTML = ''; var a = !1; var b = !1; var c; for (c in this._layers) if (this._layers.hasOwnProperty(c)) { var d = this._layers[c]; this._addItem(d); b = b || d.overlay; a = a || !d.overlay; } this._separator.style.display = b && a ? '' : 'none'; } },
    _addItem: function (a) {
        var b = document.createElement('label'); var c = document.createElement('input');
        if (!a.overlay)c.name = 'leaflet-base-layers'; c.type = a.overlay ? 'checkbox' : 'radio'; c.checked = this._map.hasLayer(a.layer); c.layerId = L.Util.stamp(a.layer); L.DomEvent.addListener(c, 'click', this._onInputClick, this); var d = document.createTextNode(' ' + a.name); b.appendChild(c); b.appendChild(d); (a.overlay ? this._overlaysList : this._baseLayersList).appendChild(b);
    },
    _onInputClick: function () {
        var a; var b; var c; var d = this._form.getElementsByTagName('input'); var e = d.length; for (a = 0; a < e; a++) {
            b = d[a], c = this._layers[b.layerId], b.checked ? this._map.addLayer(c.layer,
                !c.overlay) : this._map.removeLayer(c.layer);
        }
    },
    _expand: function () { L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded'); },
    _collapse: function () { this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', ''); }
}); L.Map = L.Class.extend({
    includes: L.Mixin.Events,
    options: { crs: L.CRS.EPSG3857 || L.CRS.EPSG4326, scale: function (a) { return 256 * (1 << a); }, center: null, zoom: null, layers: [], dragging: !0, touchZoom: L.Browser.touch && !L.Browser.android, scrollWheelZoom: !L.Browser.touch, doubleClickZoom: !0, shiftDragZoom: !0, zoomControl: !0, attributionControl: !0, fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android, zoomAnimation: L.DomUtil.TRANSITION && !L.Browser.android && !L.Browser.mobileOpera, trackResize: !0, closePopupOnClick: !0 },
    initialize: function (a,
        b) { L.Util.setOptions(this, b); this._container = L.DomUtil.get(a); this._initLayout(); L.DomEvent && (this._initEvents(), L.Handler && this._initInteraction(), L.Control && this._initControls()); var c = this.options.center; var d = this.options.zoom; c !== null && d !== null && this.setView(c, d, !0); c = this.options.layers; c = c instanceof Array ? c : [c]; this._tileLayersNum = 0; this._initLayers(c); },
    setView: function (a, b) { this._resetView(a, this._limitZoom(b)); return this; },
    setZoom: function (a) { return this.setView(this.getCenter(), a); },
    zoomIn: function () {
        return this.setZoom(this._zoom +
1);
    },
    zoomOut: function () { return this.setZoom(this._zoom - 1); },
    fitBounds: function (a) { var b = this.getBoundsZoom(a); return this.setView(a.getCenter(), b); },
    fitWorld: function () { var a = new L.LatLng(-60, -170); var b = new L.LatLng(85, 179); return this.fitBounds(new L.LatLngBounds(a, b)); },
    panTo: function (a) { return this.setView(a, this._zoom); },
    panBy: function (a) { this.fire('movestart'); this._rawPanBy(a); this.fire('move'); this.fire('moveend'); return this; },
    addLayer: function (a, b) {
        var c = L.Util.stamp(a); if (this._layers[c]) return this;
        this._layers[c] = a; if (a.options && !isNaN(a.options.maxZoom)) this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, a.options.maxZoom); if (a.options && !isNaN(a.options.minZoom)) this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, a.options.minZoom); this.options.zoomAnimation && L.TileLayer && a instanceof L.TileLayer && (this._tileLayersNum++, a.on('load', this._onTileLayerLoad, this)); this.attributionControl && a.getAttribution && this.attributionControl.addAttribution(a.getAttribution()); c = function () {
            a.onAdd(this,
                b); this.fire('layeradd', { layer: a });
        }; if (this._loaded)c.call(this); else this.on('load', c, this); return this;
    },
    removeLayer: function (a) { var b = L.Util.stamp(a); this._layers[b] && (a.onRemove(this), delete this._layers[b], this.options.zoomAnimation && L.TileLayer && a instanceof L.TileLayer && (this._tileLayersNum--, a.off('load', this._onTileLayerLoad, this)), this.attributionControl && a.getAttribution && this.attributionControl.removeAttribution(a.getAttribution()), this.fire('layerremove', { layer: a })); return this; },
    hasLayer: function (a) {
        return L.Util.stamp(a) in
this._layers;
    },
    invalidateSize: function () { var a = map.getSize(); this._sizeChanged = !0; this._rawPanBy(a.subtract(map.getSize()).divideBy(2)); this.fire('move'); clearTimeout(this._sizeTimer); this._sizeTimer = setTimeout(L.Util.bind(function () { this.fire('moveend'); }, this), 200); return this; },
    getCenter: function (a) { var b = this.getSize().divideBy(2); return this.unproject(this._getTopLeftPoint().add(b), this._zoom, a); },
    getZoom: function () { return this._zoom; },
    getBounds: function () {
        var a = this.getPixelBounds(); var b = this.unproject(new L.Point(a.min.x,
            a.max.y)); var a = this.unproject(new L.Point(a.max.x, a.min.y)); return new L.LatLngBounds(b, a);
    },
    getMinZoom: function () { return isNaN(this.options.minZoom) ? this._layersMinZoom || 0 : this.options.minZoom; },
    getMaxZoom: function () { return isNaN(this.options.maxZoom) ? this._layersMaxZoom || Infinity : this.options.maxZoom; },
    getBoundsZoom: function (a) {
        var b = this.getSize(); var c = this.getMinZoom(); var d = this.getMaxZoom(); var e = a.getNorthEast(); var a = a.getSouthWest(); var f; var g; do {
            c++, f = this.project(e, c), g = this.project(a, c), f = new L.Point(f.x - g.x, g.y -
f.y);
        } while (f.x <= b.x && f.y <= b.y && c <= d);return c - 1;
    },
    getSize: function () { if (!this._size || this._sizeChanged) this._size = new L.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1; return this._size; },
    getPixelBounds: function () { var a = this._getTopLeftPoint(); var b = this.getSize(); return new L.Bounds(a, a.add(b)); },
    getPixelOrigin: function () { return this._initialTopLeftPoint; },
    getPanes: function () { return this._panes; },
    mouseEventToContainerPoint: function (a) {
        return L.DomEvent.getMousePosition(a,
            this._container);
    },
    mouseEventToLayerPoint: function (a) { return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(a)); },
    mouseEventToLatLng: function (a) { return this.layerPointToLatLng(this.mouseEventToLayerPoint(a)); },
    containerPointToLayerPoint: function (a) { return a.subtract(L.DomUtil.getPosition(this._mapPane)); },
    layerPointToContainerPoint: function (a) { return a.add(L.DomUtil.getPosition(this._mapPane)); },
    layerPointToLatLng: function (a) { return this.unproject(a.add(this._initialTopLeftPoint)); },
    latLngToLayerPoint: function (a) { return this.project(a)._round()._subtract(this._initialTopLeftPoint); },
    project: function (a, b) { b = typeof b === 'undefined' ? this._zoom : b; return this.options.crs.latLngToPoint(a, this.options.scale(b)); },
    unproject: function (a, b, c) { b = typeof b === 'undefined' ? this._zoom : b; return this.options.crs.pointToLatLng(a, this.options.scale(b), c); },
    _initLayout: function () {
        var a = this._container; a.className += ' leaflet-container'; this.options.fadeAnimation && (a.className += ' leaflet-fade-anim'); var b = L.DomUtil.getStyle(a, 'position'); if (b != 'absolute' && b != 'relative')a.style.position = 'relative'; this._initPanes();
        this._initControlPos && this._initControlPos();
    },
    _initPanes: function () {
        var a = this._panes = {}; this._mapPane = a.mapPane = this._createPane('leaflet-map-pane', this._container); this._tilePane = a.tilePane = this._createPane('leaflet-tile-pane', this._mapPane); this._objectsPane = a.objectsPane = this._createPane('leaflet-objects-pane', this._mapPane); a.shadowPane = this._createPane('leaflet-shadow-pane'); a.overlayPane = this._createPane('leaflet-overlay-pane'); a.markerPane = this._createPane('leaflet-marker-pane'); a.popupPane =
this._createPane('leaflet-popup-pane');
    },
    _createPane: function (a, b) { return L.DomUtil.create('div', a, b || this._objectsPane); },
    _resetView: function (a, b, c) {
        var d = this._zoom != b; this.fire('movestart'); this._zoom = b; this._initialTopLeftPoint = this._getNewTopLeftPoint(a); c ? this._initialTopLeftPoint._add(L.DomUtil.getPosition(this._mapPane)) : L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0)); this._tileLayersToLoad = this._tileLayersNum; this.fire('viewreset', { hard: !c }); this.fire('move'); d && this.fire('zoomend');
        this.fire('moveend'); if (!this._loaded) this._loaded = !0, this.fire('load');
    },
    _initLayers: function (a) { this._layers = {}; for (var b = 0, c = a.length; b < c; b++) this.addLayer(a[b]); },
    _initControls: function () { this.options.zoomControl && this.addControl(new L.Control.Zoom()); if (this.options.attributionControl) this.attributionControl = new L.Control.Attribution(), this.addControl(this.attributionControl); },
    _rawPanBy: function (a) { var b = L.DomUtil.getPosition(this._mapPane); L.DomUtil.setPosition(this._mapPane, b.subtract(a)); },
    _initEvents: function () {
        L.DomEvent.addListener(this._container,
            'click', this._onMouseClick, this); for (var a = ['dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove'], b = 0; b < a.length; b++)L.DomEvent.addListener(this._container, a[b], this._fireMouseEvent, this); this.options.trackResize && L.DomEvent.addListener(window, 'resize', this._onResize, this);
    },
    _onResize: function () { L.Util.requestAnimFrame(this.invalidateSize, this); },
    _onMouseClick: function (a) { if (!this.dragging || !this.dragging.moved()) this.fire('pre' + a.type), this._fireMouseEvent(a); },
    _fireMouseEvent: function (a) {
        var b =
a.type; var b = b == 'mouseenter' ? 'mouseover' : b == 'mouseleave' ? 'mouseout' : b; this.hasEventListeners(b) && this.fire(b, { latlng: this.mouseEventToLatLng(a), layerPoint: this.mouseEventToLayerPoint(a) });
    },
    _initInteraction: function () { var a = { dragging: L.Handler.MapDrag, touchZoom: L.Handler.TouchZoom, doubleClickZoom: L.Handler.DoubleClickZoom, scrollWheelZoom: L.Handler.ScrollWheelZoom, shiftDragZoom: L.Handler.ShiftDragZoom }; var b; for (b in a)a.hasOwnProperty(b) && a[b] && (this[b] = new a[b](this), this.options[b] && this[b].enable()); },
    _onTileLayerLoad: function () {
        this._tileLayersToLoad--;
        if (this._tileLayersNum && !this._tileLayersToLoad && this._tileBg)clearTimeout(this._clearTileBgTimer), this._clearTileBgTimer = setTimeout(L.Util.bind(this._clearTileBg, this), 500);
    },
    _getTopLeftPoint: function () { if (!this._loaded) throw Error('Set map center and zoom first.'); return this._initialTopLeftPoint.subtract(L.DomUtil.getPosition(this._mapPane)); },
    _getNewTopLeftPoint: function (a) { var b = this.getSize().divideBy(2); return this.project(a).subtract(b).round(); },
    _limitZoom: function (a) {
        var b = this.getMinZoom();
        var c = this.getMaxZoom(); return Math.max(b, Math.min(c, a));
    }
}); L.Map.include({
    locate: function (a) { var b = { timeout: 1E4 }; L.Util.extend(b, a); navigator.geolocation ? navigator.geolocation.getCurrentPosition(L.Util.bind(this._handleGeolocationResponse, this), L.Util.bind(this._handleGeolocationError, this), b) : this.fire('locationerror', { code: 0, message: 'Geolocation not supported.' }); return this; },
    locateAndSetView: function (a, b) { this._setViewOnLocate = !0; this._maxLocateZoom = a || Infinity; return this.locate(b); },
    _handleGeolocationError: function (a) {
        var a = a.code; var b = a == 1 ? 'permission denied'
            : a == 2 ? 'position unavailable' : 'timeout'; if (this._setViewOnLocate) this.fitWorld(), this._setViewOnLocate = !1; this.fire('locationerror', { code: a, message: 'Geolocation error: ' + b + '.' });
    },
    _handleGeolocationResponse: function (a) {
        var b = 180 * a.coords.accuracy / 4E7; var c = b * 2; var d = a.coords.latitude; var e = a.coords.longitude; var f = new L.LatLng(d - b, e - c); var b = new L.LatLng(d + b, e + c); var f = new L.LatLngBounds(f, b); if (this._setViewOnLocate)b = Math.min(this.getBoundsZoom(f), this._maxLocateZoom), this.setView(f.getCenter(), b), this._setViewOnLocate = !1;
        this.fire('locationfound', { latlng: new L.LatLng(d, e), bounds: f, accuracy: a.coords.accuracy });
    }
}); L.Map.include({ openPopup: function (a) { this.closePopup(); this._popup = a; return this.addLayer(a); }, closePopup: function () { this._popup && this.removeLayer(this._popup); return this; } }); L.Map.include(!L.Transition || !L.Transition.implemented() ? {} : {
    setView: function (a, b, c) { var b = this._limitZoom(b); var d = this._zoom != b; if (this._loaded && !c && this._layers && (c = this._getNewTopLeftPoint(a).subtract(this._getTopLeftPoint()), d ? this._zoomToIfCenterInView && this._zoomToIfCenterInView(a, b, c) : this._panByIfClose(c))) return this; this._resetView(a, b); return this; },
    panBy: function (a) {
        if (!this._panTransition) {
            this._panTransition = new L.Transition(this._mapPane, { duration: 0.3 }), this._panTransition.on('step', this._onPanTransitionStep,
                this), this._panTransition.on('end', this._onPanTransitionEnd, this);
        } this.fire(this, 'movestart'); this._panTransition.run({ position: L.DomUtil.getPosition(this._mapPane).subtract(a) }); return this;
    },
    _onPanTransitionStep: function () { this.fire('move'); },
    _onPanTransitionEnd: function () { this.fire('moveend'); },
    _panByIfClose: function (a) { if (this._offsetIsWithinView(a)) return this.panBy(a), !0; return !1; },
    _offsetIsWithinView: function (a, b) { var c = b || 1; var d = this.getSize(); return Math.abs(a.x) <= d.x * c && Math.abs(a.y) <= d.y * c; }
}); L.Map.include(!L.DomUtil.TRANSITION ? {} : {
    _zoomToIfCenterInView: function (a, b, c) { if (this._animatingZoom) return !0; if (!this.options.zoomAnimation) return !1; var d = Math.pow(2, b - this._zoom); var c = c.divideBy(1 - 1 / d); if (!this._offsetIsWithinView(c, 1)) return !1; this._mapPane.className += ' leaflet-zoom-anim'; c = this.containerPointToLayerPoint(this.getSize().divideBy(2)).add(c); this._prepareTileBg(); this._runAnimation(a, b, d, c); return !0; },
    _runAnimation: function (a, b, c, d) {
        this._animatingZoom = !0; this._animateToCenter = a; this._animateToZoom =
b; a = L.DomUtil.TRANSFORM; if (L.Browser.gecko || window.opera) this._tileBg.style[a] += ' translate(0,0)'; L.Browser.android ? (this._tileBg.style[a + 'Origin'] = d.x + 'px ' + d.y + 'px', c = 'scale(' + c + ')') : c = L.DomUtil.getScaleString(c, d); L.Util.falseFn(this._tileBg.offsetWidth); d = {}; d[a] = this._tileBg.style[a] + ' ' + c; this._tileBg.transition.run(d);
    },
    _prepareTileBg: function () {
        if (!this._tileBg) this._tileBg = this._createPane('leaflet-tile-pane', this._mapPane), this._tileBg.style.zIndex = 1; var a = this._tilePane; var b = this._tileBg; b.style[L.DomUtil.TRANSFORM] =
''; b.style.visibility = 'hidden'; b.empty = !0; a.empty = !1; this._tilePane = this._panes.tilePane = b; this._tileBg = a; if (!this._tileBg.transition) this._tileBg.transition = new L.Transition(this._tileBg, { duration: 0.3, easing: 'cubic-bezier(0.25,0.1,0.25,0.75)' }), this._tileBg.transition.on('end', this._onZoomTransitionEnd, this); this._stopLoadingBgTiles();
    },
    _stopLoadingBgTiles: function () {
        for (var a = [].slice.call(this._tileBg.getElementsByTagName('img')), b = 0, c = a.length; b < c; b++) {
            a[b].complete || (a[b].parentNode.removeChild(a[b]),
            a[b] = null);
        }
    },
    _onZoomTransitionEnd: function () { this._restoreTileFront(); L.Util.falseFn(this._tileBg.offsetWidth); this._resetView(this._animateToCenter, this._animateToZoom, !0); this._mapPane.className = this._mapPane.className.replace(' leaflet-zoom-anim', ''); this._animatingZoom = !1; },
    _restoreTileFront: function () { this._tilePane.innerHTML = ''; this._tilePane.style.visibility = ''; this._tilePane.style.zIndex = 2; this._tileBg.style.zIndex = 1; },
    _clearTileBg: function () {
        if (!this._animatingZoom && !this.touchZoom._zooming) {
            this._tileBg.innerHTML =
'';
        }
    }
}); L.Map.include({
    addControl: function (a) { a.onAdd(this); var b = a.getPosition(); var c = this._controlCorners[b]; var a = a.getContainer(); L.DomUtil.addClass(a, 'leaflet-control'); b.indexOf('bottom') != -1 ? c.insertBefore(a, c.firstChild) : c.appendChild(a); return this; },
    removeControl: function (a) { var b = this._controlCorners[a.getPosition()]; var c = a.getContainer(); b.removeChild(c); if (a.onRemove)a.onRemove(this); return this; },
    _initControlPos: function () {
        var a = this._controlCorners = {}; var b = L.DomUtil.create('div', 'leaflet-control-container',
            this._container); L.Browser.touch && (b.className += ' leaflet-big-buttons'); a.topLeft = L.DomUtil.create('div', 'leaflet-top leaflet-left', b); a.topRight = L.DomUtil.create('div', 'leaflet-top leaflet-right', b); a.bottomLeft = L.DomUtil.create('div', 'leaflet-bottom leaflet-left', b); a.bottomRight = L.DomUtil.create('div', 'leaflet-bottom leaflet-right', b);
    }
});
