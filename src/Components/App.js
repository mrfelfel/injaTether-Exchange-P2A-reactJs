import React, {Component} from 'react';

import Index from './Index';
import Notfound from "./Notfound";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Logout from "./Auth/Logout";
import Dashboard from "./Panel/Dashboard";
import ReactSession from './ReactSession';

import 'font-awesome/css/font-awesome.min.css';

// import react router
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Kyc from "./Panel/Kyc";
import Tickets from "./Panel/Tickets";
import BuySell from "./Panel/BuySell";
import Cards from "./Panel/Cards";
import Solidity from "./Solidity";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: '',
            token: ''

        };
        this.mounted = true;
    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }


    redirectToLogin(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }


    componentDidMount() {


        ReactSession.setStoreType("cookie");
        ReactSession.set("url", 'https://api.injatether.com');

        this.setState({
            auth: false,
        });

        if (this.getCookie('__react_session__') != null) {

            const requestOptions = {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': ' Bearer ' + this.getCookie('__react_session__')['token']
                }
            };

            fetch(this.getCookie('__react_session__')['url'] + "/auth/profile", requestOptions)
                .then(res => res.json())
                .then(
                    (result) => {

                        if (result.token !== "") {

                            this.setState({
                                auth: true,
                                token: this.getCookie('__react_session__')['token'],

                            });

                            this.mounted = false;


                        }
                        if (result.code === 401) {
                            document.cookie = "__react_session__=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            window.location.href = "/";
                            this.setState({
                                auth: false,
                            });
                            this.mounted = false;


                        }


                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {

                    }
                )
        }

    }


    render() {


        return (

            < Router>


                    <Switch>

                        {this.state.auth &&
                        <Route path="/panel/dashboard" component={Dashboard}/>
                        }
                        {this.state.auth &&
                        <Route path="/panel/kyc" component={Kyc}/>
                        }
                        {this.state.auth &&
                        <Route path="/panel/tickets" component={Tickets}/>
                        }
                        {this.state.auth &&
                        <Route path="/panel/buysell" component={BuySell}/>
                        }
                        {this.state.auth &&
                        <Route path="/panel/cards" component={Cards}/>
                        }
                     {/*   {this.state.auth &&
                        <Route path="/panel/alertlist" component={Alertlist}/>
                        }
                        {this.state.auth &&
                        <Route path="/panel/coins" component={Coins}/>
                        }
                        {this.state.auth &&
                        <Route path="/panel/Trade" component={Trade}/>
                        }*/}

                        <Route path="/logout" component={Logout}/>
                        {/*<Route path="/coins/:id" component={CoinShow}/>*/}
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/solidity" component={Solidity}/>
                        <Route exact path="/register" component={Register}/>

                        <Route exact path="/" component={Index}/>

                        <Route path="" component={Notfound}/>

                    </Switch>

            </Router>

        )
    }
}

export default App;
