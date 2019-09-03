import React from 'react';

import { Input, DatePicker } from 'keith-ui';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            v1: "1",
            v2: "2",
            v3: "3",
            v4: "2015-12-01",
            v5: ""
        };
    }

    render() {
        return (
            <div>
                <Input placeholder="123" width="210px" size="small" model={(value) => this.setState({ v1: value })} value={this.state.v1}></Input> <br />
                <Input placeholder="123" width="210px" model={(value) => this.setState({ v2: value })} value={this.state.v2}></Input> <br />
                <Input placeholder="123" width="210px" model={(value) => this.setState({ v3: value })} value={this.state.v3}></Input> <br />
                <DatePicker placeholder="123" width="10%" model={(value) => this.setState({ v4: value })} value={this.state.v4}></DatePicker> <br />
                <DatePicker placeholder="123" width="210px" model={(value) => this.setState({ v5: value })} value={this.state.v5}></DatePicker> <br />
            </div >
        );
    }

}

export default Home;