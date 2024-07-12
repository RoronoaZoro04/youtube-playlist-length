! function() {
    "use strict";

    function e(t, n) {
        function r(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var a;
        if (n = n || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = n.touchBoundary || 10, this.layer = t, this.tapDelay = n.tapDelay || 200, this.tapTimeout = n.tapTimeout || 700, !e.notNeeded(t)) {
            for (var s = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], o = this, u = 0, l = s.length; l > u; u++) o[s[u]] = r(o[s[u]], o);
            i && (t.addEventListener("mouseover", this.onMouse, !0), t.addEventListener("mousedown", this.onMouse, !0), t.addEventListener("mouseup", this.onMouse, !0)), t.addEventListener("click", this.onClick, !0), t.addEventListener("touchstart", this.onTouchStart, !1), t.addEventListener("touchmove", this.onTouchMove, !1), t.addEventListener("touchend", this.onTouchEnd, !1), t.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (t.removeEventListener = function(e, i, n) {
                var r = Node.prototype.removeEventListener;
                "click" === e ? r.call(t, e, i.hijacked || i, n) : r.call(t, e, i, n)
            }, t.addEventListener = function(e, i, n) {
                var r = Node.prototype.addEventListener;
                "click" === e ? r.call(t, e, i.hijacked || (i.hijacked = function(e) {
                    e.propagationStopped || i(e)
                }), n) : r.call(t, e, i, n)
            }), "function" == typeof t.onclick && (a = t.onclick, t.addEventListener("click", function(e) {
                a(e)
            }, !1), t.onclick = null)
        }
    }
    var t = navigator.userAgent.indexOf("Windows Phone") >= 0,
        i = navigator.userAgent.indexOf("Android") > 0 && !t,
        n = /iP(ad|hone|od)/.test(navigator.userAgent) && !t,
        r = n && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        a = n && /OS [6-7]_\d/.test(navigator.userAgent),
        s = navigator.userAgent.indexOf("BB10") > 0;
    e.prototype.needsClick = function(e) {
        switch (e.nodeName.toLowerCase()) {
            case "button":
            case "select":
            case "textarea":
                if (e.disabled) return !0;
                break;
            case "input":
                if (n && "file" === e.type || e.disabled) return !0;
                break;
            case "label":
            case "iframe":
            case "video":
                return !0
        }
        return /\bneedsclick\b/.test(e.className)
    }, e.prototype.needsFocus = function(e) {
        switch (e.nodeName.toLowerCase()) {
            case "textarea":
                return !0;
            case "select":
                return !i;
            case "input":
                switch (e.type) {
                    case "button":
                    case "checkbox":
                    case "file":
                    case "image":
                    case "radio":
                    case "submit":
                        return !1
                }
                return !e.disabled && !e.readOnly;
            default:
                return /\bneedsfocus\b/.test(e.className)
        }
    }, e.prototype.sendClick = function(e, t) {
        var i, n;
        document.activeElement && document.activeElement !== e && document.activeElement.blur(), n = t.changedTouches[0], i = document.createEvent("MouseEvents"), i.initMouseEvent(this.determineEventType(e), !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null), i.forwardedTouchEvent = !0, e.dispatchEvent(i)
    }, e.prototype.determineEventType = function(e) {
        return i && "select" === e.tagName.toLowerCase() ? "mousedown" : "click"
    }, e.prototype.focus = function(e) {
        var t;
        n && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type && "month" !== e.type ? (t = e.value.length, e.setSelectionRange(t, t)) : e.focus()
    }, e.prototype.updateScrollParent = function(e) {
        var t, i;
        if (!(t = e.fastClickScrollParent) || !t.contains(e)) {
            i = e;
            do {
                if (i.scrollHeight > i.offsetHeight) {
                    t = i, e.fastClickScrollParent = i;
                    break
                }
                i = i.parentElement
            } while (i)
        }
        t && (t.fastClickLastScrollTop = t.scrollTop)
    }, e.prototype.getTargetElementFromEventTarget = function(e) {
        return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
    }, e.prototype.onTouchStart = function(e) {
        var t, i, a;
        if (e.targetTouches.length > 1) return !0;
        if (t = this.getTargetElementFromEventTarget(e.target), i = e.targetTouches[0], n) {
            if (a = window.getSelection(), a.rangeCount && !a.isCollapsed) return !0;
            if (!r) {
                if (i.identifier && i.identifier === this.lastTouchIdentifier) return e.preventDefault(), !1;
                this.lastTouchIdentifier = i.identifier, this.updateScrollParent(t)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = e.timeStamp, this.targetElement = t, this.touchStartX = i.pageX, this.touchStartY = i.pageY, e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(), !0
    }, e.prototype.touchHasMoved = function(e) {
        var t = e.changedTouches[0],
            i = this.touchBoundary;
        return Math.abs(t.pageX - this.touchStartX) > i || Math.abs(t.pageY - this.touchStartY) > i
    }, e.prototype.onTouchMove = function(e) {
        return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e)) && (this.trackingClick = !1, this.targetElement = null), !0)
    }, e.prototype.findControl = function(e) {
        return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, e.prototype.onTouchEnd = function(e) {
        var t, s, o, u, l, c = this.targetElement;
        if (!this.trackingClick) return !0;
        if (e.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
        if (e.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = e.timeStamp, s = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, a && (l = e.changedTouches[0], c = document.elementFromPoint(l.pageX - window.pageXOffset, l.pageY - window.pageYOffset) || c, c.fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (o = c.tagName.toLowerCase())) {
            if (t = this.findControl(c)) {
                if (this.focus(c), i) return !1;
                c = t
            }
        } else if (this.needsFocus(c)) return e.timeStamp - s > 100 || n && window.top !== window && "input" === o ? (this.targetElement = null, !1) : (this.focus(c), this.sendClick(c, e), n && "select" === o || (this.targetElement = null, e.preventDefault()), !1);
        return !(!n || r || !(u = c.fastClickScrollParent) || u.fastClickLastScrollTop === u.scrollTop) || (this.needsClick(c) || (e.preventDefault(), this.sendClick(c, e)), !1)
    }, e.prototype.onTouchCancel = function() {
        this.trackingClick = !1, this.targetElement = null
    }, e.prototype.onMouse = function(e) {
        return !this.targetElement || (!!e.forwardedTouchEvent || (!(e.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick)) || (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0, e.stopPropagation(), e.preventDefault(), !1)))
    }, e.prototype.onClick = function(e) {
        var t;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === e.target.type && 0 === e.detail || (t = this.onMouse(e), t || (this.targetElement = null), t)
    }, e.prototype.destroy = function() {
        var e = this.layer;
        i && (e.removeEventListener("mouseover", this.onMouse, !0), e.removeEventListener("mousedown", this.onMouse, !0), e.removeEventListener("mouseup", this.onMouse, !0)), e.removeEventListener("click", this.onClick, !0), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1), e.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, e.notNeeded = function(e) {
        var t, n, r;
        if ("undefined" == typeof window.ontouchstart) return !0;
        if (n = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!i) return !0;
            if (t = document.querySelector("meta[name=viewport]")) {
                if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
                if (n > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
            }
        }
        if (s && (r = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), r[1] >= 10 && r[2] >= 3 && (t = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth) return !0
        }
        return "none" === e.style.msTouchAction || "manipulation" === e.style.touchAction || (!!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] >= 27 && (t = document.querySelector("meta[name=viewport]")) && (-1 !== t.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === e.style.touchAction || "manipulation" === e.style.touchAction))
    }, e.attach = function(t, i) {
        return new e(t, i)
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return e
    }) : "undefined" != typeof module && module.exports ? (module.exports = e.attach, module.exports.FastClick = e) : window.FastClick = e
}(),
function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.Clipboard = e()
    }
}(function() {
    var e;
    return function e(t, i, n) {
        function r(s, o) {
            if (!i[s]) {
                if (!t[s]) {
                    var u = "function" == typeof require && require;
                    if (!o && u) return u(s, !0);
                    if (a) return a(s, !0);
                    var l = new Error("Cannot find module '" + s + "'");
                    throw l.code = "MODULE_NOT_FOUND", l
                }
                var c = i[s] = {
                    exports: {}
                };
                t[s][0].call(c.exports, function(e) {
                    var i = t[s][1][e];
                    return r(i || e)
                }, c, c.exports, e, t, i, n)
            }
            return i[s].exports
        }
        for (var a = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
        return r
    }({
        1: [function(e, t) {
            function i(e, t) {
                for (; e && e !== document;) {
                    if (e.matches(t)) return e;
                    e = e.parentNode
                }
            }
            if (Element && !Element.prototype.matches) {
                var n = Element.prototype;
                n.matches = n.matchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector || n.webkitMatchesSelector
            }
            t.exports = i
        }, {}],
        2: [function(e, t) {
            function i(e, t, i, r, a) {
                var s = n.apply(this, arguments);
                return e.addEventListener(i, s, a), {
                    destroy: function() {
                        e.removeEventListener(i, s, a)
                    }
                }
            }

            function n(e, t, i, n) {
                return function(i) {
                    i.delegateTarget = r(i.target, t), i.delegateTarget && n.call(e, i)
                }
            }
            var r = e("./closest");
            t.exports = i
        }, {
            "./closest": 1
        }],
        3: [function(e, t, i) {
            i.node = function(e) {
                return void 0 !== e && e instanceof HTMLElement && 1 === e.nodeType
            }, i.nodeList = function(e) {
                var t = Object.prototype.toString.call(e);
                return void 0 !== e && ("[object NodeList]" === t || "[object HTMLCollection]" === t) && "length" in e && (0 === e.length || i.node(e[0]))
            }, i.string = function(e) {
                return "string" == typeof e || e instanceof String
            }, i.fn = function(e) {
                return "[object Function]" === Object.prototype.toString.call(e)
            }
        }, {}],
        4: [function(e, t) {
            function i(e, t, i) {
                if (!e && !t && !i) throw new Error("Missing required arguments");
                if (!s.string(t)) throw new TypeError("Second argument must be a String");
                if (!s.fn(i)) throw new TypeError("Third argument must be a Function");
                if (s.node(e)) return n(e, t, i);
                if (s.nodeList(e)) return r(e, t, i);
                if (s.string(e)) return a(e, t, i);
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
            }

            function n(e, t, i) {
                return e.addEventListener(t, i), {
                    destroy: function() {
                        e.removeEventListener(t, i)
                    }
                }
            }

            function r(e, t, i) {
                return Array.prototype.forEach.call(e, function(e) {
                    e.addEventListener(t, i)
                }), {
                    destroy: function() {
                        Array.prototype.forEach.call(e, function(e) {
                            e.removeEventListener(t, i)
                        })
                    }
                }
            }

            function a(e, t, i) {
                return o(document.body, e, t, i)
            }
            var s = e("./is"),
                o = e("delegate");
            t.exports = i
        }, {
            "./is": 3,
            delegate: 2
        }],
        5: [function(e, t) {
            function i(e) {
                var t;
                if ("SELECT" === e.nodeName) e.focus(), t = e.value;
                else if ("INPUT" === e.nodeName || "TEXTAREA" === e.nodeName) e.focus(), e.setSelectionRange(0, e.value.length), t = e.value;
                else {
                    e.hasAttribute("contenteditable") && e.focus();
                    var i = window.getSelection(),
                        n = document.createRange();
                    n.selectNodeContents(e), i.removeAllRanges(), i.addRange(n), t = i.toString()
                }
                return t
            }
            t.exports = i
        }, {}],
        6: [function(e, t) {
            function i() {}
            i.prototype = {
                on: function(e, t, i) {
                    var n = this.e || (this.e = {});
                    return (n[e] || (n[e] = [])).push({
                        fn: t,
                        ctx: i
                    }), this
                },
                once: function(e, t, i) {
                    function n() {
                        r.off(e, n), t.apply(i, arguments)
                    }
                    var r = this;
                    return n._ = t, this.on(e, n, i)
                },
                emit: function(e) {
                    var t = [].slice.call(arguments, 1),
                        i = ((this.e || (this.e = {}))[e] || []).slice(),
                        n = 0,
                        r = i.length;
                    for (n; n < r; n++) i[n].fn.apply(i[n].ctx, t);
                    return this
                },
                off: function(e, t) {
                    var i = this.e || (this.e = {}),
                        n = i[e],
                        r = [];
                    if (n && t)
                        for (var a = 0, s = n.length; a < s; a++) n[a].fn !== t && n[a].fn._ !== t && r.push(n[a]);
                    return r.length ? i[e] = r : delete i[e], this
                }
            }, t.exports = i
        }, {}],
        7: [function(t, i, n) {
            ! function(r, a) {
                if ("function" == typeof e && e.amd) e(["module", "select"], a);
                else if (void 0 !== n) a(i, t("select"));
                else {
                    var s = {
                        exports: {}
                    };
                    a(s, r.select), r.clipboardAction = s.exports
                }
            }(this, function(e, t) {
                "use strict";

                function i(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }

                function n(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }
                var r = i(t),
                    a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                        return typeof e
                    } : function(e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    },
                    s = function() {
                        function e(e, t) {
                            for (var i = 0; i < t.length; i++) {
                                var n = t[i];
                                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                            }
                        }
                        return function(t, i, n) {
                            return i && e(t.prototype, i), n && e(t, n), t
                        }
                    }(),
                    o = function() {
                        function e(t) {
                            n(this, e), this.resolveOptions(t), this.initSelection()
                        }
                        return s(e, [{
                            key: "resolveOptions",
                            value: function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                this.action = e.action, this.emitter = e.emitter, this.target = e.target, this.text = e.text, this.trigger = e.trigger, this.selectedText = ""
                            }
                        }, {
                            key: "initSelection",
                            value: function() {
                                this.text ? this.selectFake() : this.target && this.selectTarget()
                            }
                        }, {
                            key: "selectFake",
                            value: function() {
                                var e = this,
                                    t = "rtl" == document.documentElement.getAttribute("dir");
                                this.removeFake(), this.fakeHandlerCallback = function() {
                                    return e.removeFake()
                                }, this.fakeHandler = document.body.addEventListener("click", this.fakeHandlerCallback) || !0, this.fakeElem = document.createElement("textarea"), this.fakeElem.style.fontSize = "12pt", this.fakeElem.style.border = "0", this.fakeElem.style.padding = "0", this.fakeElem.style.margin = "0", this.fakeElem.style.position = "absolute", this.fakeElem.style[t ? "right" : "left"] = "-9999px";
                                var i = window.pageYOffset || document.documentElement.scrollTop;
                                this.fakeElem.addEventListener("focus", window.scrollTo(0, i)), this.fakeElem.style.top = i + "px", this.fakeElem.setAttribute("readonly", ""), this.fakeElem.value = this.text, document.body.appendChild(this.fakeElem), this.selectedText = (0, r["default"])(this.fakeElem), this.copyText()
                            }
                        }, {
                            key: "removeFake",
                            value: function() {
                                this.fakeHandler && (document.body.removeEventListener("click", this.fakeHandlerCallback), this.fakeHandler = null, this.fakeHandlerCallback = null), this.fakeElem && (document.body.removeChild(this.fakeElem), this.fakeElem = null)
                            }
                        }, {
                            key: "selectTarget",
                            value: function() {
                                this.selectedText = (0, r["default"])(this.target), this.copyText()
                            }
                        }, {
                            key: "copyText",
                            value: function() {
                                var e = void 0;
                                try {
                                    e = document.execCommand(this.action)
                                } catch (t) {
                                    e = !1
                                }
                                this.handleResult(e)
                            }
                        }, {
                            key: "handleResult",
                            value: function(e) {
                                this.emitter.emit(e ? "success" : "error", {
                                    action: this.action,
                                    text: this.selectedText,
                                    trigger: this.trigger,
                                    clearSelection: this.clearSelection.bind(this)
                                })
                            }
                        }, {
                            key: "clearSelection",
                            value: function() {
                                this.target && this.target.blur(), window.getSelection().removeAllRanges()
                            }
                        }, {
                            key: "destroy",
                            value: function() {
                                this.removeFake()
                            }
                        }, {
                            key: "action",
                            set: function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "copy";
                                if (this._action = e, "copy" !== this._action && "cut" !== this._action) throw new Error('Invalid "action" value, use either "copy" or "cut"')
                            },
                            get: function() {
                                return this._action
                            }
                        }, {
                            key: "target",
                            set: function(e) {
                                if (void 0 !== e) {
                                    if (!e || "object" !== (void 0 === e ? "undefined" : a(e)) || 1 !== e.nodeType) throw new Error('Invalid "target" value, use a valid Element');
                                    if ("copy" === this.action && e.hasAttribute("disabled")) throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                    if ("cut" === this.action && (e.hasAttribute("readonly") || e.hasAttribute("disabled"))) throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                    this._target = e
                                }
                            },
                            get: function() {
                                return this._target
                            }
                        }]), e
                    }();
                e.exports = o
            })
        }, {
            select: 5
        }],
        8: [function(t, i, n) {
            ! function(r, a) {
                if ("function" == typeof e && e.amd) e(["module", "./clipboard-action", "tiny-emitter", "good-listener"], a);
                else if (void 0 !== n) a(i, t("./clipboard-action"), t("tiny-emitter"), t("good-listener"));
                else {
                    var s = {
                        exports: {}
                    };
                    a(s, r.clipboardAction, r.tinyEmitter, r.goodListener), r.clipboard = s.exports
                }
            }(this, function(e, t, i, n) {
                "use strict";

                function r(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }

                function a(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }

                function s(e, t) {
                    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }

                function o(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }

                function u(e, t) {
                    var i = "data-clipboard-" + e;
                    if (t.hasAttribute(i)) return t.getAttribute(i)
                }
                var l = r(t),
                    c = r(i),
                    d = r(n),
                    m = function() {
                        function e(e, t) {
                            for (var i = 0; i < t.length; i++) {
                                var n = t[i];
                                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                            }
                        }
                        return function(t, i, n) {
                            return i && e(t.prototype, i), n && e(t, n), t
                        }
                    }(),
                    p = function(e) {
                        function t(e, i) {
                            a(this, t);
                            var n = s(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                            return n.resolveOptions(i), n.listenClick(e), n
                        }
                        return o(t, e), m(t, [{
                            key: "resolveOptions",
                            value: function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                this.action = "function" == typeof e.action ? e.action : this.defaultAction, this.target = "function" == typeof e.target ? e.target : this.defaultTarget, this.text = "function" == typeof e.text ? e.text : this.defaultText
                            }
                        }, {
                            key: "listenClick",
                            value: function(e) {
                                var t = this;
                                this.listener = (0, d["default"])(e, "click", function(e) {
                                    return t.onClick(e)
                                })
                            }
                        }, {
                            key: "onClick",
                            value: function(e) {
                                var t = e.delegateTarget || e.currentTarget;
                                this.clipboardAction && (this.clipboardAction = null), this.clipboardAction = new l["default"]({
                                    action: this.action(t),
                                    target: this.target(t),
                                    text: this.text(t),
                                    trigger: t,
                                    emitter: this
                                })
                            }
                        }, {
                            key: "defaultAction",
                            value: function(e) {
                                return u("action", e)
                            }
                        }, {
                            key: "defaultTarget",
                            value: function(e) {
                                var t = u("target", e);
                                if (t) return document.querySelector(t)
                            }
                        }, {
                            key: "defaultText",
                            value: function(e) {
                                return u("text", e)
                            }
                        }, {
                            key: "destroy",
                            value: function() {
                                this.listener.destroy(), this.clipboardAction && (this.clipboardAction.destroy(), this.clipboardAction = null)
                            }
                        }]), t
                    }(c["default"]);
                e.exports = p
            })
        }, {
            "./clipboard-action": 7,
            "good-listener": 4,
            "tiny-emitter": 6
        }]
    }, {}, [8])(8)
}),
function(e, t) {
    "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && module.exports ? module.exports = t() : e.Rellax = t()
}(this, function() {
    var e = function(t, i) {
        var n = Object.create(e.prototype);
        if ("undefined" == typeof window.orientation) {
            var r = 0,
                a = 0,
                s = [],
                o = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(e) {
                    setTimeout(e, 1e3 / 60)
                };
            if (n.options = {
                    speed: -2
                }, i && Object.keys(i).forEach(function(e) {
                    n.options[e] = i[e]
                }), -10 > n.options.speed ? n.options.speed = -10 : 10 < n.options.speed && (n.options.speed = 10), t || (t = ".rellax"), document.getElementsByClassName(t.replace(".", ""))) n.elems = document.getElementsByClassName(t.replace(".", ""));
            else {
                if (!1 === document.querySelector(t)) throw Error("The elements you're trying to select don't exist.");
                n.elems = querySelector(t)
            }
            var u = function(e) {
                    var t = 0 + e.getBoundingClientRect().top,
                        i = e.clientHeight || e.offsetHeight || e.scrollHeight,
                        r = e.dataset.rellaxSpeed ? e.dataset.rellaxSpeed : n.options.speed,
                        s = Math.round(100 * r * (1 - (0 - t + a) / (i + a)));
                    return e = e.style.cssText.slice(11), {
                        base: s,
                        top: t,
                        height: i,
                        speed: r,
                        style: e
                    }
                },
                l = function() {
                    var e = r;
                    return r = void 0 !== window.pageYOffset ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop, e != r
                },
                c = function() {
                    l() && d(), o(c)
                },
                d = function() {
                    for (var e = 0; e < n.elems.length; e++) {
                        var t = "translate3d(0," + (Math.round(100 * s[e].speed * (1 - (r - s[e].top + a) / (s[e].height + a))) - s[e].base) + "px,0)" + s[e].style;
                        n.elems[e].style.cssText = "-webkit-transform:" + t + ";-moz-transform:" + t + ";transform:" + t + ";"
                    }
                };
            return function() {
                a = window.innerHeight, l();
                for (var e = 0; e < n.elems.length; e++) {
                    var t = u(n.elems[e]);
                    s.push(t)
                }
                window.addEventListener("resize", function() {
                    d()
                }), c(), d()
            }(), Object.freeze(), n
        }
    };
    return e
});
var Lorem;
! function() {
    Lorem = function() {
        this.type = null, this.query = null, this.data = null
    }, Lorem.IMAGE = 1, Lorem.TEXT = 2, Lorem.TYPE = {
        PARAGRAPH: 1,
        SENTENCE: 2,
        WORD: 3
    }, Lorem.WORDS = ["lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit", "ut", "aliquam,", "purus", "sit", "amet", "luctus", "venenatis,", "lectus", "magna", "fringilla", "urna,", "porttitor", "rhoncus", "dolor", "purus", "non", "enim", "praesent", "elementum", "facilisis", "leo,", "vel", "fringilla", "est", "ullamcorper", "eget", "nulla", "facilisi", "etiam", "dignissim", "diam", "quis", "enim", "lobortis", "scelerisque", "fermentum", "dui", "faucibus", "in", "ornare", "quam", "viverra", "orci", "sagittis", "eu", "volutpat", "odio", "facilisis", "mauris", "sit", "amet", "massa", "vitae", "tortor", "condimentum", "lacinia", "quis", "vel", "eros", "donec", "ac", "odio", "tempor", "orci", "dapibus", "ultrices", "in", "iaculis", "nunc", "sed", "augue", "lacus,", "viverra", "vitae", "congue", "eu,", "consequat", "ac", "felis", "donec", "et", "odio", "pellentesque", "diam", "volutpat", "commodo", "sed", "egestas", "egestas", "fringilla", "phasellus", "faucibus", "scelerisque", "eleifend", "donec", "pretium", "vulputate", "sapien", "nec", "sagittis", "aliquam", "malesuada", "bibendum", "arcu", "vitae", "elementum", "curabitur", "vitae", "nunc", "sed", "velit", "dignissim", "sodales", "ut", "eu", "sem", "integer", "vitae", "justo", "eget", "magna", "fermentum", "iaculis", "eu", "non", "diam", "phasellus", "vestibulum", "lorem", "sed", "risus", "ultricies", "tristique", "nulla", "aliquet", "enim", "tortor,", "at", "auctor", "urna", "nunc", "id", "cursus", "metus", "aliquam", "eleifend", "mi", "in", "nulla", "posuere", "sollicitudin", "aliquam", "ultrices", "sagittis", "orci,", "a", "scelerisque", "purus", "semper", "eget", "duis", "at", "tellus", "at", "urna", "condimentum", "mattis", "pellentesque", "id", "nibh", "tortor,", "id", "aliquet", "lectus", "proin", "nibh", "nisl,", "condimentum", "id", "venenatis", "a,", "condimentum", "vitae", "sapien", "pellentesque", "habitant", "morbi", "tristique", "senectus", "et", "netus", "et", "malesuada", "fames", "ac", "turpis", "egestas", "sed", "tempus,", "urna", "et", "pharetra", "pharetra,", "massa", "massa", "ultricies", "mi,", "quis", "hendrerit", "dolor", "magna", "eget", "est", "lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit", "pellentesque", "habitant", "morbi", "tristique", "senectus", "et", "netus", "et", "malesuada", "fames", "ac", "turpis", "egestas", "integer", "eget", "aliquet", "nibh", "praesent", "tristique", "magna", "sit", "amet", "purus", "gravida", "quis", "blandit", "turpis", "cursus", "in", "hac", "habitasse", "platea", "dictumst", "quisque", "sagittis,", "purus", "sit", "amet", "volutpat", "consequat,", "mauris", "nunc", "congue", "nisi,", "vitae", "suscipit", "tellus", "mauris", "a", "diam", "maecenas", "sed", "enim", "ut", "sem", "viverra", "aliquet", "eget", "sit", "amet", "tellus", "cras", "adipiscing", "enim", "eu", "turpis", "egestas", "pretium", "aenean", "pharetra,", "magna", "ac", "placerat", "vestibulum,", "lectus", "mauris", "ultrices", "eros,", "in", "cursus", "turpis", "massa", "tincidunt", "dui", "ut", "ornare", "lectus", "sit", "amet", "est", "placerat", "in", "egestas", "erat", "imperdiet", "sed", "euismod", "nisi", "porta", "lorem", "mollis", "aliquam", "ut", "porttitor", "leo", "a", "diam", "sollicitudin", "tempor", "id", "eu", "nisl", "nunc", "mi", "ipsum,", "faucibus", "vitae", "aliquet", "nec,", "ullamcorper", "sit", "amet", "risus", "nullam", "eget", "felis", "eget", "nunc", "lobortis", "mattis", "aliquam", "faucibus", "purus", "in", "massa", "tempor", "nec", "feugiat", "nisl", "pretium", "fusce", "id", "velit", "ut", "tortor", "pretium", "viverra", "suspendisse", "potenti", "nullam", "ac", "tortor", "vitae", "purus", "faucibus", "ornare", "suspendisse", "sed", "nisi", "lacus,", "sed", "viverra", "tellus", "in", "hac", "habitasse", "platea", "dictumst", "vestibulum", "rhoncus", "est", "pellentesque", "elit", "ullamcorper", "dignissim", "cras", "tincidunt", "lobortis", "feugiat", "vivamus", "at", "augue", "eget", "arcu", "dictum", "varius", "duis", "at", "consectetur", "lorem", "donec", "massa", "sapien,", "faucibus", "et", "molestie", "ac,", "feugiat", "sed", "lectus", "vestibulum", "mattis", "ullamcorper", "velit", "sed", "ullamcorper", "morbi", "tincidunt", "ornare", "massa,", "eget", "egestas", "purus", "viverra", "accumsan", "in", "nisl", "nisi,", "scelerisque", "eu", "ultrices", "vitae,", "auctor", "eu", "augue", "ut", "lectus", "arcu,", "bibendum", "at", "varius", "vel,", "pharetra", "vel", "turpis", "nunc", "eget", "lorem", "dolor,", "sed", "viverra", "ipsum", "nunc", "aliquet", "bibendum", "enim,", "facilisis", "gravida", "neque", "convallis", "a", "cras", "semper", "auctor", "neque,", "vitae", "tempus", "quam", "pellentesque", "nec", "nam", "aliquam", "sem", "et", "tortor", "consequat", "id", "porta", "nibh", "venenatis", "cras", "sed", "felis", "eget", "velit", "aliquet", "sagittis", "id", "consectetur", "purus", "ut", "faucibus", "pulvinar", "elementum", "integer", "enim", "neque,", "volutpat", "ac", "tincidunt", "vitae,", "semper", "quis", "lectus", "nulla", "at", "volutpat", "diam", "ut", "venenatis", "tellus", "in", "metus", "vulputate", "eu", "scelerisque", "felis", "imperdiet", "proin", "fermentum", "leo", "vel", "orci", "porta", "non", "pulvinar", "neque", "laoreet", "suspendisse", "interdum", "consectetur", "libero,", "id", "faucibus", "nisl", "tincidunt", "eget", "nullam", "non", "nisi", "est,", "sit", "amet", "facilisis", "magna", "etiam", "tempor,", "orci", "eu", "lobortis", "elementum,", "nibh", "tellus", "molestie", "nunc,", "non", "blandit", "massa", "enim", "nec", "dui", "nunc", "mattis", "enim", "ut", "tellus", "elementum", "sagittis", "vitae", "et", "leo", "duis", "ut", "diam", "quam", "nulla", "porttitor", "massa", "id", "neque", "aliquam", "vestibulum", "morbi", "blandit", "cursus", "risus,", "at", "ultrices", "mi", "tempus", "imperdiet", "nulla", "malesuada", "pellentesque", "elit", "eget", "gravida", "cum", "sociis", "natoque", "penatibus", "et", "magnis", "dis", "parturient", "montes,", "nascetur", "ridiculus", "mus", "mauris", "vitae", "ultricies", "leo", "integer", "malesuada", "nunc", "vel", "risus", "commodo", "viverra", "maecenas", "accumsan,", "lacus", "vel", "facilisis", "volutpat,", "est", "velit", "egestas", "dui,", "id", "ornare", "arcu", "odio", "ut", "sem", "nulla", "pharetra", "diam", "sit", "amet", "nisl", "suscipit", "adipiscing", "bibendum", "est", "ultricies", "integer", "quis", "auctor", "elit", "sed", "vulputate", "mi", "sit", "amet", "mauris", "commodo", "quis", "imperdiet", "massa", "tincidunt", "nunc", "pulvinar", "sapien", "et", "ligula", "ullamcorper", "malesuada", "proin", "libero", "nunc,", "consequat", "interdum", "varius", "sit", "amet,", "mattis", "vulputate", "enim", "nulla", "aliquet", "porttitor", "lacus,", "luctus", "accumsan", "tortor", "posuere", "ac", "ut", "consequat", "semper", "viverra", "nam", "libero", "justo,", "laoreet", "sit", "amet", "cursus", "sit", "amet,", "dictum", "sit", "amet", "justo", "donec", "enim", "diam,", "vulputate", "ut", "pharetra", "sit", "amet,", "aliquam", "id", "diam", "maecenas", "ultricies", "mi", "eget", "mauris", "pharetra", "et", "ultrices", "neque", "ornare", "aenean", "euismod", "elementum", "nisi,", "quis", "eleifend", "quam", "adipiscing", "vitae", "proin", "sagittis,", "nisl", "rhoncus", "mattis", "rhoncus,", "urna", "neque", "viverra", "justo,", "nec", "ultrices", "dui", "sapien", "eget", "mi", "proin", "sed", "libero", "enim,", "sed", "faucibus", "turpis", "in", "eu", "mi", "bibendum", "neque", "egestas", "congue", "quisque", "egestas", "diam", "in", "arcu", "cursus", "euismod", "quis", "viverra", "nibh", "cras", "pulvinar", "mattis", "nunc,", "sed", "blandit", "libero", "volutpat", "sed", "cras", "ornare", "arcu", "dui", "vivamus", "arcu", "felis,", "bibendum", "ut", "tristique", "et,", "egestas", "quis", "ipsum", "suspendisse", "ultrices", "gravida", "dictum", "fusce", "ut", "placerat", "orci", "nulla", "pellentesque", "dignissim", "enim,", "sit", "amet", "venenatis", "urna", "cursus", "eget", "nunc", "scelerisque", "viverra", "mauris,", "in", "aliquam", "sem", "fringilla", "ut", "morbi", "tincidunt", "augue", "interdum", "velit", "euismod", "in", "pellentesque", "massa", "placerat", "duis", "ultricies", "lacus", "sed", "turpis", "tincidunt", "id", "aliquet", "risus", "feugiat", "in", "ante", "metus,", "dictum", "at", "tempor", "commodo,", "ullamcorper", "a", "lacus", "vestibulum", "sed", "arcu", "non", "odio", "euismod", "lacinia", "at", "quis", "risus", "sed", "vulputate", "odio", "ut", "enim", "blandit", "volutpat", "maecenas", "volutpat", "blandit", "aliquam", "etiam", "erat", "velit,", "scelerisque", "in", "dictum", "non,", "consectetur", "a", "erat", "nam", "at", "lectus", "urna", "duis", "convallis", "convallis", "tellus,", "id", "interdum", "velit", "laoreet", "id", "donec", "ultrices", "tincidunt", "arcu,", "non", "sodales", "neque", "sodales", "ut", "etiam", "sit", "amet", "nisl", "purus,", "in", "mollis", "nunc", "sed", "id", "semper", "risus", "in", "hendrerit", "gravida", "rutrum", "quisque", "non", "tellus", "orci,", "ac", "auctor", "augue", "mauris", "augue", "neque,", "gravida", "in", "fermentum", "et,", "sollicitudin", "ac", "orci", "phasellus", "egestas", "tellus", "rutrum", "tellus", "pellentesque", "eu", "tincidunt", "tortor", "aliquam", "nulla", "facilisi", "cras", "fermentum,", "odio", "eu", "feugiat", "pretium,", "nibh", "ipsum", "consequat", "nisl,", "vel", "pretium", "lectus", "quam", "id", "leo", "in", "vitae", "turpis", "massa", "sed", "elementum", "tempus", "egestas", "sed", "sed", "risus", "pretium", "quam", "vulputate", "dignissim", "suspendisse", "in", "est", "ante", "in", "nibh", "mauris,", "cursus", "mattis", "molestie", "a,", "iaculis", "at", "erat", "pellentesque", "adipiscing", "commodo", "elit,", "at", "imperdiet", "dui", "accumsan", "sit", "amet", "nulla", "facilisi", "morbi", "tempus", "iaculis", "urna,", "id", "volutpat", "lacus", "laoreet", "non", "curabitur", "gravida", "arcu", "ac", "tortor", "dignissim", "convallis", "aenean", "et", "tortor", "at", "risus", "viverra", "adipiscing", "at", "in", "tellus", "integer", "feugiat", "scelerisque", "varius", "morbi", "enim", "nunc,", "faucibus", "a", "pellentesque", "sit", "amet,", "porttitor", "eget", "dolor", "morbi", "non", "arcu", "risus,", "quis", "varius", "quam", "quisque", "id", "diam", "vel", "quam", "elementum", "pulvinar", "etiam", "non", "quam", "lacus", "suspendisse", "faucibus", "interdum", "posuere", "lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit", "duis", "tristique", "sollicitudin", "nibh", "sit", "amet", "commodo", "nulla", "facilisi", "nullam", "vehicula", "ipsum", "a", "arcu", "cursus", "vitae", "congue", "mauris", "rhoncus", "aenean", "vel", "elit", "scelerisque", "mauris", "pellentesque", "pulvinar", "pellentesque", "habitant", "morbi", "tristique", "senectus", "et", "netus", "et", "malesuada", "fames", "ac", "turpis", "egestas", "maecenas", "pharetra", "convallis", "posuere", "morbi", "leo", "urna,", "molestie", "at", "elementum", "eu,", "facilisis", "sed", "odio", "morbi", "quis", "commodo", "odio", "aenean", "sed", "adipiscing", "diam", "donec", "adipiscing", "tristique", "risus", "nec", "feugiat", "in", "fermentum", "posuere", "urna", "nec", "tincidunt", "praesent", "semper", "feugiat", "nibh", "sed", "pulvinar", "proin", "gravida", "hendrerit", "lectus", "a", "molestie"], Lorem.prototype.randomInt = function(e, t) {
        return Math.floor(Math.random() * (t - e + 1)) + e
    }, loremStart = !0, Lorem.prototype.createText = function(e, t, i) {
        switch (t) {
            case Lorem.TYPE.PARAGRAPH:
                for (var n = new Array, r = 0; r < e; r++) {
                    var a = this.randomInt(10, 20),
                        s = this.createText(a, Lorem.TYPE.SENTENCE, r);
                    n.push("<p>" + s + "</p>"), loremStart = !1
                }
                return n.join("\n");
            case Lorem.TYPE.SENTENCE:
                for (var o = new Array, r = 0; r < e; r++) {
                    var u = this.randomInt(5, 10),
                        l = this.createText(u, Lorem.TYPE.WORD, r).split(" ");
                    l[0] = l[0].substr(0, 1).toUpperCase() + l[0].substr(1);
                    var c = l.join(" ");
                    o.push(c)
                }
                return (o.join(". ") + ".").replace(/(\.\,|\,\.)/g, ".");
            case Lorem.TYPE.WORD:
                var d = this.randomInt(0, Lorem.WORDS.length - e - 1);
                return 0 == i && loremStart ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" : Lorem.WORDS.slice(d, d + e).join(" ").replace(/\.|\,/g, "")
        }
    }, Lorem.prototype.createLorem = function(e) {
        var t, i = new Array;
        if (/\d+-\d+[psw]/.test(this.query)) {
            var n = this.query.replace(/[a-z]/, "").split("-");
            t = Math.floor(Math.random() * parseInt(n[1])) + parseInt(n[0])
        } else t = parseInt(this.query);
        if (/\d+p/.test(this.query)) var r = Lorem.TYPE.PARAGRAPH;
        else if (/\d+s/.test(this.query)) var r = Lorem.TYPE.SENTENCE;
        else if (/\d+w/.test(this.query)) var r = Lorem.TYPE.WORD;
        if (i.push(this.createText(t, r)), i = 1 == r ? i.join(" ") : "<p>" + i.join(" ") + "</p>", e)
            if (this.type == Lorem.TEXT) e.innerHTML = i;
            else if (this.type == Lorem.IMAGE) {
            var a = "",
                s = this.query.split(" ");
            "gray" == s[0] && (a += "/g", s[0] = ""), e.getAttribute("width") && (a += "/" + e.getAttribute("width")), e.getAttribute("height") && (a += "/" + e.getAttribute("height")), a += "/" + s.join(" ").replace(/(^\s+|\s+$)/, ""), e.src = "http://lorempixum.com" + a.replace(/\/\//, "/")
        }
        if (null == e) return i
    }, "undefined" != typeof jQuery && function(e) {
        e.fn.lorem = function() {
            e(this).each(function() {
                var t = new Lorem;
                t.type = e(this).is("img") ? Lorem.IMAGE : Lorem.TEXT, t.query = e(this).data("lorem"), t.createLorem(this)
            })
        }, e(document).ready(function() {
            e("[data-lorem]").lorem()
        })
    }(jQuery)
}(),
function() {
    function e() {
        a && a.addEventListener("click", i), s && s.addEventListener("click", function(e) {
            var t = e.target;
            u && t !== a && i()
        }), o && (o.addEventListener("mouseenter", n), o.addEventListener("mouseleave", n))
    }

    function t(e) {
        e.preventDefault(), e.stopPropagation()
    }

    function i() {
        u ? (r.classList.remove("menu-is-open"), r.removeEventListener("touchmove", t)) : (r.classList.add("menu-is-open"), r.addEventListener("touchmove", t)), u = !u
    }

    function n() {
        u ? (r.classList.remove("lang-is-open"), r.removeEventListener("touchmove", t)) : (r.classList.add("lang-is-open"), r.addEventListener("touchmove", t)), u = !u
    }
    var r = document.body,
        a = document.getElementsByClassName("js-menu-button")[0],
        s = document.getElementsByClassName("js-body-overlay")[0],
        o = document.getElementsByClassName("js-menu-language")[0],
        u = !1;
    e()
}();
var fg = {
    fonts: {
        basic: {
            serif: {
                a: "\ud835\udc1a",
                b: "\ud835\udc1b",
                c: "\ud835\udc1c",
                d: "\ud835\udc1d",
                e: "\ud835\udc1e",
                f: "\ud835\udc1f",
                g: "\ud835\udc20",
                h: "\ud835\udc21",
                i: "\ud835\udc22",
                j: "\ud835\udc23",
                k: "\ud835\udc24",
                l: "\ud835\udc25",
                m: "\ud835\udc26",
                n: "\ud835\udc27",
                o: "\ud835\udc28",
                p: "\ud835\udc29",
                q: "\ud835\udc2a",
                r: "\ud835\udc2b",
                s: "\ud835\udc2c",
                t: "\ud835\udc2d",
                u: "\ud835\udc2e",
                v: "\ud835\udc2f",
                w: "\ud835\udc30",
                x: "\ud835\udc31",
                y: "\ud835\udc32",
                z: "\ud835\udc33",
                A: "\ud835\udc00",
                B: "\ud835\udc01",
                C: "\ud835\udc02",
                D: "\ud835\udc03",
                E: "\ud835\udc04",
                F: "\ud835\udc05",
                G: "\ud835\udc06",
                H: "\ud835\udc07",
                I: "\ud835\udc08",
                J: "\ud835\udc09",
                K: "\ud835\udc0a",
                L: "\ud835\udc0b",
                M: "\ud835\udc0c",
                N: "\ud835\udc0d",
                O: "\ud835\udc0e",
                P: "\ud835\udc0f",
                Q: "\ud835\udc10",
                R: "\ud835\udc11",
                S: "\ud835\udc12",
                T: "\ud835\udc13",
                U: "\ud835\udc14",
                V: "\ud835\udc15",
                W: "\ud835\udc16",
                X: "\ud835\udc17",
                Y: "\ud835\udc18",
                Z: "\ud835\udc19",
                0: "\ud835\udfce",
                1: "\ud835\udfcf",
                2: "\ud835\udfd0",
                3: "\ud835\udfd1",
                4: "\ud835\udfd2",
                5: "\ud835\udfd3",
                6: "\ud835\udfd4",
                7: "\ud835\udfd5",
                8: "\ud835\udfd6",
                9: "\ud835\udfd7"
            },
            serif_italic: {
                a: "\ud835\udc4e",
                b: "\ud835\udc4f",
                c: "\ud835\udc50",
                d: "\ud835\udc51",
                e: "\ud835\udc52",
                f: "\ud835\udc53",
                g: "\ud835\udc54",
                h: "\u210e",
                i: "\ud835\udc56",
                j: "\ud835\udc57",
                k: "\ud835\udc58",
                l: "\ud835\udc59",
                m: "\ud835\udc5a",
                n: "\ud835\udc5b",
                o: "\ud835\udc5c",
                p: "\ud835\udc5d",
                q: "\ud835\udc5e",
                r: "\ud835\udc5f",
                s: "\ud835\udc60",
                t: "\ud835\udc61",
                u: "\ud835\udc62",
                v: "\ud835\udc63",
                w: "\ud835\udc64",
                x: "\ud835\udc65",
                y: "\ud835\udc66",
                z: "\ud835\udc67",
                A: "\ud835\udc34",
                B: "\ud835\udc35",
                C: "\ud835\udc36",
                D: "\ud835\udc37",
                E: "\ud835\udc38",
                F: "\ud835\udc39",
                G: "\ud835\udc3a",
                H: "\ud835\udc3b",
                I: "\ud835\udc3c",
                J: "\ud835\udc3d",
                K: "\ud835\udc3e",
                L: "\ud835\udc3f",
                M: "\ud835\udc40",
                N: "\ud835\udc41",
                O: "\ud835\udc42",
                P: "\ud835\udc43",
                Q: "\ud835\udc44",
                R: "\ud835\udc45",
                S: "\ud835\udc46",
                T: "\ud835\udc47",
                U: "\ud835\udc48",
                V: "\ud835\udc49",
                W: "\ud835\udc4a",
                X: "\ud835\udc4b",
                Y: "\ud835\udc4c",
                Z: "\ud835\udc4d",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            italic_regular: {
                a: "\ud835\ude22",
                b: "\ud835\ude23",
                c: "\ud835\ude24",
                d: "\ud835\ude25",
                e: "\ud835\ude26",
                f: "\ud835\ude27",
                g: "\ud835\ude28",
                h: "\ud835\ude29",
                i: "\ud835\ude2a",
                j: "\ud835\ude2b",
                k: "\ud835\ude2c",
                l: "\ud835\ude2d",
                m: "\ud835\ude2e",
                n: "\ud835\ude2f",
                o: "\ud835\ude30",
                p: "\ud835\ude31",
                q: "\ud835\ude32",
                r: "\ud835\ude33",
                s: "\ud835\ude34",
                t: "\ud835\ude35",
                u: "\ud835\ude36",
                v: "\ud835\ude37",
                w: "\ud835\ude38",
                x: "\ud835\ude39",
                y: "\ud835\ude3a",
                z: "\ud835\ude3b",
                A: "\ud835\ude08",
                B: "\ud835\ude09",
                C: "\ud835\ude0a",
                D: "\ud835\ude0b",
                E: "\ud835\ude0c",
                F: "\ud835\ude0d",
                G: "\ud835\ude0e",
                H: "\ud835\ude0f",
                I: "\ud835\ude10",
                J: "\ud835\ude11",
                K: "\ud835\ude12",
                L: "\ud835\ude13",
                M: "\ud835\ude14",
                N: "\ud835\ude15",
                O: "\ud835\ude16",
                P: "\ud835\ude17",
                Q: "\ud835\ude18",
                R: "\ud835\ude19",
                S: "\ud835\ude1a",
                T: "\ud835\ude1b",
                U: "\ud835\ude1c",
                V: "\ud835\ude1d",
                W: "\ud835\ude1e",
                X: "\ud835\ude1f",
                Y: "\ud835\ude20",
                Z: "\ud835\ude21",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            italic_bold: {
                a: "\ud835\ude56",
                b: "\ud835\ude57",
                c: "\ud835\ude58",
                d: "\ud835\ude59",
                e: "\ud835\ude5a",
                f: "\ud835\ude5b",
                g: "\ud835\ude5c",
                h: "\ud835\ude5d",
                i: "\ud835\ude5e",
                j: "\ud835\ude5f",
                k: "\ud835\ude60",
                l: "\ud835\ude61",
                m: "\ud835\ude62",
                n: "\ud835\ude63",
                o: "\ud835\ude64",
                p: "\ud835\ude65",
                q: "\ud835\ude66",
                r: "\ud835\ude67",
                s: "\ud835\ude68",
                t: "\ud835\ude69",
                u: "\ud835\ude6a",
                v: "\ud835\ude6b",
                w: "\ud835\ude6c",
                x: "\ud835\ude6d",
                y: "\ud835\ude6e",
                z: "\ud835\ude6f",
                A: "\ud835\ude3c",
                B: "\ud835\ude3d",
                C: "\ud835\ude3e",
                D: "\ud835\ude3f",
                E: "\ud835\ude40",
                F: "\ud835\ude41",
                G: "\ud835\ude42",
                H: "\ud835\ude43",
                I: "\ud835\ude44",
                J: "\ud835\ude45",
                K: "\ud835\ude46",
                L: "\ud835\ude47",
                M: "\ud835\ude48",
                N: "\ud835\ude49",
                O: "\ud835\ude4a",
                P: "\ud835\ude4b",
                Q: "\ud835\ude4c",
                R: "\ud835\ude4d",
                S: "\ud835\ude4e",
                T: "\ud835\ude4f",
                U: "\ud835\ude50",
                V: "\ud835\ude51",
                W: "\ud835\ude52",
                X: "\ud835\ude53",
                Y: "\ud835\ude54",
                Z: "\ud835\ude55",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            monospace: {
                a: "\ud835\ude8a",
                b: "\ud835\ude8b",
                c: "\ud835\ude8c",
                d: "\ud835\ude8d",
                e: "\ud835\ude8e",
                f: "\ud835\ude8f",
                g: "\ud835\ude90",
                h: "\ud835\ude91",
                i: "\ud835\ude92",
                j: "\ud835\ude93",
                k: "\ud835\ude94",
                l: "\ud835\ude95",
                m: "\ud835\ude96",
                n: "\ud835\ude97",
                o: "\ud835\ude98",
                p: "\ud835\ude99",
                q: "\ud835\ude9a",
                r: "\ud835\ude9b",
                s: "\ud835\ude9c",
                t: "\ud835\ude9d",
                u: "\ud835\ude9e",
                v: "\ud835\ude9f",
                w: "\ud835\udea0",
                x: "\ud835\udea1",
                y: "\ud835\udea2",
                z: "\ud835\udea3",
                A: "\ud835\ude70",
                B: "\ud835\ude71",
                C: "\ud835\ude72",
                D: "\ud835\ude73",
                E: "\ud835\ude74",
                F: "\ud835\ude75",
                G: "\ud835\ude76",
                H: "\ud835\ude77",
                I: "\ud835\ude78",
                J: "\ud835\ude79",
                K: "\ud835\ude7a",
                L: "\ud835\ude7b",
                M: "\ud835\ude7c",
                N: "\ud835\ude7d",
                O: "\ud835\ude7e",
                P: "\ud835\ude7f",
                Q: "\ud835\ude80",
                R: "\ud835\ude81",
                S: "\ud835\ude82",
                T: "\ud835\ude83",
                U: "\ud835\ude84",
                V: "\ud835\ude85",
                W: "\ud835\ude86",
                X: "\ud835\ude87",
                Y: "\ud835\ude88",
                Z: "\ud835\ude89",
                0: "\ud835\udff6",
                1: "\ud835\udff7",
                2: "\ud835\udff8",
                3: "\ud835\udff9",
                4: "\ud835\udffa",
                5: "\ud835\udffb",
                6: "\ud835\udffc",
                7: "\ud835\udffd",
                8: "\ud835\udffe",
                9: "\ud835\udfff"
            },
            upside_down: {
                a: "\u0250",
                b: "q",
                c: "\u0254",
                d: "p",
                e: "\u01dd",
                f: "\u025f",
                g: "\u0183",
                h: "\u0265",
                i: "\u0131",
                j: "\u027e",
                k: "\u029e",
                l: "l",
                m: "\u026f",
                n: "u",
                o: "o",
                p: "d",
                q: "b",
                r: "\u0279",
                s: "s",
                t: "\u0287",
                u: "n",
                v: "\u028c",
                w: "\u028d",
                x: "x",
                y: "\u028e",
                z: "z",
                A: "\u0250",
                B: "q",
                C: "\u0254",
                D: "p",
                E: "\u01dd",
                F: "\u025f",
                G: "\u0183",
                H: "\u0265",
                I: "\u0131",
                J: "\u027e",
                K: "\u029e",
                L: "l",
                M: "\u026f",
                N: "u",
                O: "o",
                P: "d",
                Q: "b",
                R: "\u0279",
                S: "s",
                T: "\u0287",
                U: "n",
                V: "\u028c",
                W: "\u028d",
                X: "x",
                Y: "\u028e",
                Z: "z",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            strike_through: {
                a: "a\u0336",
                b: "b\u0336",
                c: "c\u0336",
                d: "d\u0336",
                e: "e\u0336",
                f: "f\u0336",
                g: "g\u0336",
                h: "h\u0336",
                i: "i\u0336",
                j: "j\u0336",
                k: "k\u0336",
                l: "l\u0336",
                m: "m\u0336",
                n: "n\u0336",
                o: "o\u0336",
                p: "p\u0336",
                q: "q\u0336",
                r: "r\u0336",
                s: "s\u0336",
                t: "t\u0336",
                u: "u\u0336",
                v: "v\u0336",
                w: "w\u0336",
                x: "x\u0336",
                y: "y\u0336",
                z: "z\u0336",
                A: "A\u0336",
                B: "B\u0336",
                C: "C\u0336",
                D: "D\u0336",
                E: "E\u0336",
                F: "F\u0336",
                G: "G\u0336",
                H: "H\u0336",
                I: "I\u0336",
                J: "J\u0336",
                K: "K\u0336",
                L: "L\u0336",
                M: "M\u0336",
                N: "N\u0336",
                O: "O\u0336",
                P: "P\u0336",
                Q: "Q\u0336",
                R: "R\u0336",
                S: "S\u0336",
                T: "T\u0336",
                U: "U\u0336",
                V: "V\u0336",
                W: "W\u0336",
                X: "X\u0336",
                Y: "Y\u0336",
                Z: "Z\u0336",
                0: "0\u0336",
                1: "1\u0336",
                2: "2\u0336",
                3: "3\u0336",
                4: "4\u0336",
                5: "5\u0336",
                6: "6\u0336",
                7: "7\u0336",
                8: "8\u0336",
                9: "9\u0336"
            },
            tilde_through: {
                a: "a\u0334",
                b: "b\u0334",
                c: "c\u0334",
                d: "d\u0334",
                e: "e\u0334",
                f: "f\u0334",
                g: "g\u0334",
                h: "h\u0334",
                i: "i\u0334",
                j: "j\u0334",
                k: "k\u0334",
                l: "l\u0334",
                m: "m\u0334",
                n: "n\u0334",
                o: "o\u0334",
                p: "p\u0334",
                q: "q\u0334",
                r: "r\u0334",
                s: "s\u0334",
                t: "t\u0334",
                u: "u\u0334",
                v: "v\u0334",
                w: "w\u0334",
                x: "x\u0334",
                y: "y\u0334",
                z: "z\u0334",
                A: "A\u0334",
                B: "B\u0334",
                C: "C\u0334",
                D: "D\u0334",
                E: "E\u0334",
                F: "F\u0334",
                G: "G\u0334",
                H: "H\u0334",
                I: "I\u0334",
                J: "J\u0334",
                K: "K\u0334",
                L: "L\u0334",
                M: "M\u0334",
                N: "N\u0334",
                O: "O\u0334",
                P: "P\u0334",
                Q: "Q\u0334",
                R: "R\u0334",
                S: "S\u0334",
                T: "T\u0334",
                U: "U\u0334",
                V: "V\u0334",
                W: "W\u0334",
                X: "X\u0334",
                Y: "Y\u0334",
                Z: "Z\u0334",
                0: "0\u0334",
                1: "1\u0334",
                2: "2\u0334",
                3: "3\u0334",
                4: "4\u0334",
                5: "5\u0334",
                6: "6\u0334",
                7: "7\u0334",
                8: "8\u0334",
                9: "9\u0334"
            },
            slash_through: {
                a: "a\u0337",
                b: "b\u0337",
                c: "c\u0337",
                d: "d\u0337",
                e: "e\u0337",
                f: "f\u0337",
                g: "g\u0337",
                h: "h\u0337",
                i: "i\u0337",
                j: "j\u0337",
                k: "k\u0337",
                l: "l\u0337",
                m: "m\u0337",
                n: "n\u0337",
                o: "o\u0337",
                p: "p\u0337",
                q: "q\u0337",
                r: "r\u0337",
                s: "s\u0337",
                t: "t\u0337",
                u: "u\u0337",
                v: "v\u0337",
                w: "w\u0337",
                x: "x\u0337",
                y: "y\u0337",
                z: "z\u0337",
                A: "A\u0337",
                B: "B\u0337",
                C: "C\u0337",
                D: "D\u0337",
                E: "E\u0337",
                F: "F\u0337",
                G: "G\u0337",
                H: "H\u0337",
                I: "I\u0337",
                J: "J\u0337",
                K: "K\u0337",
                L: "L\u0337",
                M: "M\u0337",
                N: "N\u0337",
                O: "O\u0337",
                P: "P\u0337",
                Q: "Q\u0337",
                R: "R\u0337",
                S: "S\u0337",
                T: "T\u0337",
                U: "U\u0337",
                V: "V\u0337",
                W: "W\u0337",
                X: "X\u0337",
                Y: "Y\u0337",
                Z: "Z\u0337",
                0: "0\u0337",
                1: "1\u0337",
                2: "2\u0337",
                3: "3\u0337",
                4: "4\u0337",
                5: "5\u0337",
                6: "6\u0337",
                7: "7\u0337",
                8: "8\u0337",
                9: "9\u0337"
            },
            underline: {
                a: "a\u0332",
                b: "b\u0332",
                c: "c\u0332",
                d: "d\u0332",
                e: "e\u0332",
                f: "f\u0332",
                g: "g\u0332",
                h: "h\u0332",
                i: "i\u0332",
                j: "j\u0332",
                k: "k\u0332",
                l: "l\u0332",
                m: "m\u0332",
                n: "n\u0332",
                o: "o\u0332",
                p: "p\u0332",
                q: "q\u0332",
                r: "r\u0332",
                s: "s\u0332",
                t: "t\u0332",
                u: "u\u0332",
                v: "v\u0332",
                w: "w\u0332",
                x: "x\u0332",
                y: "y\u0332",
                z: "z\u0332",
                A: "A\u0332",
                B: "B\u0332",
                C: "C\u0332",
                D: "D\u0332",
                E: "E\u0332",
                F: "F\u0332",
                G: "G\u0332",
                H: "H\u0332",
                I: "I\u0332",
                J: "J\u0332",
                K: "K\u0332",
                L: "L\u0332",
                M: "M\u0332",
                N: "N\u0332",
                O: "O\u0332",
                P: "P\u0332",
                Q: "Q\u0332",
                R: "R\u0332",
                S: "S\u0332",
                T: "T\u0332",
                U: "U\u0332",
                V: "V\u0332",
                W: "W\u0332",
                X: "X\u0332",
                Y: "Y\u0332",
                Z: "Z\u0332",
                0: "0\u0332",
                1: "1\u0332",
                2: "2\u0332",
                3: "3\u0332",
                4: "4\u0332",
                5: "5\u0332",
                6: "6\u0332",
                7: "7\u0332",
                8: "8\u0332",
                9: "9\u0332"
            },
            double_underline: {
                a: "a\u0333",
                b: "b\u0333",
                c: "c\u0333",
                d: "d\u0333",
                e: "e\u0333",
                f: "f\u0333",
                g: "g\u0333",
                h: "h\u0333",
                i: "i\u0333",
                j: "j\u0333",
                k: "k\u0333",
                l: "l\u0333",
                m: "m\u0333",
                n: "n\u0333",
                o: "o\u0333",
                p: "p\u0333",
                q: "q\u0333",
                r: "r\u0333",
                s: "s\u0333",
                t: "t\u0333",
                u: "u\u0333",
                v: "v\u0333",
                w: "w\u0333",
                x: "x\u0333",
                y: "y\u0333",
                z: "z\u0333",
                A: "A\u0333",
                B: "B\u0333",
                C: "C\u0333",
                D: "D\u0333",
                E: "E\u0333",
                F: "F\u0333",
                G: "G\u0333",
                H: "H\u0333",
                I: "I\u0333",
                J: "J\u0333",
                K: "K\u0333",
                L: "L\u0333",
                M: "M\u0333",
                N: "N\u0333",
                O: "O\u0333",
                P: "P\u0333",
                Q: "Q\u0333",
                R: "R\u0333",
                S: "S\u0333",
                T: "T\u0333",
                U: "U\u0333",
                V: "V\u0333",
                W: "W\u0333",
                X: "X\u0333",
                Y: "Y\u0333",
                Z: "Z\u0333",
                0: "0\u0333",
                1: "1\u0333",
                2: "2\u0333",
                3: "3\u0333",
                4: "4\u0333",
                5: "5\u0333",
                6: "6\u0333",
                7: "7\u0333",
                8: "8\u0333",
                9: "9\u0333"
            },
            spaced_out: {
                a: "\uff41",
                b: "\uff42",
                c: "\uff43",
                d: "\uff44",
                e: "\uff45",
                f: "\uff46",
                g: "\uff47",
                h: "\uff48",
                i: "\uff49",
                j: "\uff4a",
                k: "\uff4b",
                l: "\uff4c",
                m: "\uff4d",
                n: "\uff4e",
                o: "\uff4f",
                p: "\uff50",
                q: "\uff51",
                r: "\uff52",
                s: "\uff53",
                t: "\uff54",
                u: "\uff55",
                v: "\uff56",
                w: "\uff57",
                x: "\uff58",
                y: "\uff59",
                z: "\uff5a",
                A: "\uff21",
                B: "\uff22",
                C: "\uff23",
                D: "\uff24",
                E: "\uff25",
                F: "\uff26",
                G: "\uff27",
                H: "\uff28",
                I: "\uff29",
                J: "\uff2a",
                K: "\uff2b",
                L: "\uff2c",
                M: "\uff2d",
                N: "\uff2e",
                O: "\uff2f",
                P: "\uff30",
                Q: "\uff31",
                R: "\uff32",
                S: "\uff33",
                T: "\uff34",
                U: "\uff35",
                V: "\uff36",
                W: "\uff37",
                X: "\uff38",
                Y: "\uff39",
                Z: "\uff3a",
                0: "\uff10",
                1: "\uff11",
                2: "\uff12",
                3: "\uff13",
                4: "\uff14",
                5: "\uff15",
                6: "\uff16",
                7: "\uff17",
                8: "\uff18",
                9: "\uff19"
            },
            all_caps: {
                a: "\u1d00",
                b: "\u0299",
                c: "\u1d04",
                d: "\u1d05",
                e: "\u1d07",
                f: "\u0493",
                g: "\u0262",
                h: "\u029c",
                i: "\u026a",
                j: "\u1d0a",
                k: "\u1d0b",
                l: "\u029f",
                m: "\u1d0d",
                n: "\u0274",
                o: "\u1d0f",
                p: "\u1d18",
                q: "\u01eb",
                r: "\u0280",
                s: "s",
                t: "\u1d1b",
                u: "\u1d1c",
                v: "\u1d20",
                w: "\u1d21",
                x: "x",
                y: "\u028f",
                z: "\u1d22",
                A: "\u1d00",
                B: "\u0299",
                C: "\u1d04",
                D: "\u1d05",
                E: "\u1d07",
                F: "\u0493",
                G: "\u0262",
                H: "\u029c",
                I: "\u026a",
                J: "\u1d0a",
                K: "\u1d0b",
                L: "\u029f",
                M: "\u1d0d",
                N: "\u0274",
                O: "\u1d0f",
                P: "\u1d18",
                Q: "\u01eb",
                R: "\u0280",
                S: "s",
                T: "\u1d1b",
                U: "\u1d1c",
                V: "\u1d20",
                W: "\u1d21",
                X: "x",
                Y: "\u028f",
                Z: "\u1d22",
                0: "\ud835\udff6",
                1: "\ud835\udff7",
                2: "\ud835\udff8",
                3: "\ud835\udff9",
                4: "\ud835\udffa",
                5: "\ud835\udffb",
                6: "\ud835\udffc",
                7: "\ud835\udffd",
                8: "\ud835\udffe",
                9: "\ud835\udfff"
            },
            double_line: {
                a: "\ud835\udc82\u0332\u0305",
                b: "\ud835\udc83\u0332\u0305",
                c: "\ud835\udc84\u0332\u0305",
                d: "\ud835\udc85\u0332\u0305",
                e: "\ud835\udc86\u0332\u0305",
                f: "\ud835\udc87\u0332\u0305",
                g: "\ud835\udc88\u0332\u0305",
                h: "\ud835\udc89\u0332\u0305",
                i: "\ud835\udc8a\u0332\u0305",
                j: "\ud835\udc8b\u0332\u0305",
                k: "\ud835\udc8c\u0332\u0305",
                l: "\ud835\udc8d\u0332\u0305",
                m: "\ud835\udc8e\u0332\u0305",
                n: "\ud835\udc8f\u0332\u0305",
                o: "\ud835\udc90\u0332\u0305",
                p: "\ud835\udc91\u0332\u0305",
                q: "\ud835\udc92\u0332\u0305",
                r: "\ud835\udc93\u0332\u0305",
                s: "\ud835\udc94\u0332\u0305",
                t: "\ud835\udc95\u0332\u0305",
                u: "\ud835\udc96\u0332\u0305",
                v: "\ud835\udc97\u0332\u0305",
                w: "\ud835\udc98\u0332\u0305",
                x: "\ud835\udc99\u0332\u0305",
                y: "\ud835\udc9a\u0332\u0305",
                z: "\ud835\udc9b\u0332\u0305",
                A: "\ud835\udc68\u0332\u0305",
                B: "\ud835\udc69\u0332\u0305",
                C: "\ud835\udc6a\u0332\u0305",
                D: "\ud835\udc6b\u0332\u0305",
                E: "\ud835\udc6c\u0332\u0305",
                F: "\ud835\udc6d\u0332\u0305",
                G: "\ud835\udc6e\u0332\u0305",
                H: "\ud835\udc6f\u0332\u0305",
                I: "\ud835\udc70\u0332\u0305",
                J: "\ud835\udc71\u0332\u0305",
                K: "\ud835\udc72\u0332\u0305",
                L: "\ud835\udc73\u0332\u0305",
                M: "\ud835\udc74\u0332\u0305",
                N: "\ud835\udc75\u0332\u0305",
                O: "\ud835\udc76\u0332\u0305",
                P: "\ud835\udc77\u0332\u0305",
                Q: "\ud835\udc78\u0332\u0305",
                R: "\ud835\udc79\u0332\u0305",
                S: "\ud835\udc7a\u0332\u0305",
                T: "\ud835\udc7b\u0332\u0305",
                U: "\ud835\udc7c\u0332\u0305",
                V: "\ud835\udc7d\u0332\u0305",
                W: "\ud835\udc7e\u0332\u0305",
                X: "\ud835\udc7f\u0332\u0305",
                Y: "\ud835\udc80\u0332\u0305",
                Z: "\ud835\udc81\u0332\u0305",
                0: "0\u0332\u0305",
                1: "1\u0332\u0305",
                2: "2\u0332\u0305",
                3: "3\u0332\u0305",
                4: "4\u0332\u0305",
                5: "5\u0332\u0305",
                6: "6\u0332\u0305",
                7: "7\u0332\u0305",
                8: "8\u0332\u0305",
                9: "9\u0332\u0305"
            },
            double_dot: {
                a: "\xe4\u0324\u0308",
                b: "b\u0324\u0308\u0308",
                c: "c\u0324\u0308\u0308",
                d: "d\u0324\u0308\u0308",
                e: "\xeb\u0324\u0308",
                f: "f\u0324\u0308\u0308",
                g: "g\u0324\u0308\u0308",
                h: "\u1e27\u0324\u0308",
                i: "\xef\u0324\u0308",
                j: "j\u0324\u0308\u0308",
                k: "k\u0324\u0308\u0308",
                l: "l\u0324\u0308\u0308",
                m: "m\u0324\u0308\u0308",
                n: "n\u0324\u0308\u0308",
                o: "\xf6\u0324\u0308",
                p: "p\u0324\u0308\u0308",
                q: "q\u0324\u0308\u0308",
                r: "r\u0324\u0308\u0308",
                s: "s\u0324\u0308\u0308",
                t: "\u1e97\u0324\u0308",
                u: "\u1e73\u0308\u0308",
                v: "v\u0324\u0308\u0308",
                w: "\u1e85\u0324\u0308",
                x: "\u1e8d\u0324\u0308",
                y: "\xff\u0324\u0308",
                z: "z\u0324\u0308\u0308",
                A: "\xc4\u0324\u0308",
                B: "B\u0324\u0308\u0308",
                C: "C\u0324\u0308\u0308",
                D: "D\u0324\u0308\u0308",
                E: "\xcb\u0324\u0308",
                F: "F\u0324\u0308\u0308",
                G: "G\u0324\u0308\u0308",
                H: "\u1e26\u0324\u0308",
                I: "\xcf\u0324\u0308",
                J: "J\u0324\u0308\u0308",
                K: "K\u0324\u0308\u0308",
                L: "L\u0324\u0308\u0308",
                M: "M\u0324\u0308\u0308",
                N: "N\u0324\u0308\u0308",
                O: "\xd6\u0324\u0308",
                P: "P\u0324\u0308\u0308",
                Q: "Q\u0324\u0308\u0308",
                R: "R\u0324\u0308\u0308",
                S: "S\u0324\u0308\u0308",
                T: "T\u0324\u0308\u0308",
                U: "\u1e72\u0308\u0308",
                V: "V\u0324\u0308\u0308",
                W: "\u1e84\u0324\u0308",
                X: "\u1e8c\u0324\u0308",
                Y: "\u0178\u0324\u0308",
                Z: "Z\u0324\u0308\u0308",
                0: "0\u0324\u0308\u0308",
                1: "1\u0324\u0308\u0308",
                2: "2\u0324\u0308\u0308",
                3: "3\u0324\u0308\u0308",
                4: "4\u0324\u0308\u0308",
                5: "5\u0324\u0308\u0308",
                6: "6\u0324\u0308\u0308",
                7: "7\u0324\u0308\u0308",
                8: "8\u0324\u0308\u0308",
                9: "9\u0324\u0324\u0308"
            },
            x_above_below: {
                a: "a\u0353\u033d",
                b: "b\u0353\u033d",
                c: "c\u0353\u033d",
                d: "d\u0353\u033d",
                e: "e\u0353\u033d",
                f: "f\u0353\u033d",
                g: "g\u0353\u033d",
                h: "h\u0353\u033d",
                i: "i\u0353\u033d",
                j: "j\u0353\u033d",
                k: "k\u0353\u033d",
                l: "l\u0353\u033d",
                m: "m\u0353\u033d",
                n: "n\u0353\u033d",
                o: "o\u0353\u033d",
                p: "p\u0353\u033d",
                q: "q\u0353\u033d",
                r: "r\u0353\u033d",
                s: "s\u0353\u033d",
                t: "t\u0353\u033d",
                u: "u\u0353\u033d",
                v: "v\u0353\u033d",
                w: "w\u0353\u033d",
                x: "x\u0353\u033d",
                y: "y\u0353\u033d",
                z: "z\u0353\u033d",
                A: "A\u0353\u033d",
                B: "B\u0353\u033d",
                C: "C\u0353\u033d",
                D: "D\u0353\u033d",
                E: "E\u0353\u033d",
                F: "F\u0353\u033d",
                G: "G\u0353\u033d",
                H: "H\u0353\u033d",
                I: "I\u0353\u033d",
                J: "J\u0353\u033d",
                K: "K\u0353\u033d",
                L: "L\u0353\u033d",
                M: "M\u0353\u033d",
                N: "N\u0353\u033d",
                O: "O\u0353\u033d",
                P: "P\u0353\u033d",
                Q: "Q\u0353\u033d",
                R: "R\u0353\u033d",
                S: "S\u0353\u033d",
                T: "T\u0353\u033d",
                U: "U\u0353\u033d",
                V: "V\u0353\u033d",
                W: "W\u0353\u033d",
                X: "X\u0353\u033d",
                Y: "Y\u0353\u033d",
                Z: "Z\u0353\u033d",
                0: "0\u0353\u033d",
                1: "1\u0353\u033d",
                2: "2\u0353\u033d",
                3: "3\u0353\u033d",
                4: "4\u0353\u033d",
                5: "5\u0353\u033d",
                6: "6\u0353\u033d",
                7: "7\u0353\u033d",
                8: "8\u0353\u033d",
                9: "9\u0353\u033d"
            },
            x_below: {
                a: "a\u0353",
                b: "b\u0353",
                c: "c\u0353",
                d: "d\u0353",
                e: "e\u0353",
                f: "f\u0353",
                g: "g\u0353",
                h: "h\u0353",
                i: "i\u0353",
                j: "j\u0353",
                k: "k\u0353",
                l: "l\u0353",
                m: "m\u0353",
                n: "n\u0353",
                o: "o\u0353",
                p: "p\u0353",
                q: "q\u0353",
                r: "r\u0353",
                s: "s\u0353",
                t: "t\u0353",
                u: "u\u0353",
                v: "v\u0353",
                w: "w\u0353",
                x: "x\u0353",
                y: "y\u0353",
                z: "z\u0353",
                A: "A\u0353",
                B: "B\u0353",
                C: "C\u0353",
                D: "D\u0353",
                E: "E\u0353",
                F: "F\u0353",
                G: "G\u0353",
                H: "H\u0353",
                I: "I\u0353",
                J: "J\u0353",
                K: "K\u0353",
                L: "L\u0353",
                M: "M\u0353",
                N: "N\u0353",
                O: "O\u0353",
                P: "P\u0353",
                Q: "Q\u0353",
                R: "R\u0353",
                S: "S\u0353",
                T: "T\u0353",
                U: "U\u0353",
                V: "V\u0353",
                W: "W\u0353",
                X: "X\u0353",
                Y: "Y\u0353",
                Z: "Z\u0353",
                0: "0\u0353",
                1: "1\u0353",
                2: "2\u0353",
                3: "3\u0353",
                4: "4\u0353",
                5: "5\u0353",
                6: "6\u0353",
                7: "7\u0353",
                8: "8\u0353",
                9: "9\u0353"
            },
            double_slash: {
                a: "a\u0337",
                b: "b\u0337",
                c: "c\u0337",
                d: "d\u0337",
                e: "e\u0337",
                f: "f\u0337",
                g: "g\u0337",
                h: "h\u0337",
                i: "i\u0337",
                j: "j\u0337",
                k: "k\u0337",
                l: "l\u0337",
                m: "m\u0337",
                n: "n\u0337",
                o: "o\u0337",
                p: "p\u0337",
                q: "q\u0337",
                r: "r\u0337",
                s: "s\u0337",
                t: "t\u0337",
                u: "u\u0337",
                v: "v\u0337",
                w: "w\u0337",
                x: "x\u0337",
                y: "y\u0337",
                z: "z\u0337",
                A: "A\u0337",
                B: "B\u0337",
                C: "C\u0337",
                D: "D\u0337",
                E: "E\u0337",
                F: "F\u0337",
                G: "G\u0337",
                H: "H\u0337",
                I: "I\u0337",
                J: "J\u0337",
                K: "K\u0337",
                L: "L\u0337",
                M: "M\u0337",
                N: "N\u0337",
                O: "O\u0337",
                P: "P\u0337",
                Q: "Q\u0337",
                R: "R\u0337",
                S: "S\u0337",
                T: "T\u0337",
                U: "U\u0337",
                V: "V\u0337",
                W: "W\u0337",
                X: "X\u0337",
                Y: "Y\u0337",
                Z: "Z\u0337",
                0: "0\u0337",
                1: "1\u0337",
                2: "2\u0337",
                3: "3\u0337",
                4: "4\u0337",
                5: "5\u0337",
                6: "6\u0337",
                7: "7\u0337",
                8: "8\u0337",
                9: "9\u0337"
            },
            asterisk_below: {
                a: "a\u0359",
                b: "b\u0359",
                c: "c\u0359",
                d: "d\u0359",
                e: "e\u0359",
                f: "f\u0359",
                g: "g\u0359",
                h: "h\u0359",
                i: "i\u0359",
                j: "j\u0359",
                k: "k\u0359",
                l: "l\u0359",
                m: "m\u0359",
                n: "n\u0359",
                o: "o\u0359",
                p: "p\u0359",
                q: "q\u0359",
                r: "r\u0359",
                s: "s\u0359",
                t: "t\u0359",
                u: "u\u0359",
                v: "v\u0359",
                w: "w\u0359",
                x: "x\u0359",
                y: "y\u0359",
                z: "z\u0359",
                A: "A\u0359",
                B: "B\u0359",
                C: "C\u0359",
                D: "D\u0359",
                E: "E\u0359",
                F: "F\u0359",
                G: "G\u0359",
                H: "H\u0359",
                I: "I\u0359",
                J: "J\u0359",
                K: "K\u0359",
                L: "L\u0359",
                M: "M\u0359",
                N: "N\u0359",
                O: "O\u0359",
                P: "P\u0359",
                Q: "Q\u0359",
                R: "R\u0359",
                S: "S\u0359",
                T: "T\u0359",
                U: "U\u0359",
                V: "V\u0359",
                W: "W\u0359",
                X: "X\u0359",
                Y: "Y\u0359",
                Z: "Z\u0359",
                0: "0\u0359",
                1: "1\u0359",
                2: "2\u0359",
                3: "3\u0359",
                4: "4\u0359",
                5: "5\u0359",
                6: "6\u0359",
                7: "7\u0359",
                8: "8\u0359",
                9: "9\u0359"
            }
        },
        fancy: {
            double_struck: {
                a: "\ud835\udd52",
                b: "\ud835\udd53",
                c: "\ud835\udd54",
                d: "\ud835\udd55",
                e: "\ud835\udd56",
                f: "\ud835\udd57",
                g: "\ud835\udd58",
                h: "\ud835\udd59",
                i: "\ud835\udd5a",
                j: "\ud835\udd5b",
                k: "\ud835\udd5c",
                l: "\ud835\udd5d",
                m: "\ud835\udd5e",
                n: "\ud835\udd5f",
                o: "\ud835\udd60",
                p: "\ud835\udd61",
                q: "\ud835\udd62",
                r: "\ud835\udd63",
                s: "\ud835\udd64",
                t: "\ud835\udd65",
                u: "\ud835\udd66",
                v: "\ud835\udd67",
                w: "\ud835\udd68",
                x: "\ud835\udd69",
                y: "\ud835\udd6a",
                z: "\ud835\udd6b",
                A: "\ud835\udd38",
                B: "\ud835\udd39",
                C: "\u2102",
                D: "\ud835\udd3b",
                E: "\ud835\udd3c",
                F: "\ud835\udd3d",
                G: "\ud835\udd3e",
                H: "\u210d",
                I: "\ud835\udd40",
                J: "\ud835\udd41",
                K: "\ud835\udd42",
                L: "\ud835\udd43",
                M: "\ud835\udd44",
                N: "\u2115",
                O: "\ud835\udd46",
                P: "\u2119",
                Q: "\u211a",
                R: "\u211d",
                S: "\ud835\udd4a",
                T: "\ud835\udd4b",
                U: "\ud835\udd4c",
                V: "\ud835\udd4d",
                W: "\ud835\udd4e",
                X: "\ud835\udd4f",
                Y: "\ud835\udd50",
                Z: "\u2124",
                0: "\ud835\udfd8",
                1: "\ud835\udfd9",
                2: "\ud835\udfda",
                3: "\ud835\udfdb",
                4: "\ud835\udfdc",
                5: "\ud835\udfdd",
                6: "\ud835\udfde",
                7: "\ud835\udfdf",
                8: "\ud835\udfe0",
                9: "\ud835\udfe1"
            },
            black_letter_regular: {
                a: "\ud835\udd1e",
                b: "\ud835\udd1f",
                c: "\ud835\udd20",
                d: "\ud835\udd21",
                e: "\ud835\udd22",
                f: "\ud835\udd23",
                g: "\ud835\udd24",
                h: "\ud835\udd25",
                i: "\ud835\udd26",
                j: "\ud835\udd27",
                k: "\ud835\udd28",
                l: "\ud835\udd29",
                m: "\ud835\udd2a",
                n: "\ud835\udd2b",
                o: "\ud835\udd2c",
                p: "\ud835\udd2d",
                q: "\ud835\udd2e",
                r: "\ud835\udd2f",
                s: "\ud835\udd30",
                t: "\ud835\udd31",
                u: "\ud835\udd32",
                v: "\ud835\udd33",
                w: "\ud835\udd34",
                x: "\ud835\udd35",
                y: "\ud835\udd36",
                z: "\ud835\udd37",
                A: "\ud835\udd04",
                B: "\ud835\udd05",
                C: "\u212d",
                D: "\ud835\udd07",
                E: "\ud835\udd08",
                F: "\ud835\udd09",
                G: "\ud835\udd0a",
                H: "\u210c",
                I: "\u2111",
                J: "\ud835\udd0d",
                K: "\ud835\udd0e",
                L: "\ud835\udd0f",
                M: "\ud835\udd10",
                N: "\ud835\udd11",
                O: "\ud835\udd12",
                P: "\ud835\udd13",
                Q: "\ud835\udd14",
                R: "\u211c",
                S: "\ud835\udd16",
                T: "\ud835\udd17",
                U: "\ud835\udd18",
                V: "\ud835\udd19",
                W: "\ud835\udd1a",
                X: "\ud835\udd1b",
                Y: "\ud835\udd1c",
                Z: "\u2128",
                0: "\u0585",
                1: "\u0575",
                2: "\u0577",
                3: "\u0545",
                4: "\u056f",
                5: "\u054f",
                6: "\u0573",
                7: "\u0534",
                8: "\u0551",
                9: "\u0563"
            },
            black_letter_bold: {
                a: "\ud835\udd86",
                b: "\ud835\udd87",
                c: "\ud835\udd88",
                d: "\ud835\udd89",
                e: "\ud835\udd8a",
                f: "\ud835\udd8b",
                g: "\ud835\udd8c",
                h: "\ud835\udd8d",
                i: "\ud835\udd8e",
                j: "\ud835\udd8f",
                k: "\ud835\udd90",
                l: "\ud835\udd91",
                m: "\ud835\udd92",
                n: "\ud835\udd93",
                o: "\ud835\udd94",
                p: "\ud835\udd95",
                q: "\ud835\udd96",
                r: "\ud835\udd97",
                s: "\ud835\udd98",
                t: "\ud835\udd99",
                u: "\ud835\udd9a",
                v: "\ud835\udd9b",
                w: "\ud835\udd9c",
                x: "\ud835\udd9d",
                y: "\ud835\udd9e",
                z: "\ud835\udd9f",
                A: "\ud835\udd6c",
                B: "\ud835\udd6d",
                C: "\ud835\udd6e",
                D: "\ud835\udd6f",
                E: "\ud835\udd70",
                F: "\ud835\udd71",
                G: "\ud835\udd72",
                H: "\ud835\udd73",
                I: "\ud835\udd74",
                J: "\ud835\udd75",
                K: "\ud835\udd76",
                L: "\ud835\udd77",
                M: "\ud835\udd78",
                N: "\ud835\udd79",
                O: "\ud835\udd7a",
                P: "\ud835\udd7b",
                Q: "\ud835\udd7c",
                R: "\ud835\udd7d",
                S: "\ud835\udd7e",
                T: "\ud835\udd7f",
                U: "\ud835\udd80",
                V: "\ud835\udd81",
                W: "\ud835\udd82",
                X: "\ud835\udd83",
                Y: "\ud835\udd84",
                Z: "\ud835\udd85",
                0: "\u0585",
                1: "\u0575",
                2: "\u0577",
                3: "\u0545",
                4: "\u056f",
                5: "\u054f",
                6: "\u0573",
                7: "\u0534",
                8: "\u0551",
                9: "\u0563"
            },
            script_regular: {
                a: "\ud835\udcb6",
                b: "\ud835\udcb7",
                c: "\ud835\udcb8",
                d: "\ud835\udcb9",
                e: "\ud835\udc52",
                f: "\ud835\udcbb",
                g: "\ud835\udc54",
                h: "\ud835\udcbd",
                i: "\ud835\udcbe",
                j: "\ud835\udcbf",
                k: "\ud835\udcc0",
                l: "\ud835\udcc1",
                m: "\ud835\udcc2",
                n: "\ud835\udcc3",
                o: "\ud835\udc5c",
                p: "\ud835\udcc5",
                q: "\ud835\udcc6",
                r: "\ud835\udcc7",
                s: "\ud835\udcc8",
                t: "\ud835\udcc9",
                u: "\ud835\udcca",
                v: "\ud835\udccb",
                w: "\ud835\udccc",
                x: "\ud835\udccd",
                y: "\ud835\udcce",
                z: "\ud835\udccf",
                A: "\ud835\udc9c",
                B: "\u212c",
                C: "\ud835\udc9e",
                D: "\ud835\udc9f",
                E: "\u2130",
                F: "\u2131",
                G: "\ud835\udca2",
                H: "\u210b",
                I: "\u2110",
                J: "\ud835\udca5",
                K: "\ud835\udca6",
                L: "\u2112",
                M: "\u2133",
                N: "\ud835\udca9",
                O: "\ud835\udcaa",
                P: "\ud835\udcab",
                Q: "\ud835\udcac",
                R: "\u211b",
                S: "\ud835\udcae",
                T: "\ud835\udcaf",
                U: "\ud835\udcb0",
                V: "\ud835\udcb1",
                W: "\ud835\udcb2",
                X: "\ud835\udcb3",
                Y: "\ud835\udcb4",
                Z: "\ud835\udcb5",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            script_bold: {
                a: "\ud835\udcea",
                b: "\ud835\udceb",
                c: "\ud835\udcec",
                d: "\ud835\udced",
                e: "\ud835\udcee",
                f: "\ud835\udcef",
                g: "\ud835\udcf0",
                h: "\ud835\udcf1",
                i: "\ud835\udcf2",
                j: "\ud835\udcf3",
                k: "\ud835\udcf4",
                l: "\ud835\udcf5",
                m: "\ud835\udcf6",
                n: "\ud835\udcf7",
                o: "\ud835\udcf8",
                p: "\ud835\udcf9",
                q: "\ud835\udcfa",
                r: "\ud835\udcfb",
                s: "\ud835\udcfc",
                t: "\ud835\udcfd",
                u: "\ud835\udcfe",
                v: "\ud835\udcff",
                w: "\ud835\udd00",
                x: "\ud835\udd01",
                y: "\ud835\udd02",
                z: "\ud835\udd03",
                A: "\ud835\udcd0",
                B: "\ud835\udcd1",
                C: "\ud835\udcd2",
                D: "\ud835\udcd3",
                E: "\ud835\udcd4",
                F: "\ud835\udcd5",
                G: "\ud835\udcd6",
                H: "\ud835\udcd7",
                I: "\ud835\udcd8",
                J: "\ud835\udcd9",
                K: "\ud835\udcda",
                L: "\ud835\udcdb",
                M: "\ud835\udcdc",
                N: "\ud835\udcdd",
                O: "\ud835\udcde",
                P: "\ud835\udcdf",
                Q: "\ud835\udce0",
                R: "\ud835\udce1",
                S: "\ud835\udce2",
                T: "\ud835\udce3",
                U: "\ud835\udce4",
                V: "\ud835\udce5",
                W: "\ud835\udce6",
                X: "\ud835\udce7",
                Y: "\ud835\udce8",
                Z: "\ud835\udce9",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            currency: {
                a: "\u20b3",
                b: "\u0e3f",
                c: "\u20b5",
                d: "\u0110",
                e: "\u0246",
                f: "\u20a3",
                g: "\u20b2",
                h: "\u2c67",
                i: "\u0142",
                j: "J",
                k: "\u20ad",
                l: "\u2c60",
                m: "\u20a5",
                n: "\u20a6",
                o: "\xd8",
                p: "\u20b1",
                q: "Q",
                r: "\u2c64",
                s: "\u20b4",
                t: "\u20ae",
                u: "\u0244",
                v: "V",
                w: "\u20a9",
                x: "\u04fe",
                y: "\u024e",
                z: "\u2c6b",
                A: "\u20b3",
                B: "\u0e3f",
                C: "\u20b5",
                D: "\u0110",
                E: "\u0246",
                F: "\u20a3",
                G: "\u20b2",
                H: "\u2c67",
                I: "\u0142",
                J: "J",
                K: "\u20ad",
                L: "\u2c60",
                M: "\u20a5",
                N: "\u20a6",
                O: "\xd8",
                P: "\u20b1",
                Q: "Q",
                R: "\u2c64",
                S: "\u20b4",
                T: "\u20ae",
                U: "\u0244",
                V: "V",
                W: "\u20a9",
                X: "\u04fe",
                Y: "\u024e",
                Z: "\u2c6b",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            animatrix: {
                a: "\u5342",
                b: "\u4e43",
                c: "\u531a",
                d: "\u15ea",
                e: "\u4e47",
                f: "\u5343",
                g: "\u13b6",
                h: "\u5344",
                i: "\u4e28",
                j: "\uff8c",
                k: "\u049c",
                l: "\u3125",
                m: "\u722a",
                n: "\u51e0",
                o: "\u3116",
                p: "\u5369",
                q: "\u024a",
                r: "\u5c3a",
                s: "\u4e02",
                t: "\u3112",
                u: "\u3129",
                v: "\u142f",
                w: "\u5c71",
                x: "\u4e42",
                y: "\u311a",
                z: "\u4e59",
                A: "\u5342",
                B: "\u4e43",
                C: "\u531a",
                D: "\u15ea",
                E: "\u4e47",
                F: "\u5343",
                G: "\u13b6",
                H: "\u5344",
                I: "\u4e28",
                J: "\uff8c",
                K: "\u049c",
                L: "\u3125",
                M: "\u722a",
                N: "\u51e0",
                O: "\u3116",
                P: "\u5369",
                Q: "\u024a",
                R: "\u5c3a",
                S: "\u4e02",
                T: "\u3112",
                U: "\u3129",
                V: "\u142f",
                W: "\u5c71",
                X: "\u4e42",
                Y: "\u311a",
                Z: "\u4e59",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            blade_runner: {
                a: "\uff91",
                b: "\u4e43",
                c: "\u1103",
                d: "\u308a",
                e: "\u4e47",
                f: "\uff77",
                g: "\u30e0",
                h: "\u3093",
                i: "\uff89",
                j: "\uff8c",
                k: "\u30ba",
                l: "\uff9a",
                m: "\uffb6",
                n: "\u5200",
                o: "\u306e",
                p: "\uff71",
                q: "\u3090",
                r: "\u5c3a",
                s: "\u4e02",
                t: "\uff72",
                u: "\u3072",
                v: "\u221a",
                w: "W",
                x: "\uff92",
                y: "\uff98",
                z: "\u4e59",
                A: "\uff91",
                B: "\u4e43",
                C: "\u1103",
                D: "\u308a",
                E: "\u4e47",
                F: "\uff77",
                G: "\u30e0",
                H: "\u3093",
                I: "\uff89",
                J: "\uff8c",
                K: "\u30ba",
                L: "\uff9a",
                M: "\uffb6",
                N: "\u5200",
                O: "\u306e",
                P: "\uff71",
                Q: "\u3090",
                R: "\u5c3a",
                S: "\u4e02",
                T: "\uff72",
                U: "\u3072",
                V: "\u221a",
                W: "W",
                X: "\uff92",
                Y: "\uff98",
                Z: "\u4e59",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            really_round: {
                a: "\u15e9",
                b: "\u15f7",
                c: "\u1455",
                d: "\u15ea",
                e: "E",
                f: "\u15b4",
                g: "G",
                h: "\u157c",
                i: "I",
                j: "\u148d",
                k: "K",
                l: "\u14aa",
                m: "\u15f0",
                n: "\u144e",
                o: "O",
                p: "\u146d",
                q: "\u146b",
                r: "\u1587",
                s: "\u1515",
                t: "T",
                u: "\u144c",
                v: "\u142f",
                w: "\u15ef",
                x: "\u166d",
                y: "Y",
                z: "\u1614",
                A: "\u15e9",
                B: "\u15f7",
                C: "\u1455",
                D: "\u15ea",
                E: "E",
                F: "\u15b4",
                G: "G",
                H: "\u157c",
                I: "I",
                J: "\u148d",
                K: "K",
                L: "\u14aa",
                M: "\u15f0",
                N: "\u144e",
                O: "O",
                P: "\u146d",
                Q: "\u146b",
                R: "\u1587",
                S: "\u1515",
                T: "T",
                U: "\u144c",
                V: "\u142f",
                W: "\u15ef",
                X: "\u166d",
                Y: "Y",
                Z: "\u1614",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            sparkle_motion: {
                a: "a\u0489",
                b: "b\u0489",
                c: "c\u0489",
                d: "d\u0489",
                e: "e\u0489",
                f: "f\u0489",
                g: "g\u0489",
                h: "h\u0489",
                i: "i\u0489",
                j: "j\u0489",
                k: "k\u0489",
                l: "l\u0489",
                m: "m\u0489",
                n: "n\u0489",
                o: "o\u0489",
                p: "p\u0489",
                q: "q\u0489",
                r: "r\u0489",
                s: "s\u0489",
                t: "t\u0489",
                u: "u\u0489",
                v: "v\u0489",
                w: "w\u0489",
                x: "x\u0489",
                y: "y\u0489",
                z: "z\u0489",
                A: "A\u0489",
                B: "B\u0489",
                C: "C\u0489",
                D: "D\u0489",
                E: "E\u0489",
                F: "F\u0489",
                G: "G\u0489",
                H: "H\u0489",
                I: "I\u0489",
                J: "J\u0489",
                K: "K\u0489",
                L: "L\u0489",
                M: "M\u0489",
                N: "N\u0489",
                O: "O\u0489",
                P: "P\u0489",
                Q: "Q\u0489",
                R: "R\u0489",
                S: "S\u0489",
                T: "T\u0489",
                U: "U\u0489",
                V: "V\u0489",
                W: "W\u0489",
                X: "X\u0489",
                Y: "Y\u0489",
                Z: "Z\u0489",
                0: "0\u0489",
                1: "1\u0489",
                2: "2\u0489",
                3: "3\u0489",
                4: "4\u0489",
                5: "5\u0489",
                6: "6\u0489",
                7: "7\u0489",
                8: "8\u0489",
                9: "9\u0489"
            },
            russian_bot: {
                a: "\u0434",
                b: "\u0431",
                c: "\u0441",
                d: "\u1d05",
                e: "\u0435",
                f: "\u0493",
                g: "\u0262\u0306",
                h: "\u043d",
                i: "\u0456",
                j: "\u1d0a",
                k: "\u043a",
                l: "\u029f",
                m: "\u043c",
                n: "\u043f",
                o: "\u043e",
                p: "\u0440",
                q: "\u03d9",
                r: "\u0433",
                s: "\u0455",
                t: "\u0442",
                u: "\u0446",
                v: "\u0475",
                w: "\u0448",
                x: "\u0445",
                y: "\u0447",
                z: "\u1d22",
                A: "\u0414",
                B: "\u0411",
                C: "\u0421",
                D: "\u010e",
                E: "\u0415",
                F: "\u0492",
                G: "\u011e",
                H: "\u041d",
                I: "\u0406",
                J: "\u0408",
                K: "\u041a",
                L: "L",
                M: "\u041c",
                N: "\u041f",
                O: "\u041e",
                P: "\u0420",
                Q: "\u03d8",
                R: "\u0413",
                S: "\u0405",
                T: "\u0422",
                U: "\u0426",
                V: "\u0474",
                W: "\u0428",
                X: "\u0425",
                Y: "\u0427",
                Z: "Z",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            super_greek: {
                a: "\u03bb",
                b: "\u03d0",
                c: "\u03c2",
                d: "d",
                e: "\u03b5",
                f: "\u0493",
                g: "\u03d1",
                h: "\u0262",
                i: "\u043d",
                j: "\u03b9",
                k: "\u03f3",
                l: "\u03ba",
                m: "l",
                n: "\u03fb",
                o: "\u03c0",
                p: "\u03c3",
                q: "\u03c1",
                r: "\u03c6",
                s: "\u0433",
                t: "s",
                u: "\u03c4",
                v: "\u03c5",
                w: "v",
                x: "\u0448",
                y: "\u03f0",
                z: "\u03c8",
                A: "\u0394",
                B: "\u0181",
                C: "C",
                D: "D",
                E: "\u03a3",
                F: "F",
                G: "G",
                H: "H",
                I: "I",
                J: "J",
                K: "\u0198",
                L: "L",
                M: "\u039c",
                N: "\u220f",
                O: "\u0398",
                P: "\u01a4",
                Q: "\u10b3",
                R: "\u0393",
                S: "\u0405",
                T: "\u01ac",
                U: "\u01b1",
                V: "\u01b2",
                W: "\u0428",
                X: "\u0416",
                Y: "\u03a8",
                Z: "Z",
                0: "z",
                1: "0",
                2: "1",
                3: "2",
                4: "3",
                5: "4",
                6: "5",
                7: "6",
                8: "7",
                9: "8"
            },
            squiggles: {
                a: "\u0e04",
                b: "\u0e56",
                c: "\xa2",
                d: "\u0ed3",
                e: "\u0113",
                f: "f",
                g: "\u0e87",
                h: "h",
                i: "i",
                j: "\u0e27",
                k: "k",
                l: "l",
                m: "\u0e53",
                n: "\u0e96",
                o: "\u0ed0",
                p: "p",
                q: "\u0e51",
                r: "r",
                s: "\u015e",
                t: "t",
                u: "\u0e19",
                v: "\u0e07",
                w: "\u0e9f",
                x: "x",
                y: "\u0e2f",
                z: "\u0e8a",
                A: "\u0e04",
                B: "\u0e56",
                C: "\xa2",
                D: "\u0ed3",
                E: "\u0113",
                F: "f",
                G: "\u0e87",
                H: "h",
                I: "i",
                J: "\u0e27",
                K: "k",
                L: "l",
                M: "\u0e53",
                N: "\u0e96",
                O: "\u0ed0",
                P: "p",
                Q: "\u0e51",
                R: "r",
                S: "\u015e",
                T: "t",
                U: "\u0e19",
                V: "\u0e07",
                W: "\u0e9f",
                X: "x",
                Y: "\u0e2f",
                Z: "\u0e8a",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            rainbow: {
                a: "a\u0361",
                b: "b\u0361",
                c: "c\u0361",
                d: "d\u0361",
                e: "e\u0361",
                f: "f\u0361",
                g: "g\u0361",
                h: "h\u0361",
                i: "i\u0361",
                j: "j\u0361",
                k: "k\u0361",
                l: "l\u0361",
                m: "m\u0361",
                n: "n\u0361",
                o: "o\u0361",
                p: "p\u0361",
                q: "q\u0361",
                r: "r\u0361",
                s: "s\u0361",
                t: "t\u0361",
                u: "u\u0361",
                v: "v\u0361",
                w: "w\u0361",
                x: "x\u0361",
                y: "y\u0361",
                z: "z\u0361",
                A: "A\u0361",
                B: "B\u0361",
                C: "C\u0361",
                D: "D\u0361",
                E: "E\u0361",
                F: "F\u0361",
                G: "G\u0361",
                H: "H\u0361",
                I: "I\u0361",
                J: "J\u0361",
                K: "K\u0361",
                L: "L\u0361",
                M: "M\u0361",
                N: "N\u0361",
                O: "O\u0361",
                P: "P\u0361",
                Q: "Q\u0361",
                R: "R\u0361",
                S: "S\u0361",
                T: "T\u0361",
                U: "U\u0361",
                V: "V\u0361",
                W: "W\u0361",
                X: "X\u0361",
                Y: "Y\u0361",
                Z: "Z\u0361",
                0: "0\u0361",
                1: "1\u0361",
                2: "2\u0361",
                3: "3\u0361",
                4: "4\u0361",
                5: "5\u0361",
                6: "6\u0361",
                7: "7\u0361",
                8: "8\u0361",
                9: "9\u0361"
            },
            elvish: {
                a: "\uaa96",
                b: "\u1947",
                c: "\u1974",
                d: "\u1994",
                e: "\uaac0",
                f: "\u183b",
                g: "\u19c1",
                h: "\uaadd",
                i: "\ua838",
                j: "\ua839",
                k: "\u16d5",
                l: "\uaab6",
                m: "\uaa91",
                n: "\uaa80",
                o: "\uaaae",
                p: "\u03c1",
                q: "\uaa87",
                r: "\u1945",
                s: "\u1993",
                t: "\uaabb",
                u: "\uaa8a",
                v: "\uaa9c",
                w: "\u1b59",
                x: "\u194a",
                y: "\uaa97",
                z: "\u01ba",
                A: "\uaa96",
                B: "\u1947",
                C: "\u1974",
                D: "\u1994",
                E: "\uaac0",
                F: "\u183b",
                G: "\u19c1",
                H: "\uaadd",
                I: "\ua838",
                J: "\ua839",
                K: "\u16d5",
                L: "\uaab6",
                M: "\uaa91",
                N: "\uaa80",
                O: "\uaaae",
                P: "\u03c1",
                Q: "\uaa87",
                R: "\u1945",
                S: "\u1993",
                T: "\uaabb",
                U: "\uaa8a",
                V: "\uaa9c",
                W: "\u1b59",
                X: "\u194a",
                Y: "\uaa97",
                Z: "\u01ba",
                0: "\u19b2",
                1: "\u19d2",
                2: "\u14bf",
                3: "\u15f1",
                4: "\u1530",
                5: "\u01bc",
                6: "\u1986",
                7: "\u14a3",
                8: "\u1c96",
                9: "\u1066"
            },
            norse_runes: {
                a: "\ua072",
                b: "\ua0c3",
                c: "\ua1c3",
                d: "\ua0a1",
                e: "\ua3f9",
                f: "\ua11e",
                g: "\ua04d",
                h: "\ua369",
                i: "\ua091",
                j: "\ua02d",
                k: "\ua235",
                l: "\ua492",
                m: "\ua0b5",
                n: "\ua2ca",
                o: "\ua0a6",
                p: "\ua263",
                q: "\ua1b0",
                r: "\ua2ea",
                s: "\ua31a",
                t: "\ua2d6",
                u: "\ua308",
                v: "\ua030",
                w: "\ua150",
                x: "\ua1d2",
                y: "\ua096",
                z: "\ua074",
                A: "\ua2ec",
                B: "\ua357",
                C: "\ua3f3",
                D: "\ua09f",
                E: "\ua3c2",
                F: "\ua11f",
                G: "\ua34c",
                H: "\ua0ec",
                I: "\ua490",
                J: "\ua4bb",
                K: "\ua018",
                L: "\ua492",
                M: "\ua0b5",
                N: "\ua09a",
                O: "\ua27b",
                P: "\ua263",
                Q: "\ua2e0",
                R: "\ua2ea",
                S: "\ua444",
                T: "\ua4c4",
                U: "\ua00e",
                V: "\ua4a6",
                W: "\ua150",
                X: "\ua27c",
                Y: "\ua41e",
                Z: "\ua453",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            candy_cane: {
                a: "\u03b1",
                b: "\u10a6",
                c: "\u0188",
                d: "\u0503",
                e: "\u04bd",
                f: "\u03dd",
                g: "\u0260",
                h: "\u050b",
                i: "\u03b9",
                j: "\u029d",
                k: "\u0199",
                l: "\u0285",
                m: "\u0271",
                n: "\u0273",
                o: "\u03c3",
                p: "\u03c1",
                q: "\u03d9",
                r: "\u027e",
                s: "\u0282",
                t: "\u019a",
                u: "\u03c5",
                v: "\u028b",
                w: "\u026f",
                x: "x",
                y: "\u10e7",
                z: "\u0225",
                A: "\u03b1",
                B: "\u10a6",
                C: "\u0188",
                D: "\u0503",
                E: "\u04bd",
                F: "\u03dd",
                G: "\u0260",
                H: "\u050b",
                I: "\u03b9",
                J: "\u029d",
                K: "\u0199",
                L: "\u0285",
                M: "\u0271",
                N: "\u0273",
                O: "\u03c3",
                P: "\u03c1",
                Q: "\u03d9",
                R: "\u027e",
                S: "\u0282",
                T: "\u019a",
                U: "\u03c5",
                V: "\u028b",
                W: "\u026f",
                X: "x",
                Y: "\u10e7",
                Z: "\u0225",
                0: "\u0a66",
                1: "\u0c79",
                2: "\u0a68",
                3: "\u0a69",
                4: "\u0a6b",
                5: "\u01bc",
                6: "\u03ec",
                7: "\u0534",
                8: "\u0a6a",
                9: "\u0a67"
            },
            mount_olympus: {
                a: "a\u035b",
                b: "b\u035b",
                c: "c\u035b",
                d: "d\u035b",
                e: "e\u035b",
                f: "f\u035b",
                g: "g\u035b",
                h: "h\u035b",
                i: "i\u035b",
                j: "j\u035b",
                k: "k\u035b",
                l: "l\u035b",
                m: "m\u035b",
                n: "n\u035b",
                o: "o\u035b",
                p: "p\u035b",
                q: "q\u035b",
                r: "r\u035b",
                s: "s\u035b",
                t: "t\u035b",
                u: "u\u035b",
                v: "v\u035b",
                w: "w\u035b",
                x: "x\u035b",
                y: "y\u035b",
                z: "z\u035b",
                A: "A\u035b",
                B: "B\u035b",
                C: "C\u035b",
                D: "D\u035b",
                E: "E\u035b",
                F: "F\u035b",
                G: "G\u035b",
                H: "H\u035b",
                I: "I\u035b",
                J: "J\u035b",
                K: "K\u035b",
                L: "L\u035b",
                M: "M\u035b",
                N: "N\u035b",
                O: "O\u035b",
                P: "P\u035b",
                Q: "Q\u035b",
                R: "R\u035b",
                S: "S\u035b",
                T: "T\u035b",
                U: "U\u035b",
                V: "V\u035b",
                W: "W\u035b",
                X: "X\u035b",
                Y: "Y\u035b",
                Z: "Z\u035b",
                0: "0\u035b",
                1: "1\u035b",
                2: "2\u035b",
                3: "3\u035b",
                4: "4\u035b",
                5: "5\u035b",
                6: "6\u035b",
                7: "7\u035b",
                8: "8\u035b",
                9: "9\u035b"
            },
            vampire_fang: {
                a: "a\u0f19\u0f87",
                b: "b\u0f19\u0f87",
                c: "c\u0f19\u0f87",
                d: "d\u0f19\u0f87",
                e: "e\u0f19\u0f87",
                f: "f\u0f19\u0f87",
                g: "g\u0f19\u0f87",
                h: "h\u0f19\u0f87",
                i: "i\u0f19\u0f87",
                j: "j\u0f19\u0f87",
                k: "k\u0f19\u0f87",
                l: "l\u0f19\u0f87",
                m: "m\u0f19\u0f87",
                n: "n\u0f19\u0f87",
                o: "o\u0f19\u0f87",
                p: "p\u0f19\u0f87",
                q: "q\u0f19\u0f87",
                r: "r\u0f19\u0f87",
                s: "s\u0f19\u0f87",
                t: "t\u0f19\u0f87",
                u: "u\u0f19\u0f87",
                v: "v\u0f19\u0f87",
                w: "w\u0f19\u0f87",
                x: "x\u0f19\u0f87",
                y: "y\u0f19\u0f87",
                z: "z\u0f19\u0f87",
                A: "A\u0f19\u0f87",
                B: "B\u0f19\u0f87",
                C: "C\u0f19\u0f87",
                D: "D\u0f19\u0f87",
                E: "E\u0f19\u0f87",
                F: "F\u0f19\u0f87",
                G: "G\u0f19\u0f87",
                H: "H\u0f19\u0f87",
                I: "I\u0f19\u0f87",
                J: "J\u0f19\u0f87",
                K: "K\u0f19\u0f87",
                L: "L\u0f19\u0f87",
                M: "M\u0f19\u0f87",
                N: "N\u0f19\u0f87",
                O: "O\u0f19\u0f87",
                P: "P\u0f19\u0f87",
                Q: "Q\u0f19\u0f87",
                R: "R\u0f19\u0f87",
                S: "S\u0f19\u0f87",
                T: "T\u0f19\u0f87",
                U: "U\u0f19\u0f87",
                V: "V\u0f19\u0f87",
                W: "W\u0f19\u0f87",
                X: "X\u0f19\u0f87",
                Y: "Y\u0f19\u0f87",
                Z: "Z\u0f19\u0f87",
                0: "0\u0f19\u0f87",
                1: "1\u0f19\u0f87",
                2: "2\u0f19\u0f87",
                3: "3\u0f19\u0f87",
                4: "4\u0f19\u0f87",
                5: "5\u0f19\u0f87",
                6: "6\u0f19\u0f87",
                7: "7\u0f19\u0f87",
                8: "8\u0f19\u0f87",
                9: "9\u0f19\u0f87"
            }
        },
        graphic: {
            dashed_box: {
                a: "\ud83c\udde6\u200c",
                b: "\ud83c\udde7\u200c",
                c: "\ud83c\udde8\u200c",
                d: "\ud83c\udde9\u200c",
                e: "\ud83c\uddea\u200c",
                f: "\ud83c\uddeb\u200c",
                g: "\ud83c\uddec\u200c",
                h: "\ud83c\udded\u200c",
                i: "\ud83c\uddee\u200c",
                j: "\ud83c\uddef\u200c",
                k: "\ud83c\uddf0\u200c",
                l: "\ud83c\uddf1\u200c",
                m: "\ud83c\uddf2\u200c",
                n: "\ud83c\uddf3\u200c",
                o: "\ud83c\uddf4\u200c",
                p: "\ud83c\uddf5\u200c",
                q: "\ud83c\uddf6\u200c",
                r: "\ud83c\uddf7\u200c",
                s: "\ud83c\uddf8\u200c",
                t: "\ud83c\uddf9\u200c",
                u: "\ud83c\uddfa\u200c",
                v: "\ud83c\uddfb\u200c",
                w: "\ud83c\uddfc\u200c",
                x: "\ud83c\uddfd\u200c",
                y: "\ud83c\uddfe\u200c",
                z: "\ud83c\uddff\u200c",
                A: "\ud83c\udde6\u200c",
                B: "\ud83c\udde7\u200c",
                C: "\ud83c\udde8\u200c",
                D: "\ud83c\udde9\u200c",
                E: "\ud83c\uddea\u200c",
                F: "\ud83c\uddeb\u200c",
                G: "\ud83c\uddec\u200c",
                H: "\ud83c\udded\u200c",
                I: "\ud83c\uddee\u200c",
                J: "\ud83c\uddef\u200c",
                K: "\ud83c\uddf0\u200c",
                L: "\ud83c\uddf1\u200c",
                M: "\ud83c\uddf2\u200c",
                N: "\ud83c\uddf3\u200c",
                O: "\ud83c\uddf4\u200c",
                P: "\ud83c\uddf5\u200c",
                Q: "\ud83c\uddf6\u200c",
                R: "\ud83c\uddf7\u200c",
                S: "\ud83c\uddf8\u200c",
                T: "\ud83c\uddf9\u200c",
                U: "\ud83c\uddfa\u200c",
                V: "\ud83c\uddfb\u200c",
                W: "\ud83c\uddfc\u200c",
                X: "\ud83c\uddfd\u200c",
                Y: "\ud83c\uddfe\u200c",
                Z: "\ud83c\uddff\u200c",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            border_box: {
                a: "\ud83c\udd30",
                b: "\ud83c\udd31",
                c: "\ud83c\udd32",
                d: "\ud83c\udd33",
                e: "\ud83c\udd34",
                f: "\ud83c\udd35",
                g: "\ud83c\udd36",
                h: "\ud83c\udd37",
                i: "\ud83c\udd38",
                j: "\ud83c\udd39",
                k: "\ud83c\udd3a",
                l: "\ud83c\udd3b",
                m: "\ud83c\udd3c",
                n: "\ud83c\udd3d",
                o: "\ud83c\udd3e",
                p: "\ud83c\udd3f",
                q: "\ud83c\udd40",
                r: "\ud83c\udd41",
                s: "\ud83c\udd42",
                t: "\ud83c\udd43",
                u: "\ud83c\udd44",
                v: "\ud83c\udd45",
                w: "\ud83c\udd46",
                x: "\ud83c\udd47",
                y: "\ud83c\udd48",
                z: "\ud83c\udd49",
                A: "\ud83c\udd30",
                B: "\ud83c\udd31",
                C: "\ud83c\udd32",
                D: "\ud83c\udd33",
                E: "\ud83c\udd34",
                F: "\ud83c\udd35",
                G: "\ud83c\udd36",
                H: "\ud83c\udd37",
                I: "\ud83c\udd38",
                J: "\ud83c\udd39",
                K: "\ud83c\udd3a",
                L: "\ud83c\udd3b",
                M: "\ud83c\udd3c",
                N: "\ud83c\udd3d",
                O: "\ud83c\udd3e",
                P: "\ud83c\udd3f",
                Q: "\ud83c\udd40",
                R: "\ud83c\udd41",
                S: "\ud83c\udd42",
                T: "\ud83c\udd43",
                U: "\ud83c\udd44",
                V: "\ud83c\udd45",
                W: "\ud83c\udd46",
                X: "\ud83c\udd47",
                Y: "\ud83c\udd48",
                Z: "\ud83c\udd49",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            filled_box: {
                a: "\ud83c\udd70",
                b: "\ud83c\udd71",
                c: "\ud83c\udd72",
                d: "\ud83c\udd73",
                e: "\ud83c\udd74",
                f: "\ud83c\udd75",
                g: "\ud83c\udd76",
                h: "\ud83c\udd77",
                i: "\ud83c\udd78",
                j: "\ud83c\udd79",
                k: "\ud83c\udd7a",
                l: "\ud83c\udd7b",
                m: "\ud83c\udd7c",
                n: "\ud83c\udd7d",
                o: "\ud83c\udd7e",
                p: "\ud83c\udd7f",
                q: "\ud83c\udd80",
                r: "\ud83c\udd81",
                s: "\ud83c\udd82",
                t: "\ud83c\udd83",
                u: "\ud83c\udd84",
                v: "\ud83c\udd85",
                w: "\ud83c\udd86",
                x: "\ud83c\udd87",
                y: "\ud83c\udd88",
                z: "\ud83c\udd89",
                A: "\ud83c\udd70",
                B: "\ud83c\udd71",
                C: "\ud83c\udd72",
                D: "\ud83c\udd73",
                E: "\ud83c\udd74",
                F: "\ud83c\udd75",
                G: "\ud83c\udd76",
                H: "\ud83c\udd77",
                I: "\ud83c\udd78",
                J: "\ud83c\udd79",
                K: "\ud83c\udd7a",
                L: "\ud83c\udd7b",
                M: "\ud83c\udd7c",
                N: "\ud83c\udd7d",
                O: "\ud83c\udd7e",
                P: "\ud83c\udd7f",
                Q: "\ud83c\udd80",
                R: "\ud83c\udd81",
                S: "\ud83c\udd82",
                T: "\ud83c\udd83",
                U: "\ud83c\udd84",
                V: "\ud83c\udd85",
                W: "\ud83c\udd86",
                X: "\ud83c\udd87",
                Y: "\ud83c\udd88",
                Z: "\ud83c\udd89",
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            border_dot: {
                a: "\u24d0",
                b: "\u24d1",
                c: "\u24d2",
                d: "\u24d3",
                e: "\u24d4",
                f: "\u24d5",
                g: "\u24d6",
                h: "\u24d7",
                i: "\u24d8",
                j: "\u24d9",
                k: "\u24da",
                l: "\u24db",
                m: "\u24dc",
                n: "\u24dd",
                o: "\u24de",
                p: "\u24df",
                q: "\u24e0",
                r: "\u24e1",
                s: "\u24e2",
                t: "\u24e3",
                u: "\u24e4",
                v: "\u24e5",
                w: "\u24e6",
                x: "\u24e7",
                y: "\u24e8",
                z: "\u24e9",
                A: "\u24b6",
                B: "\u24b7",
                C: "\u24b8",
                D: "\u24b9",
                E: "\u24ba",
                F: "\u24bb",
                G: "\u24bc",
                H: "\u24bd",
                I: "\u24be",
                J: "\u24bf",
                K: "\u24c0",
                L: "\u24c1",
                M: "\u24c2",
                N: "\u24c3",
                O: "\u24c4",
                P: "\u24c5",
                Q: "\u24c6",
                R: "\u24c7",
                S: "\u24c8",
                T: "\u24c9",
                U: "\u24ca",
                V: "\u24cb",
                W: "\u24cc",
                X: "\u24cd",
                Y: "\u24ce",
                Z: "\u24cf",
                0: "\u24ea",
                1: "\u2460",
                2: "\u2461",
                3: "\u2462",
                4: "\u2463",
                5: "\u2464",
                6: "\u2465",
                7: "\u2466",
                8: "\u2467",
                9: "\u2468"
            },
            filled_dot: {
                a: "\ud83c\udd50",
                b: "\ud83c\udd51",
                c: "\ud83c\udd52",
                d: "\ud83c\udd53",
                e: "\ud83c\udd54",
                f: "\ud83c\udd55",
                g: "\ud83c\udd56",
                h: "\ud83c\udd57",
                i: "\ud83c\udd58",
                j: "\ud83c\udd59",
                k: "\ud83c\udd5a",
                l: "\ud83c\udd5b",
                m: "\ud83c\udd5c",
                n: "\ud83c\udd5d",
                o: "\ud83c\udd5e",
                p: "\ud83c\udd5f",
                q: "\ud83c\udd60",
                r: "\ud83c\udd61",
                s: "\ud83c\udd62",
                t: "\ud83c\udd63",
                u: "\ud83c\udd64",
                v: "\ud83c\udd65",
                w: "\ud83c\udd66",
                x: "\ud83c\udd67",
                y: "\ud83c\udd68",
                z: "\ud83c\udd69",
                A: "\ud83c\udd50",
                B: "\ud83c\udd51",
                C: "\ud83c\udd52",
                D: "\ud83c\udd53",
                E: "\ud83c\udd54",
                F: "\ud83c\udd55",
                G: "\ud83c\udd56",
                H: "\ud83c\udd57",
                I: "\ud83c\udd58",
                J: "\ud83c\udd59",
                K: "\ud83c\udd5a",
                L: "\ud83c\udd5b",
                M: "\ud83c\udd5c",
                N: "\ud83c\udd5d",
                O: "\ud83c\udd5e",
                P: "\ud83c\udd5f",
                Q: "\ud83c\udd60",
                R: "\ud83c\udd61",
                S: "\ud83c\udd62",
                T: "\ud83c\udd63",
                U: "\ud83c\udd64",
                V: "\ud83c\udd65",
                W: "\ud83c\udd66",
                X: "\ud83c\udd67",
                Y: "\ud83c\udd68",
                Z: "\ud83c\udd69",
                0: "\u24ff",
                1: "\u278a",
                2: "\u278b",
                3: "\u278c",
                4: "\u278d",
                5: "\u278e",
                6: "\u278f",
                7: "\u2790",
                8: "\u2791",
                9: "\u2792"
            },
            fake_bubble: {
                a: "\u249c",
                b: "\u249d",
                c: "\u249e",
                d: "\u249f",
                e: "\u24a0",
                f: "\u24a1",
                g: "\u24a2",
                h: "\u24a3",
                i: "\u24a4",
                j: "\u24a5",
                k: "\u24a6",
                l: "\u24a7",
                m: "\u24a8",
                n: "\u24a9",
                o: "\u24aa",
                p: "\u24ab",
                q: "\u24ac",
                r: "\u24ad",
                s: "\u24ae",
                t: "\u24af",
                u: "\u24b0",
                v: "\u24b1",
                w: "\u24b2",
                x: "\u24b3",
                y: "\u24b4",
                z: "\u24b5",
                A: "\u249c",
                B: "\u249d",
                C: "\u249e",
                D: "\u249f",
                E: "\u24a0",
                F: "\u24a1",
                G: "\u24a2",
                H: "\u24a3",
                I: "\u24a4",
                J: "\u24a5",
                K: "\u24a6",
                L: "\u24a7",
                M: "\u24a8",
                N: "\u24a9",
                O: "\u24aa",
                P: "\u24ab",
                Q: "\u24ac",
                R: "\u24ad",
                S: "\u24ae",
                T: "\u24af",
                U: "\u24b0",
                V: "\u24b1",
                W: "\u24b2",
                X: "\u24b3",
                Y: "\u24b4",
                Z: "\u24b5",
                0: "\u24aa",
                1: "\u2474",
                2: "\u2475",
                3: "\u2476",
                4: "\u2477",
                5: "\u2478",
                6: "\u2479",
                7: "\u247a",
                8: "\u247b",
                9: "\u247c"
            },
            border_dot_dot: {
                a: "\u24d0\u0323\u0323\u0323",
                b: "\u24d1\u0323\u0323\u0323",
                c: "\u24d2\u0323\u0323\u0323",
                d: "\u24d3\u0323\u0323\u0323",
                e: "\u24d4\u0323\u0323\u0323",
                f: "\u24d5\u0323\u0323\u0323",
                g: "\u24d6\u0323\u0323\u0323",
                h: "\u24d7\u0323\u0323\u0323",
                i: "\u24d8\u0323\u0323\u0323",
                j: "\u24d9\u0323\u0323\u0323",
                k: "\u24da\u0323\u0323\u0323",
                l: "\u24db\u0323\u0323\u0323",
                m: "\u24dc\u0323\u0323\u0323",
                n: "\u24dd\u0323\u0323\u0323",
                o: "\u24de\u0323\u0323\u0323",
                p: "\u24df\u0323\u0323\u0323",
                q: "\u24e0\u0323\u0323\u0323",
                r: "\u24e1\u0323\u0323\u0323",
                s: "\u24e2\u0323\u0323\u0323",
                t: "\u24e3\u0323\u0323\u0323",
                u: "\u24e4\u0323\u0323\u0323",
                v: "\u24e5\u0323\u0323\u0323",
                w: "\u24e6\u0323\u0323\u0323",
                x: "\u24e7\u0323\u0323\u0323",
                y: "\u24e8\u0323\u0323\u0323",
                z: "\u24e9\u0323\u0323\u0323",
                A: "\u24b6\u0323\u0323\u0323",
                B: "\u24b7\u0323\u0323\u0323",
                C: "\u24b8\u0323\u0323\u0323",
                D: "\u24b9\u0323\u0323\u0323",
                E: "\u24ba\u0323\u0323\u0323",
                F: "\u24bb\u0323\u0323\u0323",
                G: "\u24bc\u0323\u0323\u0323",
                H: "\u24bd\u0323\u0323\u0323",
                I: "\u24be\u0323\u0323\u0323",
                J: "\u24bf\u0323\u0323\u0323",
                K: "\u24c0\u0323\u0323\u0323",
                L: "\u24c1\u0323\u0323\u0323",
                M: "\u24c2\u0323\u0323\u0323",
                N: "\u24c3\u0323\u0323\u0323",
                O: "\u24c4\u0323\u0323\u0323",
                P: "\u24c5\u0323\u0323\u0323",
                Q: "\u24c6\u0323\u0323\u0323",
                R: "\u24c7\u0323\u0323\u0323",
                S: "\u24c8\u0323\u0323\u0323",
                T: "\u24c9\u0323\u0323\u0323",
                U: "\u24ca\u0323\u0323\u0323",
                V: "\u24cb\u0323\u0323\u0323",
                W: "\u24cc\u0323\u0323\u0323",
                X: "\u24cd\u0323\u0323\u0323",
                Y: "\u24ce\u0323\u0323\u0323",
                Z: "\u24cf\u0323\u0323\u0323",
                0: "\u24ea\u0323\u0323\u0323",
                1: "\u2460\u0323\u0323\u0323",
                2: "\u2461\u0323\u0323\u0323",
                3: "\u2462\u0323\u0323\u0323",
                4: "\u2463\u0323\u0323\u0323",
                5: "\u2464\u0323\u0323\u0323",
                6: "\u2465\u0323\u0323\u0323",
                7: "\u2466\u0323\u0323\u0323",
                8: "\u2467\u0323\u0323\u0323",
                9: "\u2468\u0323\u0323\u0323"
            }
        }
    },
    generate: function() {
        var e = "Lorem ipsum dolor sit amet",
            t = {};
        document.querySelector(".js-fg-input").value && (e = document.querySelector(".js-fg-input").value);
        for (var i in fg.fonts)
            for (font in fg.fonts[i]) {
                textArray = e.split("");
                for (var n = 0; n < textArray.length; n++) fg.fonts[i][font][textArray[n].toLowerCase()] && (textArray[n] = fg.fonts[i][font][textArray[n]]);
                t[font] = textArray.join("")
            }
        fg.render(t)
    },
    render: function(e) {
        document.querySelectorAll(".js-fg-text").forEach(function(t) {
            text = e[t.dataset.font], t.innerHTML = text
        })
    },
    clipboard: function() {
        document.querySelectorAll(".js-fg-copy")
    },
    sortByTag: function(e) {
        var t = e.target.dataset.tag,
            i = document.querySelectorAll(".js-fg-tag"),
            n = document.querySelectorAll(".js-fg-font");
        i.forEach(function(e) {
            e.dataset.tag == t ? e.classList.add("is-active") : e.classList.remove("is-active")
        }), n.forEach(function(e) {
            "all" == t ? (e.style.opacity = 1, e.style.display = "flex") : e.dataset.tags.includes(t) ? (e.style.opacity = 1, e.style.display = "flex") : (e.style.opacity = 0, e.style.display = "none")
        })
    },
    init: function() {
        document.querySelector(".js-fg") && (fg.generate(), new Clipboard(".js-fg-copy")), document.addEventListener("keyup", function(e) {
            e.target && e.target.classList.contains("js-fg-input") && fg.generate()
        }), document.addEventListener("click", function(e) {
            e.target && e.target.classList.contains("js-fg-tag") && fg.sortByTag(e)
        })
    }
};
fg.init();
var rellax = new Rellax(".parallax-item", {
        speed: 4
    }),
    generator = document.getElementsByClassName("js-generator-text")[0];
if (generator) {
    var query = window.location.search.substring(1),
        params = query.split("&"),
        number = params[0].split("=").pop(),
        type = params[1].split("=").pop(),
        input = document.getElementsByClassName("js-generator-input")[0],
        select = document.getElementsByClassName("js-generator-select")[0];
    input.value = number, select.value = type;
    var lorem = new Lorem;
    lorem.type = Lorem.TEXT, lorem.query = number + type, lorem.createLorem(document.getElementsByClassName("js-generator-output")[0])
}
var clipboard = new Clipboard(".js-generator-clipboard");
clipboard.on("success", function(e) {
    var t = document.getElementsByClassName("js-generator-clipbox")[0];
    t.classList.contains("is-active") && t.classList.remove("is-active"), t.classList.add("is-active"), setTimeout(function() {
        t.classList.remove("is-active")
    }, 1200), e.clearSelection()
});