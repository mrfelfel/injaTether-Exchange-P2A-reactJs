import React, {Component} from 'react';

// import header panel
import HeaderPanel from './Layouts/HeaderPanel';

import '../Css/Panel.css';
import logoToman from '../img/logoToman.png';
import {Card, Col, FormControl, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {Icon} from "coinmarketcap-cryptocurrency-icons";
import {io} from "socket.io-client";
import NumberFormat from 'react-number-format';

class BuySell extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            usdtPriceSell: null,
            usdtPriceBuy: null,
            isLoaded: false,
            items: [],
            SellOrBuy: 'Buy',
            UsdtValueBuy:'',
            UsdtValueSell:'',
        };

    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        this.mounted = true;
        document.title = "داشبورد"

        const socket = io('http://localhost:4000');
        socket.on('connect', function() {
            console.log('Connected');

           /* socket.emit('events', { test: 'test' });
            socket.emit('identity', response =>
                console.log('identity:', response),
            );*/
        });
        socket.on('events', function(data) {
            console.log('event', data);
        });
        socket.on('identity', (data) => {
            this.setState({
                usdtPriceSell: data.sell,
                usdtPriceBuy: data.buy
            })
        });
        socket.on('exception', function(data) {
            console.log('event', data);
        });
        socket.on('disconnect', function() {
            console.log('Disconnected');
        });

        /*socket.emit('identity', (response) => {
            console.log(response)
            this.setState({
                usdtPrice: response
            })
        });*/

    }

    handleChangeTypeOrder(type,e) {
        this.setState({
            SellOrBuy: type
        })
    }

    handleTomanToUsdt(e) {
       let value = e.target.value / this.state.usdtPriceSell
        this.setState({
            UsdtValueBuy: value
        })
    }

    handleUsdtToToman(e) {
        let value = e.target.value * this.state.usdtPriceBuy
        this.setState({
            UsdtValueSell: value
        })
    }

    render() {

        const {error, isLoaded, data, usdtPriceSell, usdtPriceBuy, SellOrBuy, UsdtValueBuy, UsdtValueSell} = this.state;


        return (
            <div>

                <HeaderPanel/>

                <div className="paddingtop">
                    <Row>
                        <Col md={8}>
                            <Card>
                                <Card.Body>

                                    <ToggleButtonGroup className='center' style={{display: 'flex', width: '100%'}}
                                                       type="radio"
                                                       size='lg' name="options" defaultValue={1}>

                                        <ToggleButton onClick={this.handleChangeTypeOrder.bind(this,'Sell')} style={{backgroundColor: '#02b7b7', border: '0'}}
                                                      value="sell">فروش به ما {usdtPriceBuy} </ToggleButton>
                                        <ToggleButton value="buy" onClick={this.handleChangeTypeOrder.bind(this,'Buy')} style={{
                                            backgroundColor: '#009494',
                                            border: '0'
                                        }}>خرید از ما {usdtPriceSell} </ToggleButton>

                                    </ToggleButtonGroup>

                                    {SellOrBuy === "Buy" &&
                                    <Row style={{textAlign: 'justify'}}>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{textAlign: 'right'}}><img src={logoToman}
                                                                                              alt="Logo"/>میدهید</Form.Label>
                                                <Form.Control onChange={this.handleTomanToUsdt.bind(this)} type='number' placeholder=''/>
                                            </Form.Group>
                                        </Col>
                                            <Col md={6}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label style={{textAlign: 'right'}}><Icon i='usdt' size={36}/>میگیرید</Form.Label>
                                                <Form.Control value={UsdtValueBuy.toLocaleString(undefined, {maximumFractionDigits:2})} disabled/>
                                            </Form.Group>
                                            </Col>
                                    </Row>
                                    }

                                    {SellOrBuy === "Sell" &&
                                    <Row style={{textAlign: 'justify'}}>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{textAlign: 'right'}}><Icon i='usdt' size={36}/>میدهید</Form.Label>
                                                <Form.Control onChange={this.handleUsdtToToman.bind(this)} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{textAlign: 'right'}}><img src={logoToman}
                                                                                              alt="Logo"/>میگیرید</Form.Label>
                                                <Form.Control value={UsdtValueSell.toLocaleString(undefined, {maximumFractionDigits:2})} disabled/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    }

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </div>
        );

    }

}


export default BuySell;
