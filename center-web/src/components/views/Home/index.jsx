import React from 'react';

import { Input, DatePicker } from 'keith-ui';

const Home = () => (
    <div>
        <Input placeholder="123" kt-size="small" kt-width="210px"></Input><br />
        <Input placeholder="123" kt-size="default" kt-width="210px"></Input><br />
        <Input placeholder="123" kt-size="large" kt-width="210px"></Input><br/>
        <DatePicker placeholder="123" kt-size="small" kt-width="210px"></DatePicker><br/>
        <DatePicker placeholder="123" kt-size="small" kt-width="210px"></DatePicker><br/>
    </div>
)

export default Home;