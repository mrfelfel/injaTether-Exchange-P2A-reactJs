import React, {Component} from 'react';
import {Card, Row} from 'react-bootstrap';

import PlaylistAddCheckRoundedIcon from '@material-ui/icons/PlaylistAddCheckRounded';
import {Button} from "@material-ui/core";
import axios from "axios";
import {Link} from "react-router-dom";

class BoxshowKyc extends Component {


    constructor(props) {
        super(props);
        this.state = {
            profile: '',
            cards: '',
        };

    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

    componentDidMount(props) {
        this.mounted = true;
        try {

            const requestOptions = {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': ' Bearer ' + this.getCookie('__react_session__')['token']
                }
            };

            fetch(this.getCookie('__react_session__')['url'] + "/auth/profile", requestOptions)
                .then(res => res.json())
                .then(
                    async (result) => {
                        this.setState({
                            profile: result
                        })
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                    }
                )
        } catch (e) {

        }

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
                    if (response.status === 401) {
                        window.location.replace("/login");
                    }

                });
        } catch (e) {
        }

    }


    render() {

        const {error, isLoaded, data, profile, cards} = this.state;


        return (
            <div>

                {(profile.status === null) ?
                    <Card style={{
                        background: 'linear-gradient(0deg, rgba(0,147,147,1) 0%, rgba(3,189,189,1) 100%)'
                        , border: '0px solid rgba(0,0,0,.125)'
                        , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                        , textAlign: 'Right',
                    }}>
                        <Card.Body>
                            <Row className='mx-auto'>
                                <PlaylistAddCheckRoundedIcon
                                    style={{fontSize: 50, color: 'white'}}></PlaylistAddCheckRoundedIcon>
                                <p className='center' style={{color: 'white'}}>برای خرید و فروش در سایت نیاز به احراز
                                    هویت دارید </p>
                                <Link as={Link} to="/panel/kyc"><Button className="mx-auto"
                                                                          color="info"
                                                                          variant="contained">
                                  ارسال مدارک
                                </Button></Link>
                            </Row>
                        </Card.Body>
                    </Card>
                    : ''}

                {(cards === '') ?
                    <Card style={{
                        background: 'linear-gradient(0deg, rgba(0,147,147,1) 0%, rgba(3,189,189,1) 100%)'
                        , border: '0px solid rgba(0,0,0,.125)'
                        , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                        , textAlign: 'Right',
                        marginTop: '1rem'
                    }}>
                        <Card.Body>
                            <Row className='mx-auto'>
                                <PlaylistAddCheckRoundedIcon
                                    style={{fontSize: 50, color: 'white'}}></PlaylistAddCheckRoundedIcon>
                                <p className='center' style={{color: 'black'}}>شما هنوز هیچ کارت بانکی ثبت نکردید</p>
                                <Link as={Link} to="/panel/cards"><Button className="mx-auto"
                                                                          color="info"
                                                                          variant="contained">
                                    ثبت کارت بانکی
                                </Button></Link>
                            </Row>
                        </Card.Body>
                    </Card>
                    : ''}


            </div>
        );

    }

}


export default BoxshowKyc;
