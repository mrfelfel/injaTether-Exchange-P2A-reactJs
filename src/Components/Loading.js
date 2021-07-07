import React, { Component } from 'react';
import { BoxLoading } from 'react-loadingg';


class Loading extends Component {



    render() {

        return (
            <div style={{ textAlignVertical: "center",textAlign: "center" , paddingTop: '3rem' }}>
                <BoxLoading />
                <p style={{  textAlignVertical: "center",textAlign: "center" }}>در حال بارگزاری صفحه</p>
            </div>

        );
    }

}


export default Loading;
