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

let _gid = 0;

function gid(props) {
    let r = _gid++;
    if (props && props.ktId) {
        return props.ktId;
    }
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

export { handleMousePath, pushMousePath, forceMousePath, gid, getClientRect, getWindowEffectiveRange }