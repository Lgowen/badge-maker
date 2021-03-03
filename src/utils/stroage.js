/**
 * 获取 localStorage 的值
 * @param {string} key localStorage key name
 */
export const getLocalStorage = (key) => {
    return window.localStorage.getItem(key)
}

/**
 * 设置 localStorage 的值
 * @param {string} key localStorage key name
 * @param {any} value 值
 */
export const setLocalStorage = (key, value) => {
    return window.localStorage.setItem(key, value)
}