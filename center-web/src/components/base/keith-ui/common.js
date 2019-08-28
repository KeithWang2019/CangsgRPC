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
    client_rect = { top: rect.top + getDocumentScrollTop(), left: (rect.left + getDocumentScrollLeft()), width: element.clientWidth, height: element.clientHeight };

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

export { handleMousePath, pushMousePath, forceMousePath, gid, getClientRect, getWindowEffectiveRange, parseTime, parseTimeFormat, currentTime, addTime }