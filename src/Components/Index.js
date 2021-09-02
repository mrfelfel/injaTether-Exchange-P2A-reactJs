import React, {Component} from 'react';

// import header index
import HeaderIndex from './Layouts/HeardeIndex';
//import css

import './Css/index.css';

// import react router
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Card, CardDeck, Button, Container, Row, Form} from 'react-bootstrap';
import {io} from "socket.io-client";
import logoToman from './img/logoToman.png';
import {Icon} from "coinmarketcap-cryptocurrency-icons";
import axios from "axios";


class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            usdtPriceSell: null,
            usdtPriceBuy: null,
            UsdtValueBuy: '',
            UsdtValueSell: '',
        };
    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;
    }

    componentDidMount(props) {
        this.mounted = true;
        document.title = "اینجاتتر"


        try {
            axios.post(this.getCookie('__react_session__')['url'] + "/coins/single",{sign:'usdt'})
                .then(response => {

                    if (response.data.status !== 304) {
                        this.setState({
                            usdtPriceSell: response.data.sellPrice,
                            usdtPriceBuy: response.data.buyPrice
                        })
                    } else {
                    }

                });
        } catch (e) {
        }

    }

    handleTomanToUsdt(e) {
        let value = e.target.value / this.state.usdtPriceSell
        this.setState({
            RequestedToman: e.target.value,
            UsdtValueBuy: value,
            SellOrBuy: 'Buy'
        })
    }

    handleUsdtToToman(e) {
        let value = e.target.value * this.state.usdtPriceBuy
        this.setState({
            UsdtValueSell: value,
            SellOrBuy: 'Sell'
        })
    }

    render() {

        const {usdtPriceSell, usdtPriceBuy, UsdtValueSell, UsdtValueBuy} = this.state;

        return (

            <div style={{backgroundColor: '#009393'}}>

                <HeaderIndex/>

                <Container style={{backgroundColor: '#009393', border: 0}}>


                    <Row className="vertical-center">

                        <div className="col-md-4" style={{marginLeft: 0, marginRight: 'auto'}}>
                            <Card className="text-center mx-auto" style={{
                                textAlign: 'center'
                                , backgroundColor: '#24A2A2'
                                , boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px'
                                , color: 'white'
                            }}>

                                <h3 className='p-3'>خرید تتر از ما</h3>
                                <Card.Body>

                                    <Form>
                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}><img src={logoToman}
                                                                                      alt="Logo"/> میدهید</Form.Label>
                                            <Form.Control type="number" placeholder={usdtPriceSell}
                                                          onChange={this.handleTomanToUsdt.bind(this)}/>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}><Icon i='usdt'
                                                                                       size={36}/> میگیرید</Form.Label>
                                            <Form.Control placeholder='1'
                                                          value={UsdtValueBuy.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                                          disabled/>
                                        </Form.Group>

                                        <Link as={Link} to="/register"><Button size="lg" variant="outline-light"
                                                                               type="submit">
                                            خرید
                                        </Button></Link>
                                    </Form>

                                </Card.Body>

                            </Card>
                        </div>

                        <div className="col-md-4" style={{marginRight: 0, marginLeft: 'auto'}}>
                            <Card className="text-center " style={{
                                boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px'
                            }}>
                                <h3 className='p-3' style={{color: '#24a2a2'}}>فروش تتر به ما</h3>
                                <Card.Body>

                                    <Form>
                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}><Icon i='usdt'
                                                                                       size={36}/> میدهید</Form.Label>
                                            <Form.Control style={{border: '2px solid #24a2a2'}} type="number"
                                                          onChange={this.handleUsdtToToman.bind(this)} placeholder='1'/>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}><img src={logoToman}
                                                                                      alt="Logo"/> میگیرد</Form.Label>
                                            <Form.Control style={{border: '2px solid #24a2a2'}}
                                                          placeholder={usdtPriceBuy}
                                                          value={UsdtValueSell.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                                          disabled/>
                                        </Form.Group>

                                        <Link as={Link} to="/register"><Button size="lg" variant="secondary"
                                                                               type="submit"
                                                                               style={{
                                                                                   backgroundColor: '#24A2A2',
                                                                                   border: 0
                                                                               }}>
                                            فروش
                                        </Button></Link>
                                    </Form>

                                </Card.Body>
                            </Card>
                        </div>

                    </Row>


                </Container>

            </div>

        )
    }
}

export default Index;
