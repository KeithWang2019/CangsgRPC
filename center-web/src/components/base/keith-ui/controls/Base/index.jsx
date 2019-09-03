import React from 'react';
import PropTypes from 'prop-types';
import { gid } from '../../common';

import classNames from 'classnames';

let _kt_root_controls = {};
window._kt_root_controls = _kt_root_controls;

class Base extends React.Component {

    constructor(props) {
        super(props);
        /** 组件内唯一ktId，一组嵌套组件ktId必须唯一 */
        this.ktId = 0;

        if (props.ktId) {
            this.ktId = props.ktId;
        }
        else {
            this.ktId = gid();
            _kt_root_controls[this.ktId] = this;
        }
    }

    /** 内部数据需要流向最上层组件，修改state后，通过props刷新到，内部组件内 */
    dispatch(key, val) {
        if (_kt_root_controls[this.ktId] && _kt_root_controls[this.ktId].onDispatch) {
            _kt_root_controls[this.ktId].onDispatch(key, val);
        }
    }

    /** 最上层的组件，执行后会更改组件外部数据 */
    updateModel(val) {
        this.props.model(val);
    }

    componentWillUnmount() {
        _kt_root_controls[this.ktId] = null;
        delete _kt_root_controls[this.ktId];
    }    
}

Base.propTypes = {
    ktId: PropTypes.number,
    model: PropTypes.func
}

Base.defaultProps = {
    ktId: 0
}

export default Base;