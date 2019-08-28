import React from 'react';

import { Input, DatePicker } from 'keith-ui';

const Home = () => (
    <div>
        <Input placeholder="123" width="210px" id="a1" size="small"></Input><br />
        <Input placeholder="123" width="210px" id="a2"></Input><br />
        <Input placeholder="123" width="210px" id="a3"></Input><br/>
        <DatePicker placeholder="123" width="10%" id="a4"></DatePicker><br/>
        <DatePicker placeholder="123" width="210px" id="a5"></DatePicker><br/>
    </div>
)

export default Home;