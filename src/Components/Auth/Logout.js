import React, { Component } from 'react';


class Logout extends Component {

  
    constructor(props) {
        super(props);

    }


    render() {
        document.cookie = "__react_session__=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
        return(
           <h1></h1>
        )
    }
}

//Date(item.time)


export default Logout;
