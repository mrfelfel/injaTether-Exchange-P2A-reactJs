import React, {Component} from 'react';

// import header panel
import HeaderPanel from './Layouts/HeaderPanel';

import Loading from '../Loading';
import '../Css/Panel.css';
import BoxshowKyc from "./BoxshowKyc";
import axios from "axios";
import {Card, Col, Row, Table, Form} from "react-bootstrap";
import {Shamsi, Miladi} from 'basic-shamsi'
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";

class Dashboard extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            orders: '',
            order: '',
            showOrder: '',
            usdtPriceSell: null,
            usdtPriceBuy: null,
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
        //    console.log(this.props)

        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.get(this.getCookie('__react_session__')['url'] + "/orders")
                .then(response => {
                    this.setState({
                        orders: response.data,
                    })
                    if (response.status === 401) {
                        window.location.replace("/login");
                    }
                });
        } catch (e) {
        }
    }

    orderDetail(id, e) {
        this.setState({
            showOrder: true
        })
        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.post(this.getCookie('__react_session__')['url'] + "/orders/one", {id})
                .then(response => {
                    this.setState({
                        order: response.data[0],
                    })
                    if (response.status === 401) {
                        window.location.replace("/login");
                    }
                });
        } catch (e) {
        }
    }

    backToOrders(e) {
        this.setState({
            order: ''
        })
    }


    render() {

        const {error, isLoaded, data, orders, order} = this.state;


        return (
            <div>

                <HeaderPanel/>

                <div className="paddingtop">

                    <BoxshowKyc></BoxshowKyc>

                    {(order === "") ?
                        <Card style={{marginTop: '2rem'}}>
                            <Card.Body>

                                <Table hover responsive>
                                    <thead>
                                    <tr style={{textAlign: 'center'}}>
                                        <th>#</th>
                                        <th>ارز</th>
                                        <th>خرید/فروش</th>
                                        <th>مقدار</th>
                                        <th>به ارزش</th>
                                        <th>وضعیت</th>
                                        <th>مشاهده</th>
                                        <th>تاریخ ایجاد</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                    {(orders !== "") ? orders.map(item => (

                                        <tr key={Math.random()} style={{textAlign: 'center'}}>
                                            <td> {item.id}</td>
                                            <td> {item.currency}</td>
                                            <td style={{color: 'green'}}>{item.type === 'Buy' && 'خرید از ما'}{item.type === 'Sell' && 'فروش به ما'}</td>
                                            <td> {item.value.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                            <td> {item.cost.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                            <td> {item.status === 0 &&
                                            <p style={{color: 'orange'}}>در انتظار برسی</p>}{item.status === 1 &&
                                            <p style={{color: 'green'}}>انجام شده</p>}{item.status === 2 &&
                                            <p style={{color: 'red'}}>رد شده</p>}</td>
                                            <td><Button variant="contained" color="primary"
                                                        onClick={this.orderDetail.bind(this, item.id)}>جزئیات
                                                سفارش</Button></td>
                                            <td>{Miladi.toShamsi(item.created_at)}</td>
                                        </tr>
                                    )) : <tr>شما هیچ سفارشی ثبت نکردید</tr>}

                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                        :
                        <div>

                            <Row style={{textAlign: 'justify', marginBottom: '2rem'}}>

                                <Col md={7}>
                                    <Card style={{marginTop: '2rem'}}>
                                        <Card.Body>

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="3">
                                                    شماره سفارش
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly defaultValue={order.id}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    ارز
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly defaultValue={order.currency}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    نوع سفارش
                                                </Form.Label>

                                                {order.type === "Buy" &&
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue='خرید از ما'/>
                                                </Col>
                                                }

                                                {order.type === "Sell" &&
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue='فروش به ما'/>
                                                </Col>
                                                }

                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    قیمت هر واحد
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue={order.price.toLocaleString(undefined, {maximumFractionDigits: 2})}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    مقدار
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue={order.value.toLocaleString(undefined, {maximumFractionDigits: 2})}/>
                                                </Col>
                                            </Form.Group>

                                            {order.type === "Buy" &&
                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    ارزش سفارش
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue={order.currency + '  ' + order.cost.toLocaleString(undefined, {maximumFractionDigits: 2})}/>
                                                </Col>
                                            </Form.Group>
                                            }

                                            {order.type === "Sell" &&
                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    ارزش سفارش
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue={order.cost.toLocaleString(undefined, {maximumFractionDigits: 2}) + ' تومان '}/>
                                                </Col>
                                            </Form.Group>
                                            }

                                            {order.tx_id !== null &&
                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    شماره تراکنش
                                                </Form.Label>
                                                <Col sm="12">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue={order.tx_id}/>
                                                </Col>
                                            </Form.Group>
                                            }

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    کیف پول
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue={order.wallet}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    تاریخ ثبت سفارش
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control plaintext readOnly
                                                                  defaultValue={Miladi.toShamsi(order.created_at)}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                <Form.Label column sm="4">
                                                    وضعیت سفارش
                                                </Form.Label>
                                                <Col sm="8">
                                                    {order.status === 0 &&
                                                    <p style={{color: 'orange'}}>در انتظار
                                                        برسی</p>}{order.status === 1 &&
                                                <p style={{color: 'green'}}>انجام شده</p>}{order.status === 2 &&
                                                <p style={{color: 'red'}}>رد شده</p>}
                                                </Col>
                                            </Form.Group>

                                            <p style={{color:'red'}}>در صورت بروز هر مشکلی برای ما تیکت ارسال کنید</p>
                                            <Link as={Link} to="/panel/tickets"><Button className="mx-auto"
                                                                                        color="primary"
                                                                                        variant="contained">
                                                ارسال تیکت
                                            </Button></Link>

                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={5}>
                                    <Card style={{marginTop: '2rem'}}>
                                        <Card.Body>
                                            <Button  variant="contained" color="primary"
                                                     className="mx-auto"   onClick={this.backToOrders.bind(this)}>برگشت به لیست سفارشات</Button>
                                            <br></br>
                                            <br></br>
                                        </Card.Body>
                                    </Card>
                                </Col>

                            </Row>
                        </div>
                    }


                </div>

            </div>
        );

    }

}


export default Dashboard;
