import React, {Component} from 'react';

// import header panel
import HeaderPanel from './Layouts/HeaderPanel';

import '../Css/Panel.css';
import logoToman from '../img/logoToman.png';
import {
    Card,
    Col,
    FormControl,
    Form,
    InputGroup,
    Row,
    ToggleButton,
    ToggleButtonGroup,
    Dropdown
} from "react-bootstrap";
import {Icon} from "coinmarketcap-cryptocurrency-icons";
import {io} from "socket.io-client";
import NumberFormat from 'react-number-format';
import {Button} from "@material-ui/core";
import axios from "axios";
import {Link} from "react-router-dom";
import CreditCardRoundedIcon from "@material-ui/icons/CreditCardRounded";
import swal from "sweetalert";

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
            UsdtValueBuy: '',
            UsdtValueSell: '',
            subcoinsArray: '',
            network: '',
            wallet: '',
            subCoinData: '',
            tomanFee: '',
            RequestedToman: '',
            cards: '',
            cardSelected: '',
            cardNumber: '',
            currency: 'usdt',
            priceSend: '',
            valueSend: '',
            orderStatus: '',
            firstif:'',
            orderId:'',
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
        document.title = "داشبورد"

        //get cards data
        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.get(this.getCookie('__react_session__')['url'] + "/cards/valid")
                .then(response => {
                    console.log(response.data.length)
                    if (response.data.status !== 304) {
                        this.setState({
                            cards: response.data,
                        })
                    } else {
                        this.setState({
                            cards: '',
                        })
                    }

                });
        } catch (e) {
        }


        const socket = io('http://localhost:4000');
        socket.on('connect', function () {
            console.log('Connected');

            socket.emit('events', {test: 'test'});
            socket.emit('coins', 0, response =>
                console.log('coins:', response),
            );
            socket.emit('subcoins', 0, response => {

                }
            );
        });
        socket.on('coins', (data) => {
            this.setState({
                usdtPriceSell: data[0].sellPrice,
                usdtPriceBuy: data[0].buyPrice
            })
        });
        socket.on('subcoins', (data) => {
            this.setState({
                subcoinsArray: data
            })
        });
        socket.on('exception', function (data) {
            console.log('event', data);
        });
        socket.on('disconnect', function () {
            console.log('Disconnected');
        });
        /*  const socket = io('http://localhost:4000');
          socket.on('connect', function() {
              console.log('Connected');

             /!* socket.emit('events', { test: 'test' });
              socket.emit('identity', response =>
                  console.log('identity:', response),
              );*!/
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
          });*/

        /*socket.emit('identity', (response) => {
            console.log(response)
            this.setState({
                usdtPrice: response
            })
        });*/

    }

    handleChangeTypeOrder(type, e) {
        this.setState({
            SellOrBuy: type
        })
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

    handleNetwork(sign, e) {
        this.setState({
            network: sign,
        })
        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.post(this.getCookie('__react_session__')['url'] + "/coins/single", {
                sign: sign,
            })
                .then(response => {
                    const tomanFee = response.data[0].fee * this.state.usdtPriceBuy;
                    console.log(tomanFee)
                    this.setState({
                        subCoinData: response.data[0],
                        tomanFee: tomanFee,
                    })
                });
        } catch (e) {
        }
    }

    handleWallet(e) {
        let value = e.target.value
        this.setState({
            wallet: value,
        })
    }

    handlecard(id, cardNumber, e) {
        this.setState({
            cardSelected: id,
            cardNumber: cardNumber,
        })
    }

    ShowMessage(e, s) {
        swal(e, '', s);
    }


   async SendOrder(e) {

        if (this.state.SellOrBuy === 'Buy') {
            if (this.state.UsdtValueBuy === '') {
              await this.setState({
                    firstif: false
                })
            }else{
                await this.setState({
                    firstif: true
                })
            }
        }

        if (this.state.SellOrBuy === 'Sell') {
            if (this.state.UsdtValueSell === '') {
                await this.setState({
                    firstif: false
                })
            }else{
                await  this.setState({
                    firstif: true
                })
            }
        }

        if (this.state.wallet !== '' && this.state.network !== '' && this.state.cardSelected !== ''&& this.state.firstif === true) {

            try {
                if (this.state.SellOrBuy === 'Buy') {
                    await this.setState({
                        priceSend: this.state.usdtPriceSell,
                        valueSend: this.state.UsdtValueBuy,
                        costSend: this.state.UsdtValueBuy - this.state.subCoinData.fee
                    })
                } else {
                    await  this.setState({
                        priceSend: this.state.usdtPriceBuy,
                        valueSend: this.state.UsdtValueSell,
                        costSend: this.state.UsdtValueSell
                    })
                }
                 axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
                await  axios.post(this.getCookie('__react_session__')['url'] + "/orders", {
                    type: this.state.SellOrBuy,
                    currency: this.state.currency,
                    price: this.state.priceSend,
                    value: this.state.valueSend,
                    cost: this.state.costSend,
                    wallet: this.state.wallet,
                    card_id: this.state.cardSelected,
                })
                    .then(response => {
                        this.setState({
                            orderStatus: 0,
                            orderId: response.data.id
                        })
                    });
            } catch (e) {
            }
        } else {
            await this.ShowMessage('تمام فیلد ها پر نشده', 'error');
        }
    }

    render() {

        const {
            error,
            isLoaded,
            data,
            usdtPriceSell,
            subcoinsArray,
            usdtPriceBuy,
            SellOrBuy,
            UsdtValueBuy,
            UsdtValueSell,
            network,
            wallet,
            subCoinData,
            tomanFee,
            RequestedToman,
            cards,
            cardNumber,
            cardSelected,
            orderStatus,
            orderId,
        } = this.state;

        return (
            <div>

                <HeaderPanel/>

                <div className="paddingtop">

                    {(orderStatus === '') ?
                        <Row>
                            <Col md={8}>
                                <Card>
                                    <Card.Body>


                                        <p style={{textAlign: 'right'}} className="pr-1">قصد خرید یا فروش دارید؟</p>
                                        <Row className='mb-3'>

                                            <Button value="sell" size='large'
                                                    onClick={this.handleChangeTypeOrder.bind(this, 'Sell')}
                                                    style={{width: ' 45%'}} className="mx-auto" color="primary"
                                                    variant="contained">
                                                فروش به ما {usdtPriceBuy}
                                            </Button>

                                            <Button value="buy" size='large'
                                                    onClick={this.handleChangeTypeOrder.bind(this, 'Buy')}
                                                    style={{width: ' 45%'}} className="mx-auto" color="primary"
                                                    variant="contained">
                                                خرید از ما {usdtPriceSell}
                                            </Button>

                                        </Row>


                                        {SellOrBuy === "Buy" &&
                                        <Row style={{textAlign: 'justify'}}>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label style={{textAlign: 'right'}}><img src={logoToman}
                                                                                                  alt="Logo"/><NumberFormat
                                                        value={RequestedToman} displayType={'text'}
                                                        thousandSeparator={true}/>میدهید</Form.Label>
                                                    <Form.Control onChange={this.handleTomanToUsdt.bind(this)}
                                                                  type='number'
                                                                  placeholder=''/>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label style={{textAlign: 'right'}}><Icon i='usdt' size={36}/>میگیرید(بدون
                                                        محاسبه هزینه شبکه)</Form.Label>
                                                    <Form.Control
                                                        value={UsdtValueBuy.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                                        disabled/>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        }

                                        {SellOrBuy === "Sell" &&
                                        <Row style={{textAlign: 'justify'}}>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label style={{textAlign: 'right'}}><Icon i='usdt' size={36}/>میدهید</Form.Label>
                                                    <Form.Control onChange={this.handleUsdtToToman.bind(this)}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label style={{textAlign: 'right'}}><img src={logoToman}
                                                                                                  alt="Logo"/>میگیرید(بدون
                                                        محاسبه هزینه شبکه)</Form.Label>
                                                    <Form.Control
                                                        value={UsdtValueSell.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                                        disabled/>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        }

                                        <p style={{textAlign: 'right'}} className="pr-1">شبکه درخواستی را انتخاب
                                            کنید</p>

                                        <Row>
                                            {subcoinsArray !== "" &&

                                            subcoinsArray.map(item => (
                                                <Button value={item.sign}
                                                        onClick={this.handleNetwork.bind(this, item.sign)}
                                                        style={{width: ' 45%'}} className="mx-auto" color="primary"
                                                        variant="contained">
                                                    {item.sign}
                                                </Button>
                                            ))
                                            }
                                        </Row>

                                        <Form.Group style={{textAlign: 'right'}} className="mb-3 pt-3 pr-1"
                                                    controlId="exampleForm.ControlInput1">
                                            <Form.Label>آدرس کیف پول شما</Form.Label>
                                            <Form.Control onChange={this.handleWallet.bind(this)}/>
                                        </Form.Group>
                                        <Row>
                                            <Dropdown style={{float: 'right', textAlign: 'right', marginRight: '1rem'}}>
                                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                    انتخاب کارت بانکی
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    {(cards !== '') ?
                                                        cards.map(item => (
                                                            <Dropdown.Item
                                                                onClick={this.handlecard.bind(this, item.id, item.cardNumber)}>{item.cardNumber}</Dropdown.Item>
                                                        )) : 'کارتی وجود ندارد'}

                                                </Dropdown.Menu>
                                            </Dropdown>


                                            {cards === '' &&
                                            <p style={{textAlign: 'center', color: 'red', marginRight: '2rem'}}>لطفا
                                                کارت
                                                بانکی خود را ثبت کنید</p>
                                            }
                                            {cards === '' &&
                                            <div style={{textAlign: 'left', float: 'left', marginRight: '2rem'}}>
                                                <Link as={Link} to="/panel/cards"><Button className="mx-auto"
                                                                                          color="info"
                                                                                          variant="contained">
                                                    ثبت کارت بانکی
                                                </Button></Link>
                                            </div>
                                            }
                                        </Row>

                                        <Button onClick={this.SendOrder.bind(this)}
                                                style={{width: ' 100%', marginTop: '2rem'}} size="large"
                                                className="mx-auto"
                                                color="primary"
                                                variant="contained">
                                            ثبت سفارش
                                        </Button>

                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card>
                                    <Card.Body style={{textAlign: 'center'}}>

                                        {SellOrBuy === "Buy" &&
                                        <p>شما در حال خرید تتر هستید</p>
                                        }
                                        {SellOrBuy === "Sell" &&
                                        <p>شما در حال فروش تتر هستید</p>
                                        }
                                        {SellOrBuy === "Buy" && UsdtValueBuy !== '' &&
                                        <p> به
                                            مقدار {UsdtValueBuy.toLocaleString(undefined, {maximumFractionDigits: 2})} تتر </p>
                                        }
                                        {SellOrBuy === "Sell" && UsdtValueSell !== '' &&
                                        <p> به
                                            مقدار {UsdtValueSell.toLocaleString(undefined, {maximumFractionDigits: 2})} تومان </p>
                                        }
                                        {network !== "" &&
                                        <p> با شبکه {network}</p>
                                        }
                                        {wallet !== "" &&
                                        <p> آدرس کیف پول {wallet}</p>
                                        }
                                        {/* eslint-disable-next-line no-mixed-operators */}
                                        {network !== '' && SellOrBuy === "Buy" &&
                                        <p> هزینه انتقال {subCoinData.fee}</p>
                                        }
                                        {network !== '' && SellOrBuy === "Buy" &&
                                        <p> واریزی نهایی {UsdtValueBuy - subCoinData.fee} تتر </p>
                                        }
                                        {network !== '' && SellOrBuy === "Sell" &&
                                        <p> واریزی
                                            نهایی {UsdtValueSell.toLocaleString(undefined, {maximumFractionDigits: 2})} تومان </p>
                                        }
                                        {cardNumber !== "" &&
                                        <p> شماره کارت انتخابی {cardNumber}</p>
                                        }

                                    </Card.Body>
                                </Card>
                            </Col>


                        </Row>

                        : 'در حال انتقال به درگاه پرداخت'}
                </div>

            </div>
        );

    }

}


export default BuySell;
