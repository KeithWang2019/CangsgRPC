import React from 'react';

import { Input, DatePicker, gotoControl } from 'keith-ui';

class FrontDemo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            v1: "1",
            v2: "2",
            v3: "3",
            v4: "2015-12-01",
            v5: "",
            v6: "",
            v1disabled: false,
            v4disabled: true
        };
    }

    gotoError = () => {
        gotoControl("4", "red");
    }

    change = () => {
        this.setState({
            v4: "2016-12-01"
        })
    }

    disable1 = () => {
        this.setState({
            v1disabled: !this.state.v1disabled
        })
    }

    disable4 = () => {
        this.setState({
            v4disabled: !this.state.v4disabled
        })
    }

    xxx = (value) => {
        this.setState({ v2: value })
    }

    render() {
        return (
            <div>
                <Input disabled={this.state.v1disabled} kid="1" placeholder="123" width="210px" size="small" model={(value) => this.setState({ v1: value })} value={this.state.v1}>
                    {
                        (part) => {
                            switch (part) {
                                case "end":
                                    return <svg className="cac-icon kt-icon-datepicker" aria-hidden="true"><use xlinkHref={"#cac-calendar-alt"}></use></svg>
                                case "front":
                                    return <span className="kt-front-text">去：</span>;
                            }
                        }
                    }
                </Input> <br />
                <Input kid="2" placeholder="123" width="210px" model={this.xxx} value={this.state.v2}>
                    {
                        (part) => {
                            switch (part) {
                                case "icons":
                                    return <svg className="cac-icon kt-icon-datepicker" aria-hidden="true"><use xlinkHref={"#cac-calendar-alt"}></use></svg>
                                case "front":
                                    return <span className="kt-front-text">去：</span>;
                            }
                        }
                    }
                </Input> <br />
                <Input kid="3" placeholder="123" width="210px" size="large" model={(value) => this.setState({ v3: value })} value={this.state.v3}>
                    {
                        (part) => {
                            switch (part) {
                                case "icons":
                                    return <svg className="cac-icon kt-icon-datepicker" aria-hidden="true"><use xlinkHref={"#cac-calendar-alt"}></use></svg>
                            }
                        }
                    }
                </Input> <br />
                <DatePicker disabled={this.state.v4disabled} kid="6" placeholder="123" size="small" width="210px" model={(value) => this.setState({ v4: value, v1: "" })} value={this.state.v4}></DatePicker> <br />
                <DatePicker kid="4" placeholder="123" size="default" width="210px" model={(value) => this.setState({ v5: value })} value={this.state.v5}></DatePicker> <br />
                <DatePicker kid="5" placeholder="123" size="large" width="210px" model={(value) => this.setState({ v6: value })} value={this.state.v6}></DatePicker> <br />

                <input type="button" value="错误" onClick={this.gotoError} />
                <input type="button" value="改值" onClick={this.change} />
                <input type="button" value={this.state.v1disabled ? "解锁1" : "锁定1"} onClick={this.disable1} />
                <input type="button" value={this.state.v4disabled ? "解锁4" : "锁定4"} onClick={this.disable4} />
            </div >
        );
    }

}

export default FrontDemo;