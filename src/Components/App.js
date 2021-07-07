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

//redux
import {Provider} from "react-redux";
import {createStore} from "redux";
import reducer from "./Reducer";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: '',
            token: ''

        };
        this.mounted = true;
    }

    //redux
    store = createStore(reducer);

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
        ReactSession.set("url", 'http://localhost:4000');

        this.setState({
            auth: false,
        });

        if (this.getCookie('__react_session__') != null) {

            const requestOptions = {
                method: 'post',
                headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({'api_token': this.getCookie('__react_session__')['token']})
            };

            fetch(this.getCookie('__react_session__')['url'] + "/api/v1/panel/dashboard", requestOptions)
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
                <Provider store={this.store}>


                    <Switch>

                        {this.state.auth &&
                        <Route path="/panel/dashboard" component={Dashboard}/>
                        }
                       {/* {this.state.auth &&
                        <Route path="/panel/watchlist" component={Watchlist}/>
                        }
                        {this.state.auth &&
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
                        <Route exact path="/register" component={Register}/>

                        <Route exact path="/" component={Index}/>

                        <Route path="" component={Notfound}/>

                    </Switch>

                </Provider>
            </Router>

        )
    }
}

export default App;
