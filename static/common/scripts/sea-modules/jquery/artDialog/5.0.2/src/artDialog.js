/** 
 *  @name: artDialog - v5.0.2 
 *  @description: artDialog 是一个精心设计的 web 对话框控件，它继承与延伸了桌面对话框的特性，拥有细致的用户体验与精致的界面。artDialog 基于 LGPL 协议开源，无论是个人还是商业项目都可免费使用。 
 *  @author: TangBin, [http://www.planeArt.cn] 
 *  @date: 2013-08-30 
 */
define(function(require, exports, module) {
    var jQuery = require("$");
    (function($, window, undefined) {
        // artDialog 只支持 xhtml 1.0 或者以上的 DOCTYPE 声明
        if (document.compatMode === "BackCompat") {
            throw new Error("artDialog: Document types require more than xhtml1.0");
        }
        var _singleton, _count = 0, _expando = "artDialog" + +new Date(), _isIE6 = window.VBArray && !window.XMLHttpRequest, _isMobile = "createTouch" in document && !("onmousemove" in document) || /(iPhone|iPad|iPod)/i.test(navigator.userAgent), _isFixed = !_isIE6 && !_isMobile;
        var artDialog = function(config, ok, cancel) {
            config = config || {};
            if (typeof config === "string" || config.nodeType === 1) {
                config = {
                    content: config,
                    fixed: !_isMobile
                };
            }
            var api, defaults = artDialog.defaults;
            var elem = config.follow = this.nodeType === 1 && this || config.follow;
            // 合并默认配置
            for (var i in defaults) {
                if (config[i] === undefined) {
                    config[i] = defaults[i];
                }
            }
            config.id = elem && elem[_expando + "follow"] || config.id || _expando + _count;
            api = artDialog.list[config.id];
            if (api) {
                if (elem) {
                    api.follow(elem);
                }
                api.zIndex().focus();
                return api;
            }
            // 目前主流移动设备对fixed支持不好
            if (!_isFixed) {
                config.fixed = false;
            }
            // !$.isArray(config.button)
            if (!config.button || !config.button.push) {
                config.button = [];
            }
            // 确定按钮
            if (ok !== undefined) {
                config.ok = ok;
            }
            if (config.ok) {
                config.button.push({
                    id: "ok",
                    value: config.okValue,
                    callback: config.ok,
                    focus: true
                });
            }
            // 取消按钮
            if (cancel !== undefined) {
                config.cancel = cancel;
            }
            if (config.cancel) {
                config.button.push({
                    id: "cancel",
                    value: config.cancelValue,
                    callback: config.cancel
                });
            }
            // 更新 zIndex 全局配置
            artDialog.defaults.zIndex = config.zIndex;
            _count++;
            return artDialog.list[config.id] = _singleton ? _singleton.constructor(config) : new artDialog.fn.constructor(config);
        };
        artDialog.version = "5.0";
        artDialog.fn = artDialog.prototype = {
            /** @inner */
            constructor: function(config) {
                var dom;
                this.closed = false;
                this.config = config;
                this.dom = dom = this.dom || this._getDom();
                config.skin && dom.wrap.addClass(config.skin);
                dom.wrap.css("position", config.fixed ? "fixed" : "absolute");
                dom.close[config.cancel === false ? "hide" : "show"]();
                dom.content.css("padding", config.padding);
                this.button.apply(this, config.button);
                this.title(config.title).content(config.content).size(config.width, config.height).time(config.time);
                config.follow ? this.follow(config.follow) : this.position();
                this.zIndex();
                config.lock && this.lock();
                this._addEvent();
                this[config.visible ? "visible" : "hidden"]().focus();
                _singleton = null;
                config.initialize && config.initialize.call(this);
                return this;
            },
            /**
    * 设置内容
    * @param    {String, HTMLElement, Object}   内容 (可选)
    */
            content: function(message) {
                var prev, next, parent, display, that = this, dom = this.dom, $content = dom.content, content = $content[0];
                if (this._elemBack) {
                    this._elemBack();
                    delete this._elemBack;
                }
                if (typeof message === "string") {
                    $content.html(message);
                } else if (message && message.nodeType === 1) {
                    // 让传入的元素在对话框关闭后可以返回到原来的地方
                    display = message.style.display;
                    prev = message.previousSibling;
                    next = message.nextSibling;
                    parent = message.parentNode;
                    this._elemBack = function() {
                        if (prev && prev.parentNode) {
                            prev.parentNode.insertBefore(message, prev.nextSibling);
                        } else if (next && next.parentNode) {
                            next.parentNode.insertBefore(message, next);
                        } else if (parent) {
                            parent.appendChild(message);
                        }
                        message.style.display = display;
                        that._elemBack = null;
                    };
                    $content.html("");
                    content.appendChild(message);
                    $(message).show();
                }
                if (dom.wrapIframe.length) {
                    var _o = dom.wrap[0], _ow = _o.offsetWidth, _oh = _o.offsetHeight;
                    dom.wrapIframe.css({
                        width: _ow,
                        height: _oh,
                        marginBottom: -_oh
                    });
                }
                return this.position();
            },
            /**
    * 设置标题
    * @param    {String, Boolean}   标题内容. 为 false 则隐藏标题栏
    */
            title: function(content) {
                var dom = this.dom, outer = dom.outer, $title = dom.title, className = "d-state-noTitle";
                if (content === false) {
                    $title.hide().html("");
                    outer.addClass(className);
                } else {
                    $title.show().html(content);
                    outer.removeClass(className);
                }
                return this;
            },
            /** @inner 位置居中 */
            position: function() {
                var dom = this.dom, wrap = dom.wrap[0], $window = dom.window, $document = dom.document, fixed = this.config.fixed, dl = fixed ? 0 : $document.scrollLeft(), dt = fixed ? 0 : $document.scrollTop(), ww = $window.width(), wh = $window.height(), ow = wrap.offsetWidth, oh = wrap.offsetHeight, left = (ww - ow) / 2 + dl, top = top = (oh < 4 * wh / 7 ? wh * .382 - oh / 2 : (wh - oh) / 2) + dt, style = wrap.style;
                style.left = Math.max(left, dl) + "px";
                style.top = Math.max(top, dt) + "px";
                return this;
            },
            /**
    *   尺寸
    *   @param  {Number, String}    宽度
    *   @param  {Number, String}    高度
    */
            size: function(width, height) {
                var style = this.dom.main[0].style;
                if (typeof width === "number") {
                    width = width + "px";
                }
                if (typeof height === "number") {
                    height = height + "px";
                }
                style.width = width;
                style.height = height;
                return this;
            },
            /**
    * 跟随元素
    * @param    {HTMLElement}
    */
            follow: function(elem) {
                var $elem = $(elem), config = this.config;
                // 隐藏元素不可用
                if (!elem || !elem.offsetWidth && !elem.offsetHeight) {
                    return this.position(this._left, this._top);
                }
                var fixed = config.fixed, expando = _expando + "follow", dom = this.dom, $window = dom.window, $document = dom.document, winWidth = $window.width(), winHeight = $window.height(), docLeft = $document.scrollLeft(), docTop = $document.scrollTop(), offset = $elem.offset(), width = elem.offsetWidth, height = elem.offsetHeight, left = fixed ? offset.left - docLeft : offset.left, top = fixed ? offset.top - docTop : offset.top, wrap = this.dom.wrap[0], style = wrap.style, wrapWidth = wrap.offsetWidth, wrapHeight = wrap.offsetHeight, setLeft = left - (wrapWidth - width) / 2, setTop = top + height, dl = fixed ? 0 : docLeft, dt = fixed ? 0 : docTop;
                setLeft = setLeft < dl ? left : setLeft + wrapWidth > winWidth && left - wrapWidth > dl ? left - wrapWidth + width : setLeft;
                setTop = setTop + wrapHeight > winHeight + dt && top - wrapHeight > dt ? top - wrapHeight : setTop;
                style.left = setLeft + "px";
                style.top = setTop + "px";
                this._follow && this._follow.removeAttribute(expando);
                this._follow = elem;
                elem[expando] = config.id;
                return this;
            },
            /**
    * 自定义按钮
    * @example
        button({
            value: 'login',
            callback: function () {},
            disabled: false,
            focus: true
        }, .., ..)
    */
            button: function() {
                var dom = this.dom, $buttons = dom.buttons, elem = $buttons[0], strongButton = "d-state-highlight", listeners = this._listeners = this._listeners || {}, ags = [].slice.call(arguments);
                var i = 0, val, value, id, isNewButton, button;
                for (;i < ags.length; i++) {
                    val = ags[i];
                    value = val.value;
                    id = val.id || value;
                    isNewButton = !listeners[id];
                    button = !isNewButton ? listeners[id].elem : document.createElement("input");
                    button.type = "button";
                    button.className = "d-button";
                    if (!listeners[id]) {
                        listeners[id] = {};
                    }
                    if (value) {
                        button.value = value;
                    }
                    if (val.width) {
                        button.style.width = val.width;
                    }
                    if (val.callback) {
                        listeners[id].callback = val.callback;
                    }
                    if (val.focus) {
                        this._focus && this._focus.removeClass(strongButton);
                        this._focus = $(button).addClass(strongButton);
                        this.focus();
                    }
                    button[_expando + "callback"] = id;
                    button.disabled = !!val.disabled;
                    if (isNewButton) {
                        listeners[id].elem = button;
                        elem.appendChild(button);
                    }
                }
                $buttons[0].style.display = ags.length ? "" : "none";
                return this;
            },
            /** 显示对话框 */
            visible: function() {
                //this.dom.wrap.show();
                this.dom.wrap.css("visibility", "visible");
                this.dom.outer.addClass("d-state-visible");
                if (this._isLock) {
                    this._lockMask.show();
                }
                return this;
            },
            /** 隐藏对话框 */
            hidden: function() {
                //this.dom.wrap.hide();
                this.dom.wrap.css("visibility", "hidden");
                this.dom.outer.removeClass("d-state-visible");
                if (this._isLock) {
                    this._lockMask.hide();
                }
                return this;
            },
            /** 关闭对话框 */
            close: function() {
                if (this.closed) {
                    return this;
                }
                var dom = this.dom, $wrap = dom.wrap, list = artDialog.list, beforeunload = this.config.beforeunload, follow = this.config.follow;
                if (beforeunload && beforeunload.call(this) === false) {
                    return this;
                }
                if (artDialog.focus === this) {
                    artDialog.focus = null;
                }
                if (follow) {
                    follow.removeAttribute(_expando + "follow");
                }
                if (this._elemBack) {
                    this._elemBack();
                }
                this.time();
                this.unlock();
                this._removeEvent();
                delete list[this.config.id];
                if (_singleton) {
                    $wrap.remove();
                } else {
                    _singleton = this;
                    dom.title.html("");
                    dom.content.html("");
                    dom.buttons.html("");
                    $wrap[0].className = $wrap[0].style.cssText = "";
                    dom.outer[0].className = "d-outer";
                    $wrap.css({
                        left: 0,
                        top: 0,
                        position: _isFixed ? "fixed" : "absolute"
                    });
                    for (var i in this) {
                        if (this.hasOwnProperty(i) && i !== "dom") {
                            delete this[i];
                        }
                    }
                    this.hidden();
                }
                this.closed = true;
                return this;
            },
            /**
    * 定时关闭
    * @param    {Number}    单位毫秒, 无参数则停止计时器
    */
            time: function(time) {
                var that = this, timer = this._timer;
                timer && clearTimeout(timer);
                if (time) {
                    this._timer = setTimeout(function() {
                        that._click("cancel");
                    }, time);
                }
                return this;
            },
            /** @inner 设置焦点 */
            focus: function() {
                if (this.config.focus) {
                    //setTimeout(function () {
                    try {
                        var elem = this._focus && this._focus[0] || this.dom.close[0];
                        elem && elem.focus();
                    } catch (e) {}
                }
                return this;
            },
            /** 置顶对话框 */
            zIndex: function() {
                var dom = this.dom, top = artDialog.focus, index = artDialog.defaults.zIndex++;
                // 设置叠加高度
                dom.wrap.css("zIndex", index);
                this._lockMask && this._lockMask.css("zIndex", index - 1);
                // 设置最高层的样式
                top && top.dom.outer.removeClass("d-state-focus");
                artDialog.focus = this;
                dom.outer.addClass("d-state-focus");
                return this;
            },
            /** 设置屏锁 */
            lock: function() {
                if (this._isLock) {
                    return this;
                }
                var that = this, config = this.config, dom = this.dom, div = document.createElement("div"), $div = $(div), index = artDialog.defaults.zIndex - 1;
                this.zIndex();
                dom.outer.addClass("d-state-lock");
                $div.css({
                    zIndex: index,
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "hidden"
                }).addClass("d-mask");
                if (_isIE6) {
                    $div.append($("<iframe>", {
                        "class": "d-mask-iframe",
                        src: "about:blank"
                    }));
                }
                if (!_isFixed) {
                    $div.css({
                        position: "absolute",
                        width: $(window).width() + "px",
                        height: $(document).height() + "px"
                    });
                }
                $div.bind("click", function() {
                    that._reset();
                }).bind("dblclick", function() {
                    that._click("cancel");
                });
                document.body.appendChild(div);
                this._lockMask = $div;
                this._isLock = true;
                return this;
            },
            /** 解开屏锁 */
            unlock: function() {
                if (!this._isLock) {
                    return this;
                }
                this._lockMask.unbind();
                this._lockMask.hide();
                this._lockMask.remove();
                this.dom.outer.removeClass("d-state-lock");
                this._isLock = false;
                return this;
            },
            // 获取元素
            _getDom: function() {
                var body = document.body;
                if (!body) {
                    throw new Error('artDialog: "documents.body" not ready');
                }
                var wrap = document.createElement("div");
                wrap.style.cssText = "position:absolute;left:0;top:0";
                wrap.innerHTML = artDialog._templates;
                body.insertBefore(wrap, body.firstChild);
                var name, i = 0, dom = {}, els = wrap.getElementsByTagName("*"), elsLen = els.length;
                for (;i < elsLen; i++) {
                    name = els[i].className.split("d-")[1];
                    if (name) {
                        dom[name] = $(els[i]);
                    }
                }
                dom.window = $(window);
                dom.document = $(document);
                dom.wrap = $(wrap);
                dom.wrapIframe = $(wrap).find(".d-outer-iframe");
                return dom;
            },
            // 按钮回调函数触发
            _click: function(id) {
                var fn = this._listeners[id] && this._listeners[id].callback;
                return typeof fn !== "function" || fn.call(this) !== false ? this.close() : this;
            },
            // 重置位置
            _reset: function() {
                var elem = this.config.follow;
                elem ? this.follow(elem) : this.position();
            },
            // 事件代理
            _addEvent: function() {
                var that = this, dom = this.dom;
                // 监听点击
                dom.wrap.bind("click", function(event) {
                    var target = event.target, callbackID;
                    // IE BUG
                    if (target.disabled) {
                        return false;
                    }
                    if (target === dom.close[0]) {
                        that._click("cancel");
                        return false;
                    } else {
                        callbackID = target[_expando + "callback"];
                        callbackID && that._click(callbackID);
                    }
                }).bind("mousedown", function() {
                    that.zIndex();
                });
            },
            // 卸载事件代理
            _removeEvent: function() {
                this.dom.wrap.unbind();
            }
        };
        artDialog.fn.constructor.prototype = artDialog.fn;
        $.fn.dialog = $.fn.artDialog = function() {
            var config = arguments;
            this[this.live ? "live" : "bind"]("click", function() {
                artDialog.apply(this, config);
                return false;
            });
            return this;
        };
        /** 最顶层的对话框API */
        artDialog.focus = null;
        /**
* 根据 ID 获取某对话框 API
* @param    {String}    对话框 ID
* @return   {Object}    对话框 API (实例)
*/
        artDialog.get = function(id) {
            return id === undefined ? artDialog.list : artDialog.list[id];
        };
        artDialog.list = {};
        // 全局快捷键
        $(document).bind("keydown", function(event) {
            var target = event.target, nodeName = target.nodeName, rinput = /^input|textarea$/i, api = artDialog.focus, keyCode = event.keyCode;
            if (!api || !api.config.esc || rinput.test(nodeName) && target.type !== "button") {
                return;
            }
            // ESC
            keyCode === 27 && api._click("cancel");
        });
        // 浏览器窗口改变后重置对话框位置
        $(window).bind("resize", function() {
            var dialogs = artDialog.list;
            for (var id in dialogs) {
                dialogs[id]._reset();
            }
        });
        // XHTML 模板
        // 使用 uglifyjs 压缩能够预先处理"+"号合并字符串
        // @see http://marijnhaverbeke.nl/uglifyjs
        artDialog._templates = '<div class="d-outer">' + (_isIE6 ? '<iframe class="d-outer-iframe" src="about:blank"></iframe>' : "") + '<table class="d-border">' + "<tbody>" + "<tr>" + '<td class="d-nw"></td>' + '<td class="d-n"></td>' + '<td class="d-ne"></td>' + "</tr>" + "<tr>" + '<td class="d-w"></td>' + '<td class="d-c">' + '<div class="d-inner">' + '<table class="d-dialog">' + "<tbody>" + "<tr>" + '<td class="d-header">' + '<div class="d-titleBar">' + '<div class="d-title"></div>' + '<a class="d-close" href="javascript:/*artDialog*/;">' + "×" + "</a>" + "</div>" + "</td>" + "</tr>" + "<tr>" + '<td class="d-main">' + '<div class="d-content"></div>' + "</td>" + "</tr>" + "<tr>" + '<td class="d-footer">' + '<div class="d-buttons"></div>' + "</td>" + "</tr>" + "</tbody>" + "</table>" + "</div>" + "</td>" + '<td class="d-e"></td>' + "</tr>" + "<tr>" + '<td class="d-sw"></td>' + '<td class="d-s"></td>' + '<td class="d-se"></td>' + "</tr>" + "</tbody>" + "</table>" + "</div>";
        /**
 * 默认配置
 */
        artDialog.defaults = {
            // 消息内容
            content: '<div class="d-loading"><span>loading..</span></div>',
            // 标题
            title: "message",
            // 自定义按钮
            button: null,
            // 确定按钮回调函数
            ok: null,
            // 取消按钮回调函数
            cancel: null,
            // 对话框初始化后执行的函数
            initialize: null,
            // 对话框关闭前执行的函数
            beforeunload: null,
            // 确定按钮文本
            okValue: "ok",
            // 取消按钮文本
            cancelValue: "cancel",
            // 内容宽度
            width: "auto",
            // 内容高度
            height: "auto",
            // 内容与边界填充距离
            padding: "0",
            // 皮肤名(多皮肤共存预留接口)
            skin: null,
            // 自动关闭时间
            time: null,
            // 是否支持Esc键关闭
            esc: true,
            // 是否支持对话框按钮自动聚焦
            focus: true,
            // 初始化后是否显示对话框
            visible: true,
            // 让对话框跟随某元素
            follow: null,
            // 是否锁屏
            lock: false,
            // 是否固定定位
            fixed: false,
            // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
            zIndex: 1987
        };
        this.artDialog = $.dialog = $.artDialog = artDialog;
    })(this.art || this.jQuery, this);
    /* 更新记录

1.  follow 不再支持 String 类型
2.  button 参数只支持 Array 类型
3.  button name 成员改成 value
4.  button 增加 id 成员
5.  okVal 参数更名为 okValue, 默认值由 '确定' 改为 'ok'
6.  cancelVal 参数更名为 cancelValue, 默认值由 '取消' 改为 'cancel'
6.  close 参数更名为 beforeunload
7.  init 参数更名为 initialize
8.  title 参数默认值由 '消息' 改为 'message'
9.  time 参数与方法参数单位由秒改为毫秒
10. hide 参数方法更名为 hidden
11. 内部为皮肤增加动态样式 d-state-visible 类
12. 给遮罩增添样式 d-mask 类
13. background 参数被取消, 由 CSS 文件定义
14. opacity 参数被取消, 由 CSS 文件定义
15. 取消拖动特性，改由插件支持
16. 取消 left 与 top 参数
17. 取消对 ie6 提供 fixed 支持，自动转换为 absolute
18. 取消对 ie6 提供 alpha png 支持
19. 取消对 ie6 提供 select 标签遮盖支持
20. 增加 focus 参数
21. 取消 position 方法
22. 取消对 <script type="text/dialog"></script> 的支持
23. 取消对 iframe 的支持
24. title 方法不支持空参数
25. content 方法不支持空参数
26. button 方法的参数不支持数组类型
27. 判断 DOCTYPE, 对 xhtml1.0 以下的页面报告错误
28. 修复 IE8 动态等新内容时没有撑开对话框高度，特意为 ie8 取消 .d-content { display:inline-block }
29. show 参数与方法更名为 visible
30. 修正重复调用 close 方法出现的错误

*/
    /* defaults_cn */
    (function(defaults) {
        defaults["okValue"] = "确定";
        defaults["cancelValue"] = "取消";
        defaults["title"] = "消息";
        defaults["padding"] = "0";
        defaults["zIndex"] = "1000";
    })(artDialog.defaults);
    (function($) {
        /**
 * confirm24 单行的confirm提示框
 * @param   {Object}   configs           参数集合
 * @param   {Number}   configs['type']      弹出层的类型: 0("警告")[默认], 1("说明"), 2("正确"), 3("错误")
 * @param   {String}   configs['title']     弹出层的标题
 * @param   {String}   configs['content']   弹出层的正文
 * @param   {Function}   configs['ok']      "确定"按钮的回调函数
 * @param   {Function}   configs['cancel']  "取消"按钮的回调函数
 */
        // $.confirm24 = $.dialog.confirm24 = function(configs) {
        //     var _type = !configs["type"] ? 0 : configs["type"] | 0, _title = !configs["title"] ? "提示" : configs["title"];
        //     // "提示"
        //     var _icon_type = [ "handy-s24-01", "handy-s24-02", "handy-s24-03", "handy-s24-04" ], // "警告", "说明", "正确", "错误"
        //     _icon_class = _icon_type[_type];
        //     var _tpl = [ '<div class="clearfix handy-confrim24">', '<div class="center-wrap">', '<div class="center-wrap-content">', '<i class="' + _icon_class + '"></i>', "<h5>" + configs["content"] + "</h5>", "</div>", "</div>", "</div>" ].join("\n");
        //     var _ok = !configs["ok"] ? function() {
        //         return;
        //     } : configs["ok"], _cancel = !configs["cancel"] ? function() {
        //         return;
        //     } : configs["cancel"];
        //     return $.dialog({
        //         id: "Confirm",
        //         fixed: true,
        //         lock: true,
        //         title: _title,
        //         content: _tpl,
        //         ok: _ok,
        //         cancel: _cancel
        //     });
        // };
        /**
 * confirm32 单行的confirm提示框
 * @param   {Object}   configs           参数集合
 * @param   {Number}   configs['type']      弹出层的类型: 0("警告")[默认], 1("说明"), 2("正确"), 3("错误")
 * @param   {String}   configs['title']     弹出层的标题
 * @param   {String}   configs['content']   弹出层的正文
 * @param   {String}   configs['tips']      弹出层的正文的说明文字
 * @param   {Function}   configs['ok']      "确定"按钮的回调函数
 * @param   {Function}   configs['cancel']  "取消"按钮的回调函数
 */
        // $.confirm32 = $.dialog.confirm32 = function(configs) {
        //     var _type = !configs["type"] ? 0 : configs["type"] | 0, _title = !configs["title"] ? "提示" : configs["title"];
        //     // "提示"
        //     var _icon_type = [ "handy-s32-01", "handy-s32-02", "handy-s32-03", "handy-s32-04" ], // "警告", "说明", "正确", "错误"
        //     _icon_class = _icon_type[_type];
        //     var _tpl = [ '<div class="clearfix handy-confrim32">', '<div class="center-wrap">', '<div class="center-wrap-content">', '<i class="' + _icon_class + '"></i>', '<ul class="handy-confrim32-content">', '<li class="confirm-title">' + configs["content"] + "</li>", '<li class="confirm-tips">' + configs["tips"] + "</li>", "</ul>", "</div>", "</div>", "</div>" ].join("\n");
        //     var _ok = !configs["ok"] ? function() {
        //         return;
        //     } : configs["ok"], _cancel = !configs["cancel"] ? function() {
        //         return;
        //     } : configs["cancel"];
        //     return $.dialog({
        //         id: "Confirm",
        //         fixed: true,
        //         lock: true,
        //         title: _title,
        //         content: _tpl,
        //         ok: _ok,
        //         cancel: _cancel
        //     });
        // };
        /**
 * tips 简易的提示框
 * @param   {Object}   configs           参数集合
 * @param   {Number}   configs['type']      弹出层的类型: 0("警告")[默认], 1("说明"), 2("正确"), 3("错误")
 * @param   {String}   configs['content']   弹出层的正文
 * @param   {String}   configs['width']     弹出层的宽度: 'auto'[默认]
 * @param   {Function}   configs['beforeunload']  "结束"时的回调函数
 */

        $.tips = $.dialog.tips = function(configs) {

            var  that =  $.dialog;

            var _type = !configs["type"] ? 0 : configs["type"] | 0, _icon_type = [ "ui-from-status-warn ui-bg-warn ui-border-warn", "ui-from-status-info ui-bg-info ui-border-info", "ui-from-status-succeed ui-bg-succeed ui-border-succeed", "ui-from-status-error ui-bg-error ui-border-error" ], // "警告", "说明", "正确", "错误"
            _icon_class = _icon_type[_type];
            // var _tpl = [ '<div class="handy-tips">', '<div class="clearfix m15">', '<i class="' + _icon_class + '"></i>', "<p>" + configs["content"] + "</p>", "</div>", "</div>" ].join("\n");

            var _tpl = [ '<span class="' + _icon_class + '">'+ configs["content"] + '</span>'].join("\n");

            var _time = !configs["time"] ? 2e3 : configs["time"] | 0,
            	_width = !configs["width"] ? "auto" : configs["width"],
            	_beforeunload = !configs["beforeunload"] ? function() {return;} : configs["beforeunload"],
            	_follow = !configs["follow"] ? that.follow : configs["follow"];

            return artDialog({
                id: "Tips",
                title: false,
                content: _tpl,
                cancel: false,
                fixed: true,
                lock: false,
                time: _time,
                width: _width,
                follow: _follow,
                beforeunload: _beforeunload
            });
        };
        // 拖拽支持
        var DragEvent = function() {
            var that = this, proxy = function(name) {
                var fn = that[name];
                that[name] = function() {
                    return fn.apply(that, arguments);
                };
            };
            proxy("start");
            proxy("over");
            proxy("end");
        };
        DragEvent.prototype = {
            // 开始拖拽
            // onstart: function () {},
            start: function(event) {
                $(document).bind("mousemove", this.over).bind("mouseup", this.end);
                this._sClientX = event.clientX;
                this._sClientY = event.clientY;
                this.onstart(event.clientX, event.clientY);
                return false;
            },
            // 正在拖拽
            // onover: function () {},
            over: function(event) {
                this._mClientX = event.clientX;
                this._mClientY = event.clientY;
                this.onover(event.clientX - this._sClientX, event.clientY - this._sClientY);
                return false;
            },
            // 结束拖拽
            // onend: function () {},
            end: function(event) {
                $(document).unbind("mousemove", this.over).unbind("mouseup", this.end);
                this.onend(event.clientX, event.clientY);
                return false;
            }
        };
        var $window = $(window), $document = $(document), html = document.documentElement, isIE6 = !("minWidth" in html.style), isLosecapture = !isIE6 && "onlosecapture" in html, isSetCapture = "setCapture" in html, dragstart = function() {
            return false;
        };
        var dragInit = function(event) {
            var dragEvent = new DragEvent(), api = artDialog.focus, dom = api.dom, $wrap = dom.wrap, $title = dom.title, $main = dom.main, wrap = $wrap[0], title = $title[0], main = $main[0], wrapStyle = wrap.style, mainStyle = main.style;
            var isResize = event.target === dom.se[0] ? true : false;
            var isFixed = wrap.style.position === "fixed", minX = isFixed ? 0 : $document.scrollLeft(), minY = isFixed ? 0 : $document.scrollTop(), maxX = $window.width() - wrap.offsetWidth + minX, maxY = $window.height() - wrap.offsetHeight + minY;
            var startWidth, startHeight, startLeft, startTop;
            // 对话框准备拖动
            dragEvent.onstart = function(x, y) {
                if (isResize) {
                    startWidth = main.offsetWidth;
                    startHeight = main.offsetHeight;
                } else {
                    startLeft = wrap.offsetLeft;
                    startTop = wrap.offsetTop;
                }
                $document.bind("dblclick", dragEvent.end).bind("dragstart", dragstart);
                if (isLosecapture) {
                    $title.bind("losecapture", dragEvent.end);
                } else {
                    $window.bind("blur", dragEvent.end);
                }
                isSetCapture && title.setCapture();
                $wrap.addClass("d-state-drag");
                api.focus();
            };
            // 对话框拖动进行中
            dragEvent.onover = function(x, y) {
                if (isResize) {
                    var width = x + startWidth, height = y + startHeight;
                    wrapStyle.width = "auto";
                    mainStyle.width = Math.max(0, width) + "px";
                    wrapStyle.width = wrap.offsetWidth + "px";
                    mainStyle.height = Math.max(0, height) + "px";
                } else {
                    var left = Math.max(minX, Math.min(maxX, x + startLeft)), top = Math.max(minY, Math.min(maxY, y + startTop));
                    wrapStyle.left = left + "px";
                    wrapStyle.top = top + "px";
                }
            };
            // 对话框拖动结束
            dragEvent.onend = function(x, y) {
                $document.unbind("dblclick", dragEvent.end).unbind("dragstart", dragstart);
                if (isLosecapture) {
                    $title.unbind("losecapture", dragEvent.end);
                } else {
                    $window.unbind("blur", dragEvent.end);
                }
                isSetCapture && title.releaseCapture();
                $wrap.removeClass("d-state-drag");
            };
            dragEvent.start(event);
        };
        // 代理 mousedown 事件触发对话框拖动
        $(document).bind("mousedown", function(event) {
            var api = artDialog.focus;
            if (!api) return;
            var target = event.target, config = api.config, dom = api.dom;
            if (config.drag !== false && target === dom.title[0] || config.resize !== false && target === dom.se[0]) {
                dragInit(event);
                // 防止firefox与chrome滚屏
                return false;
            }
        });
    })(this.art || this.jQuery);
    return artDialog;
});
