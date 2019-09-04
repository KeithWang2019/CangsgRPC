import React from 'react';
import PropTypes from 'prop-types';
import { gid, addControl, delControl, callControl, gotoByElement } from '../../common';

class Base extends React.Component {

    constructor(props) {
        super(props);
        /** 组件内唯一kid，一组嵌套组件kid必须唯一 */
        this.kid = props.kid;
        this.gid = gid();
        addControl(props.kid, this);
    }

    /** 内部数据需要流向最上层组件，修改state后，通过props刷新到，内部组件内 */
    dispatch(key, val) {
        callControl(this.kid, "onDispatch", key, val);
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
}

Base.propTypes = {
    kid: PropTypes.string.isRequired,
    model: PropTypes.func
}

export default Base;