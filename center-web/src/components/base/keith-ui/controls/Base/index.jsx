import React from 'react';
import PropTypes from 'prop-types';
import { gid } from '../../common';

// let _controls = {};
// window._kt_controls = _controls;
let _kt_root_controls = {};
window._kt_root_controls = _kt_root_controls;

class Base extends React.Component {

    constructor(props) {
        super(props);
        this.ktId = 0;

        if (props.ktId) {
            this.ktId = props.ktId;
        }
        else {
            this.ktId = gid();
            _kt_root_controls[this.ktId] = this;
        }
    }

    dispatch(key, val) {
        if (_kt_root_controls[this.ktId] && _kt_root_controls[this.ktId].onDispatch) {
            _kt_root_controls[this.ktId].onDispatch(key, val);
        }
    }

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