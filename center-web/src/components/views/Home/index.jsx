import React from 'react';

import { Input, DatePicker } from 'keith-ui';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.f = {
            v1: "",
            v2: "",
            v3: "",
            v4: "",
            v5: {
                v6: {
                    v7: {
                        v8: ""
                    }
                }
            }
        }
        window.f = this.f;
    }

    render() {
        return (
            <div>
                <Input placeholder="123" width="210px" id="a1" size="small" model={[this.f, "v1"]}></Input> <br />
                <Input placeholder="123" width="210px" id="a2" model={[this.f, "v2"]}></Input> <br />
                <Input placeholder="123" width="210px" id="a3" model={[this.f, "v3"]}></Input> <br />
                <DatePicker placeholder="123" width="10%" id="a4" model={[this.f, "v4"]}></DatePicker> <br />
                <DatePicker placeholder="123" width="210px" id="a5" model={[this.f, "v5", "v6", "v7", "v8"]}></DatePicker> <br />
            </div >
        );
    }

}

export default Home;