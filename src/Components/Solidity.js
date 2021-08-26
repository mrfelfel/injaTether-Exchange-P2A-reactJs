import React, {Component} from 'react';
import {Col, Container, Row, Form, Card} from "react-bootstrap";

import Web3 from 'web3';
import {TODO_LIST_ABI, TODO_LIST_ADDRESS} from './Solidity/Config'
import {Button} from "@material-ui/core";
import swal from 'sweetalert';


class Solidity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: [],
            NewUserId: '',
            blockHash: '',
            statusReq: '',
            gasUsed: '',
            dataIndex:'',
            dataUserShow:'',
            dataUserShowErr:'',
            status:'',
        };

    }

    ShowloginMessage(e, s) {
        swal(e, '', s);
    }

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || "https://mainnetttt.infura.io/")
        const network = await web3.eth.net.getNetworkType();
        console.log(network)
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState({account: accounts[0]})

        const contract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
        this.setState({contract})

        //  const taskCount = await todoList.methods.newUser("1").send({from:this.state.account});
        //  console.log(taskCount)

        // web3.eth.getBalance('0x8FDC3A81bD919872835D9287511C756c01367b38' , function(err, res){
        //     console.log("getBalance: "+res); //Displaying 0 //https://ropsten.etherscan.io/address/0x0346d2e50E29065b3b3c73B878FaFDcEb8Ee13f0
        //
        // });
    }

    async NewUser(e) {
        try {
            const NewUserReq = await this.state.contract.methods.newUser(this.state.NewUserId).send({from: this.state.account});
            console.log(NewUserReq)
            this.setState({
                blockHash: NewUserReq.transactionHash,
                statusReq: NewUserReq.status,
                gasUsed: NewUserReq.gasUsed,
            })
            if(NewUserReq.status === true){
                this.setState({
                    status: "عملیات موفقیت آمیز بود",
                })
            }else{
                this.setState({
                    status: "عملیات به ارور خورد",
                })
            }
           await swal('blockHash : ' + NewUserReq.transactionHash + ' - '
               + 'gasUsed : ' + NewUserReq.gasUsed
               + ' - ' + this.state.status , {
                button: false,
            });
        } catch (e) {
            console.log(e)
        }
    }

    async addDataToId(e) {
        try {
            const addData = await this.state.contract.methods.addData(this.state.UserId, this.state.dataStore).send({from: this.state.account});
            console.log(addData)
            this.setState({
                blockHash: addData.transactionHash,
                statusReq: addData.status,
                gasUsed: addData.gasUsed,
            })
            if(addData.status === true){
                this.setState({
                    status: "عملیات موفقیت آمیز بود",
                })
            }else{
                this.setState({
                    status: "عملیات به ارور خورد",
                })
            }
            await swal('blockHash : ' + addData.transactionHash + ' - '
                + 'gasUsed : ' + addData.gasUsed
                + ' - ' + this.state.status , {
                button: false,
            });
        } catch (e) {
            console.log(e)
        }
    }

    async addDataToIdEdit(e) {
        try {
            const addData = await this.state.contract.methods.setData(this.state.UserId, this.state.dataIndex,  this.state.dataStore).send({from: this.state.account});
            console.log(addData)
            this.setState({
                blockHash: addData.transactionHash,
                statusReq: addData.status,
                gasUsed: addData.gasUsed,
            })
            if(addData.status === true){
                this.setState({
                    status: "عملیات موفقیت آمیز بود",
                })
            }else{
                this.setState({
                    status: "عملیات به ارور خورد",
                })
            }
            await swal('blockHash : ' + addData.transactionHash + ' - '
                + 'gasUsed : ' + addData.gasUsed
                + ' - ' + this.state.status , {
                button: false,
            });
        } catch (e) {
            console.log(e)
        }
    }

    async getUserData(){
        try {
        const dataUser = await this.state.contract.methods.getUserData(this.state.UserId, this.state.dataIndex).call();
        this.setState({
            dataUserShow: dataUser,
            dataUserShowErr:''
        })
        } catch (e) {
            this.setState({
                dataUserShowErr: e
            })
        }
    }

    handleNewUserData(e) {
        this.setState({
            NewUserId: e.target.value,
        })
    }

    handleAddUserDataId(e) {
        this.setState({
            UserId: e.target.value,
        })
    }

    handleAddUserDataData(e) {
        this.setState({
            dataStore: e.target.value,
        })
    }

    handleAddUserDataIndex(e) {
        this.setState({
            dataIndex: e.target.value,
        })
    }

    async CheckWallet() {
        if (window.ethereum) { //check if Metamask is installed
            try {
                const address = await window.ethereum.enable(); //connect Metamask
                const obj = {
                    connectedStatus: true,
                    status: "",
                    address: address
                }
                return obj;

            } catch (error) {
                return {
                    connectedStatus: false,
                    status: "🦊 Connect to Metamask using the button on the top right."
                }
            }

        } else {
            return {
                connectedStatus: false,
                status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
            }
        }
    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

    componentWillMount() {
        this.loadBlockchainData()
        this.CheckWallet()
    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        this.mounted = true;
        document.title = "اینجاتتر"

    }



    render() {

        const {account, blockHash, statusReq, gasUsed, dataUserShow, dataUserShowErr} = this.state;

        return (

            <div>


                <Container>

                    {(account !== undefined) ?

                    <Row className="vertical-center">
                        <Col md={5} style={{margin: 'auto'}}>

                           {/* {blockHash !== "" &&
                            <p>blockHash : {blockHash}</p>
                            }
                            {statusReq === true &&
                            <p style={{color: 'green'}}>تراکنش موفقیت آمیز بود</p>
                            }
                            {statusReq === false &&
                            <p style={{color: 'red'}}>تراکنش به ارور خورد</p>
                            }
                            {gasUsed !== "" &&
                            <p>gasUsed: {gasUsed}</p>
                            }*/}

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <p>Your wallet : {account}</p>
                                <Form.Label style={{textAlign: 'right', float: 'right'}}> ثبت آی دی</Form.Label>
                                <Form.Control onChange={this.handleNewUserData.bind(this)} type="number"
                                              placeholder="Enter Id"/>
                            </Form.Group>
                            <Button onClick={this.NewUser.bind(this)}
                                    style={{width: ' 100%'}} size="large"
                                    className="mx-auto"
                                    color="primary"
                                    variant="contained">
                                درخواست
                            </Button>


                            <Form.Group className="mb-3 mt-1" controlId="formBasicEmail">
                                <Form.Label style={{textAlign: 'right', float: 'right'}}>اضافه کردن دیتا به آی دی</Form.Label>
                                <Form.Control onChange={this.handleAddUserDataId.bind(this)} type="number"
                                              placeholder="Enter id"/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control onChange={this.handleAddUserDataData.bind(this)} type="text"
                                              placeholder="Enter data"/>
                            </Form.Group>
                            <Button onClick={this.addDataToId.bind(this)}
                                    style={{width: ' 100%'}} size="large"
                                    className="mx-auto"
                                    color="primary"
                                    variant="contained">
                                درخواست
                            </Button>


                            <Form.Group className="mb-3 mt-1" controlId="formBasicEmail">
                                <Form.Label style={{textAlign: 'right', float: 'right'}}>نمایش اطلاعات کاربر</Form.Label>
                                <Form.Control onChange={this.handleAddUserDataId.bind(this)} type="number"
                                              placeholder="Enter id"/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control onChange={this.handleAddUserDataIndex.bind(this)} type="text"
                                              placeholder="Enter indexData"/>
                            </Form.Group>
                            {dataUserShow !== "" &&
                            <p>{dataUserShow}</p>
                            }
                            {dataUserShowErr.code === -32000 &&
                            <p>اطلاعات پیدا نشد</p>
                            }
                            <Button onClick={this.getUserData.bind(this)}
                                    style={{width: ' 100%'}} size="large"
                                    className="mx-auto"
                                    color="primary"
                                    variant="contained">
                                نمایش اطلاعات
                            </Button>



                            <Form.Group className="mb-3 mt-1" controlId="formBasicEmail">
                                <Form.Label style={{textAlign: 'right', float: 'right'}}>ویرایش اطلاعات</Form.Label>
                                <Form.Control onChange={this.handleAddUserDataId.bind(this)} type="number"
                                              placeholder="Enter id"/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control onChange={this.handleAddUserDataData.bind(this)} type="text"
                                              placeholder="Enter data"/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control onChange={this.handleAddUserDataIndex.bind(this)} type="number"
                                              placeholder="Enter Index data"/>
                            </Form.Group>
                            <Button onClick={this.addDataToIdEdit.bind(this)}
                                    style={{width: ' 100%'}} size="large"
                                    className="mx-auto"
                                    color="primary"
                                    variant="contained">
                                درخواست ویرایش
                            </Button>


                        </Col>
                    </Row>

                 : <p>لطفا ولت خود را به سایت متصل کنید و بعد از اتصال صفحه خود را رفرش کنید</p> }

                </Container>

            </div>

        )
    }
}

export default Solidity;
