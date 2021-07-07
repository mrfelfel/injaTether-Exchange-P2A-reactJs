import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Icon } from "coinmarketcap-cryptocurrency-icons";

import {
    Link,
} from "react-router-dom";


class HeaderIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: props.token
        };
        this.mounted = true;
        console.log(props.token)
    }


    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }


    CheckLogin() {
        if (this.getCookie('__react_session__') != null) {
            return true
        } else {
            return false
        }
    }

    render() {

        var headerbtn;
        if (this.CheckLogin() && this.getCookie('__react_session__')['token'] != null) {
        
            headerbtn =
                <Nav>
                    <Nav.Link as={Link} to="/panel/dashboard" >داشبورد</Nav.Link>
                    <Nav.Link as={Link} to="/logout">خروج</Nav.Link>

                </Nav>
        } else {
            headerbtn =
                <Nav>

                    <Nav.Link as={Link} to="/Login" >ورود</Nav.Link>
                    <Nav.Link as={Link} to="/register">عضویت</Nav.Link>

                </Nav>
        }

        return (

            <Navbar collapseOnSelect expand="lg" variant="dark">
                <Container>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">

                        {headerbtn}

                    </Navbar.Collapse>
                    <Navbar.Brand as={Link} to='/' >  <Icon i='usdt' size={25} />اینجاتتر</Navbar.Brand>
                    </Container>
            </Navbar>
        );
    }
}




export default HeaderIndex;
