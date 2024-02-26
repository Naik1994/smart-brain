import React from 'react';

const Navigation = ({isSignedIn, onRouteChange}) => {
    if (isSignedIn) {
        return (
            <nav style={{display: "flex", justifyContent: "flex-end"}}>
                <p onClick={() => onRouteChange('signin')} className='dim f3 link black underline pa3 pointer'>Sign Out</p>
            </nav>
        );
    } else {
        return (
            <nav style={{display: "flex", justifyContent: "flex-end"}}>
                <p onClick={() => onRouteChange('signin')} className='dim f3 link black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange('register')} className='dim f3 link black underline pa3 pointer'>Register</p>
            </nav>
        );
    }
}

export default Navigation;