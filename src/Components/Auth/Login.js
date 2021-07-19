import React from 'react';
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Jumbotron } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import ReactSession from '../ReactSession';
import axios from "axios";

import swal from 'sweetalert';

// import header index
import HeaderIndex from '../Layouts/HeardeIndex';


class Login extends React.Component {




    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }


    settoken(e) {
        ReactSession.setStoreType("cookie");
        ReactSession.set("token", e);
    }

    handleChangePassword(e) {

        this.setState({ password: e.target.value });
    }

    ShowSucMessage(e) {
        swal(e);
    }

    ShowloginMessage(e, s) {
        swal(e, '', s);
    }


    handleChangeEmail(e) {

        this.setState({ email: e.target.value });
    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {

        document.title = "ورود"
        this.mounted = true;
        this.setState({
            isLoaded: true,
        });
    }


    LoginHandler(e) {
        //   this.setState({ fromInput: e.target.value })

        e.preventDefault();
        if (this.state.email == null && this.state.password == null) { this.ShowloginMessage('اطلاعاتی وارد نشده', 'error') } else {
            this.ShowloginMessage('در حال ورود', 'info');


            if (this.mounted) {
                const requestOptions = {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ 'email': this.state.email, 'password': this.state.password })
                };

                fetch(this.getCookie('__react_session__')['url']  + "/auth", requestOptions)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                isLoaded: true,
                                data: result,
                                formInput: ''
                            });

                            console.log(result)

                            if (result.statusCode === 401) { this.ShowloginMessage('اطلاعات درست نیست', 'error'); }
                            if (result.token != null) {
                                this.ShowloginMessage('با موفقیت وارد شدید', 'success');

                                // set token to seesion storage
                                this.settoken(result.token);
                                window.location.href = "/panel/dashboard";
                                //   this.props.history.push("/panel/dashboard");
                            }

                        },
                        // Note: it's important to handle errors here
                        // instead of a catch() block so that we don't swallow
                        // exceptions from actual bugs in components.
                        (error) => {
                            this.setState({
                                isLoaded: true,
                                work: true,
                                error
                            });
                        }
                    )
            }
        }

    }


    render() {
        //   const { error, isLoaded, data, Loginmessage } = this.state;

        return (
<div style={{backgroundColor:'#009393' , height:'100vh'}}>
<HeaderIndex />


            <Container>

                <Col md={5} className="mx-auto mt-5">
                    <Jumbotron style={{
                        boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
                        backgroundColor: 'white'
                    }}>

                        <Form onSubmit={this.LoginHandler.bind(this)} style={{textAlign: 'right'}}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>ایمیل</Form.Label>
                                <Form.Control style={{
                                    border:'1px solid rgb(36, 162, 162)',}} type="email" placeholder="ایمیل را وارد کنید" onChange={this.handleChangeEmail.bind(this)} required />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>رمز عبور</Form.Label>
                                <Form.Control style={{
                                    border:'1px solid rgb(36, 162, 162)',}} type="password" placeholder="رمز عبور را وارد کنید" onChange={this.handleChangePassword.bind(this)} required />
                            </Form.Group>
                            <Button style={{backgroundColor:'#24A2A2',border:0}} className='btnp' type="submit" size="lg" block>
                                ورود
  </Button>
                        </Form>

                    </Jumbotron>
                </Col>
            </Container>
            </div>

        );
    }
}

//Date(item.time)


export default Login;
