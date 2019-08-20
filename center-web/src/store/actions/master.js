//action 定义
export const loadQuickNavigationAction = () => ({
    type: 'loadQuickNavigation'
})

export const openQuickNavigationAction = (path, open) => ({
    type: 'openQuickNavigation',
    path,
    open
})

//action 异步
export function loadQuickNavigation(path) {
    return function (dispatch) {
        dispatch(loadQuickNavigationAction(path));

        return new Promise((y, x) => {
            y("hello");
        });
    }
}

export function openQuickNavigation(path, open) {
    return function (dispatch) {
        dispatch(openQuickNavigationAction(path, open));

        return Promise.resolve();
    }
}