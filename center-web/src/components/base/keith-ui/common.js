let _mousePaths = [];
function handleMousePath() {
    for (var i = 0; i < _mousePaths.length; i++) {
        var path = _mousePaths[i];
        if (path.isIn === false && path.callback) {
            path.callback(path.id);
        }
    }
    _mousePaths = _mousePaths.filter(function (item) {
        if (item.isIn === false) {
            return false;
        }
        else {
            item.isIn = false;
            return true;
        }
    });
}

function pushMousePath(id, callback) {
    return forceMousePath(id, callback);
}

function forceMousePath(id, callback, isIn) {
    let _isIn = true;
    if (isIn !== undefined) {
        _isIn = isIn;
    }
    let isAdd = true;
    for (let i = 0; i < _mousePaths.length; i++) {
        let path = _mousePaths[i];
        if (path.id == id) {
            path.isIn = _isIn;
            if (callback) {
                path.callback = callback;
            }
            isAdd = false;
        }
    }
    if (isAdd) {
        _mousePaths.push({
            id: id,
            callback: callback,
            isIn: _isIn
        });
    }
    return isAdd;
}

let _gid = 1;

function gid() {
    let r = _gid++;
    return r;
}

/**
 * 滚动条上侧距离
 */
function getDocumentScrollTop() {
    return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
}

/**
 * 滚动条左侧距离
 */
function getDocumentScrollLeft() {
    return document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
}

function getClientRect(element) {
    var client_rect = null;

    var rect = element.getBoundingClientRect();
    client_rect = { top: rect.top + getDocumentScrollTop(), left: (rect.left + getDocumentScrollLeft()), width: rect.width, height: rect.height };

    if (client_rect.height > 100000) {
        return { top: 0, left: 0, width: 0, height: 0 };
    }
    return client_rect
}

function documentElement() {
    return document.documentElement || document.body;
}

function getBrowserHeight() {
    return documentElement().clientHeight;
}

function getBrowserWidth() {
    return documentElement().clientWidth;
}

function getWindowEffectiveRange() {
    var t_window_height = getBrowserHeight();
    var t_window_width = getBrowserWidth();
    var t_top_01 = getDocumentScrollTop();
    var t_top_02 = t_window_height + t_top_01;
    var t_left_01 = getDocumentScrollLeft();
    var t_left_02 = t_window_width + t_left_01;
    return { top_01: t_top_01, top_02: t_top_02, left_01: t_left_01, left_02: t_left_02, window_heihgt: t_window_height, window_width: t_window_width };
}

function parseTime(str) {
    str = str.replace(/-/g, "/");
    let index = str.lastIndexOf(".");
    if (index > 0) {
        str = str.substring(0, index);
    }
    return new Date(str);
}

