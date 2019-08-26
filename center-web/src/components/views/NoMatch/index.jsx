import React from 'react';

function NoMatch({ location }) {
    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code> return <a href="/">home</a> 
            </h3>
        </div>
    );
}

export default NoMatch;