import React, {Component} from 'react';

// import header panel
import HeaderPanel from './Layouts/HeaderPanel';

import Loading from '../Loading';
import '../Css/Panel.css';
import axios from "axios";
import {Card, Table, Form, Row, DropdownButton, Dropdown} from "react-bootstrap";
import {Button} from "@material-ui/core";
import swal from "sweetalert";

class Cards extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            cards: '',
            addNewCard: '',
            bank: '',
            iban:'',
            acc:'',
            cartNumber:'',
        };

    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        this.mounted = true;
        document.title = "کارت های بانک"
        //    console.log(this.props)
        this.GetAllCards()

    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

    GetAllCards(e) {

        axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
        axios.get(this.getCookie('__react_session__')['url'] + "/cards")
            .then(response => {
                this.setState({
                    cards: response.data,
                    //cards: '',
                })
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
    }

    sendCard(e) {


        if(this.state.bank !== '' && this.state.cartNumber !== '' && this.state.iban !== '' && this.state.acc !== ''){

        axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
        axios.post(this.getCookie('__react_session__')['url'] + "/cards", {
            bank: this.state.bank,
            cardNumber: this.state.cartNumber,
            ibanNumber: this.state.iban,
            accountNumber: this.state.acc
        })
            .then(response => {
                if (response.data.id !== '' ) {
                    this.setState({
                        addNewCard: '',
                    })

                    axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
                    axios.get(this.getCookie('__react_session__')['url'] + "/cards")
                        .then(response => {
                            this.setState({
                                cards: response.data,
                                //cards: '',
                            })
                            if (response.status === 401) {
                                window.location.replace("/login");
                            }
                        });


                } else {
                }
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
        }else{
            this.ShowMessage('تمام فیلد ها پر نشده', 'error');
        }
    }

    ShowMessage(e, s) {
        swal(e, '', s);
    }

    handleChangeAddNewCard(e) {
        this.setState({addNewCard: true});
    }

    handleBank(e) {
        this.setState({bank: e.target.value});
    }
    handleIban(e) {
        this.setState({iban: e.target.value});
    }
    handleAcc(e) {
        this.setState({acc: e.target.value});
    }
    handleCart(e) {
        this.setState({cartNumber: e.target.value});
    }


    render() {


        const {error, isLoaded, data, cards, addNewCard, bank} = this.state;


        return (
            <div>

                <HeaderPanel/>

                <div className="paddingtop">
                    <Card>
                        <Card.Body>

                            {(cards !== "" && addNewCard === '') ?
                                <Button style={{float: 'right'}} className="mx-auto" color="primary"
                                        onClick={this.handleChangeAddNewCard.bind(this)} variant="contained">
                                    ثبت کارت جدید
                                </Button>
                                : ''}

                            {(cards === "") ?
                                <Button style={{float: 'right', marginLeft: '2rem'}} className="mx-auto" color="primary"
                                        onClick={this.handleChangeAddNewCard.bind(this)} variant="contained">
                                    ثبت کارت جدید
                                </Button>
                                : ''}

                            {(cards !== "" && addNewCard === '') ?

                                <Table hover responsive>
                                    <thead>
                                    <tr style={{textAlign: 'center'}}>
                                        <th>#</th>
                                        <th>بانک</th>
                                        <th>شماره کارت</th>
                                        <th>شماره حساب</th>
                                        <th>شبا</th>
                                        <th>وضعیت</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                    {(cards !== "") ? cards.map(item => (

                                        <tr key={Math.random()} style={{textAlign: 'center'}}>
                                            <td> {item.id}</td>
                                            <td> {item.bank}</td>
                                            <td> {item.cardNumber}</td>
                                            <td> {item.accountNumber}</td>
                                            <td> {item.ibanNumber}</td>
                                            <td> {item.status === 0 &&
                                            <p style={{color: 'orange'}}>در انتظار تایید</p>}{item.status === 1 &&
                                            <p style={{color: 'green'}}>تایید شده</p>}{item.status === 2 &&
                                            <p style={{color: 'red'}}>رد شده</p>}</td>
                                        </tr>
                                    )) : <tr>شما هیچ کارتی ثبت نکردید</tr>}

                                    </tbody>
                                </Table>
                                : <p style={{color: 'red', textAlign: 'right'}}></p>
                            }


                            {(addNewCard !== '') ?

                                <div>

                                    <Form.Group style={{float: 'rigth', textAlign: 'right'}}>
                                        <Form.Label>شماره کارت</Form.Label>
                                        <Form.Control onChange={this.handleCart.bind(this)} required type="number"/>
                                    </Form.Group>

                                    <Form.Group style={{float: 'rigth', textAlign: 'right'}}>
                                        <Form.Label>شماره حساب</Form.Label>
                                        <Form.Control onChange={this.handleAcc.bind(this)} required type="number"/>
                                    </Form.Group>

                                    <Form.Group style={{float: 'rigth', textAlign: 'right'}}>
                                        <Form.Label>شماره شبا بدون IR</Form.Label>
                                        <Form.Control onChange={this.handleIban.bind(this)} required type="number"/>
                                    </Form.Group>

                                    <Form.Group style={{float: 'rigth', textAlign: 'right'}}>
                                        <Form.Label>نام بانک</Form.Label>
                                        <Form.Control onChange={this.handleBank.bind(this)} required type="text"/>
                                    </Form.Group>

                                    <Button style={{width: ' 100%'}} onClick={this.sendCard.bind(this)} size="large" className="mx-auto" color="primary"
                                            variant="contained">
                                       ثبت کارت
                                    </Button>

                                </div>

                                : ''}

                        </Card.Body>
                    </Card>
                    <br></br>

                </div>

            </div>
        );

    }

}


export default Cards;