function parseTimeFormat(time, fmt) {
    if (typeof (time) == "string") {
        time = parseTime(time);
        if (Number.isNaN(time.getTime())) {
            return ""
        }
    }
    let weeks = ['日', '一', '二', '三', '四', '五', '六'];
    var o = {
        "M+": time.getMonth() + 1, //月份 
        "d+": time.getDate(), //日 
        "h+": time.getHours(), //小时 
        "m+": time.getMinutes(), //分 
        "s+": time.getSeconds(), //秒 
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
        "S": time.getMilliseconds(), //毫秒 
        "W": time.getDay(),
        "w": weeks[time.getDay()]
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function currentTime(fmt) {
    var current = new Date();
    if (fmt) {
        return parseTimeFormat(current, fmt);
    }
    return current;
}

function addTime(type, time, n) {
    if (typeof (time) == "string") {
        time = parseTime(time);
    }
    var tmp = new Date(time.getTime());
    switch (type) {
        case 1:
            tmp.setFullYear(time.getFullYear() + n);
            break;
        case 2:
            tmp.setMonth(time.getMonth() + n);
            break;
        case 3:
            tmp.setDate(time.getDate() + n);
            break;
        case 4:
            tmp.setHours(time.getHours() + n);
            break;
        case 5:
            tmp.setMinutes(time.getMinutes() + n);
            break;
    }
    return tmp;
}

function isTime(time) {
    if (time.split("-").length == 3) {
        return !isNaN(Date.parse(time));
    }
    return false;
}

let _kt_root_controls = {};
window._kt_root_controls = _kt_root_controls;

function addControl(kid, control) {
    if (!_kt_root_controls[kid]) {
        _kt_root_controls[kid] = control;
    }
}

function delControl(kid, gid) {
    if (_kt_root_controls[kid] && _kt_root_controls[kid].gid == gid) {
        _kt_root_controls[kid] = null;
        delete _kt_root_controls[kid];
    }
}

function callControl(kid, method, ...args) {
    let control = _kt_root_controls[kid];
    if (control && control[method]) {
        return control[method](...args);
    }
}

function gotoControl(kid, color) {
    let control = _kt_root_controls[kid];
    if (control && control.goto) {
        control.goto(color);
    }
}

let _body = null;

function body() {
    if (_body == null) {
        _body = document.getElementsByTagName("body")[0];
    }
    return _body;
}


function elementVisble(element) {
    let rect = element.getBoundingClientRect();
    if (rect.left == 0 && rect.top == 0) {
        return false;
    }
    return true;
}

function manyTimesSetTimeout(callback, time, n) {
    if (n >= 0) {
        setTimeout(function () {
            callback(n);
            manyTimesSetTimeout(callback, time, n - 1);
        }, time);
    }
}

function deleteElement(element) {
    element.parentElement.removeChild(element);
}

function pmCenterLeft(width) {
    return (getBrowserWidth() - width) / 2 + getDocumentScrollLeft();
}

/**
 * 浏览器可视垂直中心位置
 * @param {*} height 
 */
function pmCenterTop(height) {
    return (getBrowserHeight() - height) / 2 + getDocumentScrollTop();
}

function gotoByElement(element, color) {
    if (typeof (element) == "string") {
        element = document.getElementById(element);
    }
    if (elementVisble(element)) {
        let t_goto_border_left = document.createElement("div");
        t_goto_border_left.style.display = "block";
        t_goto_border_left.className = "kt-goto-border kt-goto-border-left";
        t_goto_border_left.style.borderColor = color;

        let t_goto_border_top = document.createElement("div");
        t_goto_border_top.style.display = "block";
        t_goto_border_top.className = "kt-goto-border kt-goto-border-top";
        t_goto_border_top.style.borderColor = color;

        let t_goto_border_right = document.createElement("div");
        t_goto_border_right.style.display = "block";
        t_goto_border_right.className = "kt-goto-border kt-goto-border-right";
        t_goto_border_right.style.borderColor = color;

        let t_goto_border_bottom = document.createElement("div");
        t_goto_border_bottom.style.display = "block";
        t_goto_border_bottom.className = "kt-goto-border kt-goto-border-bottom";
        t_goto_border_bottom.style.borderColor = color;

        t_goto_border_left.style.top = pmCenterTop(200) + "px";
        t_goto_border_left.style.left = pmCenterLeft(200) + "px";
        t_goto_border_left.style.width = 1 + "px";
        t_goto_border_left.style.height = 200 + "px";

        t_goto_border_top.style.top = pmCenterTop(200) + "px";
        t_goto_border_top.style.left = pmCenterLeft(200) + "px";
        t_goto_border_top.style.width = 200 + "px";
        t_goto_border_top.style.height = 1 + "px";

        t_goto_border_right.style.top = pmCenterTop(200) + "px";
        t_goto_border_right.style.left = pmCenterLeft(200) + 200 + "px";
        t_goto_border_right.style.width = 1 + "px";
        t_goto_border_right.style.height = 200 + "px";

        t_goto_border_bottom.style.top = pmCenterTop(200) + 200 + "px";
        t_goto_border_bottom.style.left = pmCenterLeft(200) + "px";
        t_goto_border_bottom.style.width = 200 + "px";
        t_goto_border_bottom.style.height = 1 + "px";

        body().appendChild(t_goto_border_left);
        body().appendChild(t_goto_border_top);
        body().appendChild(t_goto_border_right);
        body().appendChild(t_goto_border_bottom);

        let rect = getClientRect(element);
        let range = getWindowEffectiveRange();
        if (range.top_01 > rect.top) {
            window.scrollTo(0, rect.top - range.window_heihgt / 3);
        }
        else if (range.top_02 < rect.top + rect.height) {
            window.scrollTo(0, rect.top - range.window_heihgt / 3 * 2);
        }

        setTimeout(function () {
            t_goto_border_left.style.display = "block";
            t_goto_border_top.style.display = "block";
            t_goto_border_right.style.display = "block";
            t_goto_border_bottom.style.display = "block";

            t_goto_border_left.style.top = rect.top + "px";
            t_goto_border_left.style.left = rect.left + "px";
            // t_goto_border_left.style.height = element.offsetHeight + "px";
            t_goto_border_left.style.height = rect.height + "px";

            t_goto_border_top.style.top = rect.top + "px";
            t_goto_border_top.style.left = rect.left + "px";
            // t_goto_border_top.style.width = element.offsetWidth + "px";
            t_goto_border_top.style.width = rect.width + "px";

            t_goto_border_right.style.top = rect.top + "px";
            t_goto_border_right.style.left = rect.left + rect.width - 2 + "px";
            // t_goto_border_right.style.height = element.offsetHeight + "px";
            t_goto_border_right.style.height = rect.height + "px";

            t_goto_border_bottom.style.top = rect.top + rect.height - 2 + "px";
            t_goto_border_bottom.style.left = rect.left + "px";
            // t_goto_border_bottom.style.width = element.offsetWidth + "px";
            t_goto_border_bottom.style.width = rect.width + "px";

            manyTimesSetTimeout(function (index) {
                if (index == 1) {
                    deleteElement(t_goto_border_left);
                    deleteElement(t_goto_border_top);
                    deleteElement(t_goto_border_right);
                    deleteElement(t_goto_border_bottom);
                }
                else if (parseInt(index % 2) == 1) {
                    t_goto_border_left.style.borderColor = "";
                    t_goto_border_top.style.borderColor = "";
                    t_goto_border_right.style.borderColor = "";
                    t_goto_border_bottom.style.borderColor = "";
                }
                else if (parseInt(index % 2) == 0) {
                    t_goto_border_left.style.borderColor = color;
                    t_goto_border_top.style.borderColor = color;
                    t_goto_border_right.style.borderColor = color;
                    t_goto_border_bottom.style.borderColor = color;
                }
            }, 300, 10);
        }, 100);
    }
}

class Logger {
    constructor() {
        this.level = 4;
    }

    debug(message) {
        if (this.level > 3) {            
            console.log(`%c [debug]: %c${message}`, "color:green", "color:#666");
        }
    }

    info(message) {
        if (this.level > 2) {
            console.info(`[info]:${message}`);
        }
    }

    warn(message) {
        if (this.level > 1) {
            console.warn(`[warn]:${message}`);
        }
    }

    error(message) {
        console.error(`[error]:${message}`);
    }
}

let logger = new Logger();

export { handleMousePath, pushMousePath, forceMousePath, gid, getClientRect, getWindowEffectiveRange, parseTime, parseTimeFormat, currentTime, addTime, isTime, addControl, delControl, callControl, gotoControl, gotoByElement, logger }