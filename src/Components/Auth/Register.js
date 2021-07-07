import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Jumbotron } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

import swal from 'sweetalert';

// import header index
import HeaderIndex from '../Layouts/HeardeIndex';


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            s: 'marketbase',
            d: 'irt',
            dd: 'irt',
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

        this.setState({ password: e.target.value });
    }

    handleChangeName(e) {

        this.setState({ name: e.target.value });
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
        if (this.state.email === "" && this.state.password === "" && this.state.name === "") { this.ShowloginMessage('اطلاعاتی وارد نشده', 'error') } else {
            this.ShowloginMessage('در حال ثبت نام', 'info');


            if (this.mounted) {
                const requestOptions = {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ 'email': this.state.email, 'password': this.state.password, 'name': this.state.name })
                };

                fetch(this.getCookie('__react_session__')['url']  + "/api/v1/register", requestOptions)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                isLoaded: true,
                                data: result,
                                formInput: ''
                            });


                            if (result.status === 'ok') {
                                this.ShowloginMessage('ثبت نام با موفقیت انجام شد', 'success');
                                this.props.history.push("/login");
                            } else {

                                if (result.error.name == 'The name field is required.') {
                                    this.ShowloginMessage('نام کاربری خالی است', 'error');
                                }

                                if (result.error.email !== '') {
                                    this.ShowloginMessage('نام کاربری و یا ایمیل شما تکراری است', 'error');
                                }
                                if (result.error.name !== '') {
                                    this.ShowloginMessage('نام کاربری و یا ایمیل شما تکراری است', 'error');
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

            <div style={{backgroundColor:'#009393'}}>
                <HeaderIndex />

                <Container>

                    <Col md={5} className="mx-auto mt-5">
                        <Jumbotron style={{
                            boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
                            backgroundColor: 'white'
                        }}>

                            <Form onSubmit={this.LoginHandler.bind(this)} style={{textAlign: 'right'}}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>نام کاربری</Form.Label>
                                    <Form.Control style={{border:'1px solid #24a2a2'}} type="name" placeholder="نام کاربری خود را وارد کنید" onChange={this.handleChangeName.bind(this)} required />
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>ایمیل</Form.Label>
                                    <Form.Control style={{border:'1px solid #24a2a2'}} type="email" placeholder="ایمیل را وارد کنید" onChange={this.handleChangeEmail.bind(this)} required />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>رمز عبور</Form.Label>
                                    <Form.Control style={{border:'1px solid #24a2a2'}} type="password" placeholder="رمز عبور را وارد کنید" onChange={this.handleChangePassword.bind(this)} required />
                                </Form.Group>
                                <Button className="btnp" style={{backgroundColor:'#24A2A2',border:0}} type="submit" size="lg" block>
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
