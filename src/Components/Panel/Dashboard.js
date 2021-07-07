import React, {Component} from 'react';

// import header panel
import HeaderPanel from './Layouts/HeaderPanel';

import Loading from '../Loading';
import '../Css/Panel.css';
import BoxshowKyc from "./BoxshowKyc";

class Dashboard extends Component {


    constructor(props) {
        super(props);
        this.state = {
            s: 'marketbase',
            d: 'irt',
            dd: 'irt',
            error: null,
            isLoaded: false,
            items: [],

        };

    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        this.mounted = true;
        document.title = "داشبورد"
        //    console.log(this.props)

    }


    render() {

        const {error, isLoaded, data} = this.state;


        return (
            <div>

                <HeaderPanel/>

                <div className="paddingtop">

                    <BoxshowKyc></BoxshowKyc>

                    <div className="content">
                    </div>
                </div>

            </div>
        );

    }

}


export default Dashboard;
