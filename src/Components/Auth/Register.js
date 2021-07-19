import React, {Component} from 'react';
import {Container} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Jumbotron} from 'react-bootstrap';
import {Col} from 'react-bootstrap';

import swal from 'sweetalert';

// import header index
import HeaderIndex from '../Layouts/HeardeIndex';


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            redirect: true
        };

    }


    setshow(value) {
        return value
    }

    handleChangePassword(e) {

        this.setState({password: e.target.value});
    }


    handleChangePasswordAgain(e) {

        this.setState({passwordagain: e.target.value});
    }

    handleChangePhone(e) {

        this.setState({phone: e.target.value});
    }

    ShowSucMessage(e) {
        swal(e);
    }

    ShowloginMessage(e, s) {
        swal(e, '', s);
    }


    handleChangeEmail(e) {

        this.setState({email: e.target.value});
    }


    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        document.title = "ثبت نام"
        this.mounted = true;
        this.setState({
            isLoaded: true,
        });

    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }


    LoginHandler(e) {
        //   this.setState({ fromInput: e.target.value })

        e.preventDefault();
        if (this.state.email === "" && this.state.password === "" && this.state.name === "") {
            this.ShowloginMessage('اطلاعاتی وارد نشده', 'error')
        } else {
            this.ShowloginMessage('در حال ثبت نام', 'info');


            if (this.mounted) {
                const requestOptions = {
                    method: 'post',
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({
                        'email': this.state.email,
                        'password': this.state.password,
                        'phone': this.state.phone
                    })
                };

                fetch(this.getCookie('__react_session__')['url'] + "/users", requestOptions)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                isLoaded: true,
                                data: result,
                                formInput: ''
                            });

                            if (this.state.password != this.state.passwordagain) {
                                this.ShowloginMessage('تکرار رمز عبور به درستی وارد نشده', 'error');
                            } else {

                                if (result.id != null) {
                                    this.ShowloginMessage('ثبت نام با موفقیت انجام شد', 'success');
                                    this.props.history.push("/login");
                                } else {

                                    if (result.statusCode === 400) {
                                        this.ShowloginMessage('اطلاعات به درستی وارد نشده', 'error');
                                    }

                                    if (result.statusCode === 403) {
                                        this.ShowloginMessage('اطلاعات وارد شده در سیستم وجود دارد', 'error');
                                    }

                                }
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

        return (

            <div style={{backgroundColor: '#009393', height: '100vh', overflow: 'hidden'}}>
                <HeaderIndex/>

                <Container>

                    <Col md={5} className="mx-auto mt-3">
                        <Jumbotron style={{
                            boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
                            backgroundColor: 'white'
                        }}>

                            <Form onSubmit={this.LoginHandler.bind(this)} style={{textAlign: 'right'}}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>شماره موبایل</Form.Label>
                                    <Form.Control style={{border: '1px solid #24a2a2'}} type="phone"
                                                  placeholder="09123456789"
                                                  onChange={this.handleChangePhone.bind(this)} required/>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>ایمیل</Form.Label>
                                    <Form.Control style={{border: '1px solid #24a2a2'}} type="email"
                                                  placeholder="ایمیل را وارد کنید"
                                                  onChange={this.handleChangeEmail.bind(this)} required/>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>رمز عبور</Form.Label>
                                    <Form.Control style={{border: '1px solid #24a2a2'}} type="password"
                                                  placeholder="بیشتر از ۸ کاراکتر"
                                                  onChange={this.handleChangePassword.bind(this)} required/>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>تکرار رمز عبور</Form.Label>
                                    <Form.Control style={{border: '1px solid #24a2a2'}} type="password"
                                                  placeholder="رمز عبور را وارد کنید"
                                                  onChange={this.handleChangePasswordAgain.bind(this)} required/>
                                </Form.Group>

                                <Button className="btnp" style={{backgroundColor: '#24A2A2', border: 0}} type="submit"
                                        size="lg" block>
                                    ثبت نام
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


export default Register;
