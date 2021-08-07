import React, {Component} from 'react';

// import header panel
import HeaderPanel from './Layouts/HeaderPanel';

import Loading from '../Loading';
import '../Css/Panel.css';
import axios from "axios";
import {Card, Table, Form, Row} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Miladi} from "basic-shamsi";
import swal from "sweetalert";

class Tickets extends Component {


    constructor(props) {
        super(props);
        this.state = {
            comments: '',
            data: '',
            text: '',
            ticket_id: '',
            error: null,
            isLoaded: false,
            addNewTicket: '',
            title: '',
            message: '',
        };

    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        this.mounted = true;
        document.title = "تیکت ها"
        //    console.log(this.props)
        this.GetTicketsList()

    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

    GetTicketsList(e) {

        axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
        axios.post(this.getCookie('__react_session__')['url'] + "/tickets/all")
            .then(response => {
                this.setState({
                    data: response.data,
                })
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
    }

    showTicketComment(id, e) {

        axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
        axios.post(this.getCookie('__react_session__')['url'] + "/tickets/comment/all", {
            ticket_id: id
        })
            .then(response => {
                this.setState({
                    comments: response.data,
                    ticket_id: id,
                })
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
    }

    SendComment(e) {

        axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
        axios.post(this.getCookie('__react_session__')['url'] + "/tickets/comment/next", {
            ticket_id: this.state.ticket_id,
            text: this.state.text
        })
            .then(response => {
                axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
                axios.post(this.getCookie('__react_session__')['url'] + "/tickets/comment/all", {
                    ticket_id: this.state.ticket_id,
                })
                    .then(response => {
                        this.setState({
                            comments: response.data,
                        })
                        if (response.status === 401) {
                            window.location.replace("/login");
                        }
                    });
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
    }

    backToTicketsList(e) {
        this.setState({
            comments: "",
        })
    }

    handleTextBox(e) {
        this.setState({text: e.target.value});
    }

    addNewTicket(e) {
        this.setState({addNewTicket: true});
    }

    handleTitle(e) {
        console.log(e.target.value)
        this.setState({title: e.target.value});
    }

    handleMessage(e) {
        this.setState({message: e.target.value});
    }

    sendTicket(e) {

        if (this.state.title !== '' && this.state.message !== '') {

            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.post(this.getCookie('__react_session__')['url'] + "/tickets", {
                title: this.state.title,
                message: this.state.message
            })
                .then(response => {
                    this.setState({
                        addNewTicket: '',
                    })
                    if (response.status === 401) {
                        window.location.replace("/login");
                    }
                    axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
                    axios.post(this.getCookie('__react_session__')['url'] + "/tickets/all")
                        .then(response => {
                            this.setState({
                                data: response.data,
                            })
                            if (response.status === 401) {
                                window.location.replace("/login");
                            }
                        });
                });
        } else {
            this.ShowMessage('تمام فیلد ها پر نشده', 'error');
        }
    }

    ShowMessage(e, s) {
        swal(e, '', s);
    }

    render() {

        const {error, isLoaded, data, comments, addNewTicket} = this.state;


        return (
            <div>

                <HeaderPanel/>

                <div className="paddingtop">

                    {(addNewTicket === '') ?
                        <Card>
                            <Card.Body>
                                <Row>
                                    {comments === "" &&
                                    <Button onClick={this.addNewTicket.bind(this)} style={{float: 'right'}}
                                            variant="contained" color="primary">
                                        ایجاد تیکت جدید
                                    </Button>
                                    }
                                    {comments === "" &&
                                    <h5 style={{textAlign: 'right', marginRight: '2rem'}}>تیکت های شما</h5>
                                    }
                                </Row>
                                {comments !== "" &&
                                <Button onClick={this.backToTicketsList.bind(this)} style={{float: 'right'}}
                                        variant="contained" color="primary">
                                    برگشت به تیکت ها
                                </Button>
                                }
                                <br/>
                                {(comments === "") ?
                                    <Table hover responsive>
                                        <thead>
                                        <tr style={{textAlign: 'center'}}>
                                            <th>#</th>
                                            <th>عنوان</th>
                                            <th>وضعیت</th>
                                            <th>مشاهده</th>
                                            <th>ایجاد</th>
                                            <th>بروزرسانی</th>
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {(data !== "") ? data.map(item => (

                                            <tr key={Math.random()} style={{textAlign: 'center'}}>
                                                <td> {item.id}</td>
                                                <td> {item.title}</td>
                                                <td>{item.status === "pending" &&
                                                <p style={{color: 'orange'}}>منتظر پاسخ پشتیبان</p>}
                                                    {item.status === "answer" &&
                                                    <p style={{color: 'green'}}>پاسخ داده شد</p>}
                                                </td>
                                                <td><Button variant="contained" color="primary"
                                                            onClick={this.showTicketComment.bind(this, item.id)}>مشاهده
                                                    تیکت</Button></td>
                                                <td>{Miladi.toShamsi(item.created_at)}</td>
                                                <td>{Miladi.toShamsi(item.updated_at)}</td>
                                            </tr>
                                        )) : <tr>شما هیچ تیکتی ندارید</tr>}

                                        </tbody>
                                    </Table>
                                    :
                                    comments.map(item => (

                                        <Card
                                            style={{backgroundColor: 'rgb(0,147,147)', color: 'white', margin: '1rem'}}>
                                            <Card.Body>
                                                <tr key={Math.random()}>
                                                    <p> {item.role === "client" && <tr>ارسال شده توسط شما</tr>}
                                                        {item.role === "admin" && <tr>ارسال شده توسط پشتیبان</tr>}</p>
                                                    <br></br>
                                                    <p>   {item.text}</p>
                                                </tr>
                                            </Card.Body>
                                        </Card>

                                    ))
                                }

                                {comments !== "" &&
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label style={{float: 'right', margin: '1rem'}}>ارسال پاسخ</Form.Label>
                                    <Form.Control onChange={this.handleTextBox.bind(this)} as="textarea" rows={3}/>
                                </Form.Group>
                                }

                                {comments !== "" &&
                                <Button style={{width: ' 100%'}} onClick={this.SendComment.bind(this)} size="large"
                                        className="mx-auto" color="primary"
                                        variant="contained">
                                    ارسال پاسخ
                                </Button>
                                }

                            </Card.Body>
                        </Card>
                        :
                        <Card>
                            <Card.Body>
                                <div>

                                    <Form.Group style={{float: 'rigth', textAlign: 'right'}}>
                                        <Form.Label>عنوان</Form.Label>
                                        <Form.Control onChange={this.handleTitle.bind(this)} required type="text"/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{float: 'right', margin: '1rem'}}>متن پیام</Form.Label>
                                        <Form.Control onChange={this.handleMessage.bind(this)} as="textarea" rows={3}/>
                                    </Form.Group>


                                    <Button style={{width: ' 100%'}} onClick={this.sendTicket.bind(this)} size="large"
                                            className="mx-auto" color="primary"
                                            variant="contained">
                                        ارسال تیکت
                                    </Button>

                                </div>
                            </Card.Body>
                        </Card>
                    }

                    <br></br>
                </div>
            </div>
        );

    }

}


export default Tickets;
