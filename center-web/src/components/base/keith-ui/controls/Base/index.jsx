import React from 'react';
import PropTypes from 'prop-types';
import { gid, addControl, delControl, callControl, gotoByElement, logger } from '../../common';

class Base extends React.Component {

    /**
     * 
     * @param {*} props 
     * @param {*} name 组件类型名
     */
    constructor(props, name) {
        super(props);
        if (!name) {
            throw "请提供对象的类名称";
        }
        this.name = name;
        /** 组件内唯一kid，一组嵌套组件kid必须唯一 */
        this.kid = props.kid;
        this.gid = gid();
        this.rendering = false;
        addControl(props.kid, this);
    }

    /**
     * 如果不重写就使用rendering字段控制刷新页面
     * @param {*} nextProps 
     * @param {*} nextState 
     */
    shouldComponentUpdate(nextProps, nextState) {
        return this.rendering;
    }

    /** 内部数据需要流向最上层组件，修改state后，通过props刷新到，内部组件内 */
    dispatch(key, val) {
        return callControl(this.kid, "onDispatch", key, val);
    }

    /** 最上层的组件，执行后会更改组件外部数据 */
    updateModel(val) {
        this.props.model(val);
    }

    componentWillUnmount() {
        delControl(this.kid, this.gid);
    }

    goto(color) {
        let element = callControl(this.kid, "onDispatch", "goto", color);
        if (element) {
            gotoByElement(element, color);
        }
    }

    render() {
        this.rendering = false;
        logger.debug(`render = kid:${this.kid} -> ${this.name}`);        
        return this.onRender();
    }
}

Base.propTypes = {
    kid: PropTypes.string.isRequired,
    model: PropTypes.func
}

export default Base;