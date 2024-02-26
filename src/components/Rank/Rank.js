import React from 'react';

const Rank = ({ user }) => {
    return (
        <div>
        <div className='f3 white'>
            {`${user.name}, your current entry count is...`}
        </div>
        <div className='f1 white'>
            {`${user.entries}`}
        </div>

        </div>
    );
}

export default Rank;