import React, {Component} from 'react';

// import header panel
import HeaderPanel from './Layouts/HeaderPanel';

import Loading from '../Loading';
import '../Css/Panel.css';
import {Card, Row, Form} from "react-bootstrap";
import PlaylistAddCheckRoundedIcon from "@material-ui/icons/PlaylistAddCheckRounded";
import {Button} from "@material-ui/core";
import swal from 'sweetalert';
import {Modal} from 'react-bootstrap';
import axios from 'axios';

//imprt image
import selfilearn from '../img/selfilearn.png'


class Kyc extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            setShow: true,
            data: '',
            BirthDate: '',
            selectedFileNationalId: null,
            selectedFileSelfi: null,
            selectedFileSelfi_Status: false,
            selectedFileNationalId_Status: false,
            SendEmailVerifying: false,
            SendSmsVerifying: false,
            VerifyEmailCode: false,
            VerifySmsCode: false,
            VerifyName: false,
            VerifyLastName: false,
            VerifyCity: false,
            VerifyNationalId: false,
            VerifyAddress: false,
            VerifyHomeNumber: false,
            VerifyBirthDate: false,
            VerifyFinalCheckDone: false,
        };

    }

    getCookie(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

    handleClose(e) {

        this.setState({
            setShow: false
        })
    }

    handleShow(e) {

        this.setState({
            setShow: true
        })
    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        this.mounted = true;
        document.title = "احراز هویت"
        const requestOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': ' Bearer ' + this.getCookie('__react_session__')['token']
            }
        };
        try {

            fetch(this.getCookie('__react_session__')['url'] + "/auth/profile", requestOptions)
                .then(res => res.json())
                .then(
                    async (result) => {

                        if (result.status === 'pending') {
                            await  this.setState({
                                VerifyFinalCheck: 'success',
                            })
                        }
                        if (result.status === 'done') {
                            await  this.setState({
                                VerifyFinalCheckDone: 'success',
                            })
                        }
                        if (result.city_status === 2) {
                            await  this.setState({
                                VerifyCity: 'success',
                            })
                        }
                        if (result.email_status === 2) {
                            await  this.setState({
                                VerifyEmailCode: 'success',
                            })
                        }
                        if (result.phone_status === 2) {
                            await   this.setState({
                                VerifySmsCode: 'success',
                            })
                        }
                        if (result.nationalId_image_status === 1) {
                            await this.setState({
                                selectedFileNationalId_Status: 'success',
                            })
                        }
                        if (result.selfi_image_status === 1) {
                            await  this.setState({
                                selectedFileSelfi_Status: 'success',
                            })
                        }
                        if (result.nationalId_image_status === 0) {
                            await  this.setState({
                                selectedFileNationalId_Status: 'notcorrect',
                            })
                        }
                        if (result.selfi_image_status === 0) {
                            await  this.setState({
                                selectedFileSelfi_Status: 'notcorrect',
                            })
                        }
                        if (result.name_status === 2) {
                            await   this.setState({
                                VerifyName: 'success',
                            })
                        }
                        if (result.last_name_status === 2) {
                            await this.setState({
                                VerifyLastName: 'success',
                            })
                        }
                        if (result.birthDate_status === 2) {
                            await  this.setState({
                                VerifyBirthDate: 'success',
                            })
                        }
                        if (result.address_status === 2) {
                            await this.setState({
                                VerifyAddress: 'success',
                            })
                        }
                        if (result.nationalId_status === 2) {
                            await this.setState({
                                VerifyNationalId: 'success',
                            })
                        }
                        if (result.homeNumber_status === 2) {
                           await this.setState({
                                VerifyHomeNumber: 'success',
                            })
                        }



                        await this.setState({
                            isLoaded: true,
                            data: result,
                            formInput: ''
                        });
                    },
                    (error) => {
                    }
                )
        } catch (e) {

        }
    }

    handleName(e) {
        this.setState({name: e.target.value});
        console.log(this.state.name)
    }

    handleLastName(e) {
        this.setState({lastName: e.target.value});
    }

    handlenationalId(e) {
        this.setState({nationalId: e.target.value});
    }

    handleCity(e) {
        this.setState({city: e.target.value});
    }

    handleAddress(e) {
        this.setState({address: e.target.value});
    }

    handlehomeNumber(e) {
        this.setState({homeNumber: e.target.value});
    }

    handleBirthDate(e) {
        this.setState({BirthDate: e.target.value});
    }

    handlephone(e) {
        this.setState({phone: e.target.value});
        axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
        axios.post(this.getCookie('__react_session__')['url'] + "/users/kyc/check/sms", {
            token: e.target.value,
        })
            .then(response => {
                if (response.data.status === true) {
                    this.setState({
                        VerifySmsCode: 'success',
                    })
                } else {
                    this.setState({
                        VerifySmsCode: 'not',
                    })
                }
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
    }

    handleEmail(e) {

        this.setState({email: e.target.value});
        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.post(this.getCookie('__react_session__')['url'] + "/users/kyc/check/email", {
                token: e.target.value,
            })
                .then(response => {
                    if (response.data.status === true) {
                        this.setState({
                            VerifyEmailCode: 'success',
                        })
                    } else {
                        this.setState({
                            VerifyEmailCode: 'not',
                        })
                    }
                    if (response.status === 401) {
                        window.location.replace("/login");
                    }
                });
        } catch (e) {

        }
    }

    onFileChangeNationalId = event => {
        // Update the state
        this.setState({selectedFileNationalId: event.target.files[0]});
    };

    onFileUploadNationalId() {
        // Create an object of formData
        const formData = new FormData();
        // Update the formData object
        formData.append(
            "nationalId",
            this.state.selectedFileNationalId,
            this.state.selectedFileNationalId.name
        );
        // Details of the uploaded file
        console.log(this.state.selectedFileNationalId);

        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.post(this.getCookie('__react_session__')['url'] + "/users/kyc/nationalId", formData).then
            (response => {
                if (response.status === 201) {
                    this.setState({
                        selectedFileNationalId_Status: 'success',
                    })
                }
                if (response.status === 401) {
                    window.location.replace("/login");
                }
                if (response.status === 500) {
                    this.setState({
                        selectedFileNationalId_Status: 'notcorrectfile',
                    })
                }
            }).catch((error) => {
                this.setState({
                    selectedFileNationalId_Status: 'notcorrectfile',
                })
            });
        } catch (e) {
            this.setState({
                selectedFileNationalId_Status: 'notcorrectfile',
            })
        }
    };

    onFileChangeSelfi = event => {
        // Update the state
        this.setState({selectedFileSelfi: event.target.files[0]});
    };

    onFileUploadSelfi() {
        // Create an object of formData
        const formData = new FormData();
        // Update the formData object
        formData.append(
            "selfi",
            this.state.selectedFileSelfi,
            this.state.selectedFileSelfi.name
        );

        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.post(this.getCookie('__react_session__')['url'] + "/users/kyc/selfi", formData).then
            (response => {
                if (response.status === 201) {
                    this.setState({
                        selectedFileSelfi_Status: 'success',
                    })
                }
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            }).catch((error) => {
                this.setState({
                    selectedFileSelfi_Status: 'notcorrectfile',
                })
            });
        } catch (e) {
            this.setState({
                selectedFileSelfi_Status: 'notcorrectfile',
            })
        }
    };

    SendEmailVerifying() {

        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.get(this.getCookie('__react_session__')['url'] + "/users/kyc/send/email").then
            (response => {
                if (response.status === 200) {
                    this.setState({
                        SendEmailVerifying: 'success',
                    })
                }
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
        } catch (e) {

        }
    }

    SendSmsVerifying() {

        try {
            axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
            axios.get(this.getCookie('__react_session__')['url'] + "/users/kyc/send/sms").then
            (response => {
                if (response.status === 200) {
                    this.setState({
                        SendSmsVerifying: 'success',
                    })
                }
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
        } catch (e) {

        }
    }

    SendFinalCheck(e) {
        axios.defaults.headers.common['Authorization'] = ' Bearer ' + this.getCookie('__react_session__')['token'];
        axios.post(this.getCookie('__react_session__')['url'] + "/users/kyc/check/final", {
            token: e.target.value,
            name: this.state.name,
            lastName: this.state.lastName,
            homeNumber: this.state.homeNumber,
            BirthDate: this.state.BirthDate,
            nationalId: this.state.nationalId,
            city: this.state.city,
            address: this.state.address,
        })
            .then(response => {
                if (response.data.status === true) {

                    if(this.state.VerifyEmailCode === 'success'
                        && this.state.VerifySmsCode === 'success'
                        && this.state.VerifyName !== '' &&
                        this.state.VerifyLastName !== '' &&
                        this.state.VerifyCity !== '' &&
                        this.state.VerifyNationalId !== '' &&
                        this.state.VerifyAddress !== '' &&
                        this.state.VerifyHomeNumber !== '' &&
                        this.state.VerifyBirthDate !== '' &&
                        this.state.selectedFileSelfi_Status === 'success' &&
                        this.state.selectedFileNationalId_Status === 'success'){

                        this.setState({
                            VerifyFinalCheck: 'success',
                        })
                    } else {
                    this.ShowMessage('تمام فیلد ها پر نشده', 'error');
                }

                } else {
                    this.ShowMessage('تمام فیلد ها پر نشده', 'error');
                }
                if (response.status === 401) {
                    window.location.replace("/login");
                }
            });
    }

    ShowMessage(e, s) {
        swal(e, '', s);
    }

    render() {

        const {
            VerifyName,
            VerifyLastName,
            VerifyCity,
            VerifyNationalId,
            VerifyAddress,
            VerifyHomeNumber,
            VerifyBirthDate,
            VerifyFinalCheck,
            VerifyFinalCheckDone,
            show,
            setShow,
            error,
            isLoaded,
            data,
            SendSmsVerifying,
            SendEmailVerifying,
            VerifyEmailCode,
            VerifySmsCode,
            selectedFileNationalId_Status,
            selectedFileSelfi_Status
        } = this.state;


        return (
            <div>

                <HeaderPanel/>


                <Modal
                    show={setShow}
                    onHide={this.handleClose.bind(this)}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>تایید قوانین</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <p style={{color: 'black', textAlign: 'right'}}>ضمن خوش‌آمدگویی به شما کاربر محترم
                            اینجاتتر، به اطلاع می‌رساند جهت فراهم آوردن محیطی مطمئن برای تمامی کاربران سایت،‌
                            برای خرید و فروش رمز ارز نیاز به تکمیل فرایند احراز هویت وجود دارد. لطفا پس از
                            مطالعه توضیحات زیر،‌ برای شروع فعالیت مالی در سایت اینجاتتر، فرایند احراز هویت خود
                            را آغاز نمایید. احراز هویت پایه‌ای با تایید شماره تلفن همراه و ارسال مدارک هویتی
                            (کارت ملی)، ورود آدرس محل سکونت و تلفن ثابت جهت تایید آن‌ها صورت می‌گیرد. با انجام
                            این سطح از احراز هویت می‌توانید اقدام به خرید و فروش رمز ارز نمایید. همچنین لازم به
                            توضیح است که با توجه به قوانین بانکی کشور و امکان بلوکه شدن وجوه واریزشده از
                            کارت‌های بانکی مسروقه،‌ کاربران جدید که به تازگی اقدام به ثبت و واریز وجه از طریق یک
                            کارت بانکی می‌کنند، به مدت دو روز کاری برداشت اول کاربران به طول خواهد انجامید. این
                            تاخیر صرفا جهت تایید اصالت کارت بانکی بوده و در طول این مدت کاربران می‌توانند به هر
                            میزان با وجه واریزی خود در سیستم خرید و فروش نمایند و محدودیت مذکورر صرفا مربوط به
                            خارج کردن وجه واریزی از سیستم به مدت دو روز کاری است. طبق ماده ۵۶ قانون آیین‌نامه
                            اجرایی قانون مبارزه با پولشویی، احراز هویت به کمک مدارک مشتریان جهت جلوگیری از
                            هرگونه سو استفاده احتمالی الزامی است. توجه: قرار دادن شماره همراه و اطلاعات حساب
                            کاربری در اختیار سایر اشخاص با بهانه‌هایی نظیر سرمایه‌گذاری و اجاره حساب طبق ماده ۲
                            قانون پولشویی پیگرد قانونی دارد و مجازات حبس تا هفت سال در انتظار متخلفین خواهد
                            بود.</p>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                            قبول دارم
                        </Button>
                    </Modal.Footer>
                </Modal>

                {(VerifyFinalCheck != 'success') ?
                <div className="paddingtop">
                    {(VerifyFinalCheckDone !== 'success') ?

                    <Card style={{
                        border: '0px solid rgba(0,0,0,.125)'
                        , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                        , textAlign: 'Right',
                        marginBottom: '2rem'
                    }}>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <div className='col-md-3'>

                                        {(VerifyName != 'success') ?
                                        <Form.Group>
                                            <Form.Label>نام</Form.Label>
                                            <Form.Control onChange={this.handleName.bind(this)} required type="name"
                                                          placeholder="نام به فارسی وارد شود"/>
                                        </Form.Group>
                                            : <p style={{color: 'green'}}>نام شما تایید شد</p>}

                                        {(VerifyLastName != 'success') ?
                                        <Form.Group>
                                            <Form.Label>نام خانوادگی</Form.Label>
                                            <Form.Control onChange={this.handleLastName.bind(this)} type="lastname"
                                                          placeholder=""/>
                                        </Form.Group>
                                            : <p style={{color: 'green'}}>نام خانوادگی شما تایید شد</p>}

                                        {(VerifyNationalId != 'success') ?
                                        <Form.Group>
                                            <Form.Label>کد ملی</Form.Label>
                                            <Form.Control onChange={this.handlenationalId.bind(this)} type="number"
                                                          placeholder=""/>
                                        </Form.Group>
                                            : <p style={{color: 'green'}}>کد ملی شما تایید شد</p>}

                                        {(VerifySmsCode != 'success') ?
                                            <Form.Group>
                                                <Form.Label>تایید شماره موبایل(لطفا روی ارسال کد تایید کلیک کنید و کد را
                                                    اینجا وارد کنید)</Form.Label>
                                                <Form.Control onMouseOut={this.handlephone.bind(this)} type="phone"
                                                              placeholder="کد تایید"/>
                                                <br></br>
                                                <Button className="mx-auto" onClick={this.SendSmsVerifying.bind(this)}
                                                        color="primary" variant="contained">
                                                    ارسال کد تایید
                                                </Button>
                                                {(SendSmsVerifying != 'success') ?
                                                    ''
                                                    : <p style={{color: 'orange'}}>کد تایید به همراه شما ارسال شد</p>}
                                            </Form.Group>
                                            : <p style={{color: 'green'}}>با موفقیت تایید شد</p>}
                                        {(VerifySmsCode != 'not') ?
                                            ''
                                            : <p style={{color: 'red'}}>کد اشتباه وارد شده</p>}

                                    </div>

                                    <div className='col-md-3'>
                                        {(VerifyCity != 'success') ?
                                        <Form.Group>
                                            <Form.Label>شهر</Form.Label>
                                            <Form.Control onChange={this.handleCity.bind(this)} type="city"
                                                          placeholder=""/>
                                        </Form.Group>
                                            : <p style={{color: 'green'}}>شهر شما تایید شد</p>}

                                        {(VerifyAddress != 'success') ?
                                        <Form.Group>
                                            <Form.Label>نشانی</Form.Label>
                                            <Form.Control onChange={this.handleAddress.bind(this)} type="address"
                                                          placeholder=""/>
                                        </Form.Group>
                                            : <p style={{color: 'green'}}>نشانی شما تایید شد</p>}

                                        {(VerifyHomeNumber != 'success') ?
                                        <Form.Group>
                                            <Form.Label>تلفن ثابت</Form.Label>
                                            <Form.Control onChange={this.handlehomeNumber.bind(this)} type="phone"
                                                          placeholder=""/>
                                        </Form.Group>
                                            : <p style={{color: 'green'}}>تلفن ثابت شما تایید شد</p>}

                                        {(VerifyBirthDate != 'success') ?
                                            <Form.Group>
                                                <Form.Label>تاریخ تولد</Form.Label>
                                                <Form.Control onChange={this.handleBirthDate.bind(this)} type="text"
                                                              placeholder=""/>
                                            </Form.Group>
                                            : <p style={{color: 'green'}}>تاریخ تولد شما تایید شد</p>}

                                        {(VerifyEmailCode != 'success') ?
                                            <Form.Group>
                                                <Form.Label>تایید ایمیل (لطفا روی ارسال ایمیل کلیک کنید و کد تایید را
                                                    اینجا
                                                    وارد کنید)</Form.Label>
                                                <Form.Control onMouseOut={this.handleEmail.bind(this)} type="email"
                                                              placeholder="کد تایید"/>
                                                <br></br>
                                                <Button className="mx-auto" onClick={this.SendEmailVerifying.bind(this)}
                                                        color="primary" variant="contained">
                                                    ارسال ایمیل تایید
                                                </Button>
                                                {(SendEmailVerifying != 'success') ?
                                                    ''
                                                    : <p style={{color: 'orange'}}>ایمیل برای شما ارسال شد</p>}
                                            </Form.Group>
                                            : <p style={{color: 'green'}}>با موفقیت تایید شد</p>}
                                        {(VerifyEmailCode != 'not') ?
                                            ''
                                            : <p style={{color: 'red'}}>کد اشتباه وارد شده</p>}

                                    </div>


                                    <div className='col-md-6'>
                                        <Form.Group>
                                            {(selectedFileNationalId_Status != 'success') ?
                                                <Row>
                                                    <Form.File onChange={this.onFileChangeNationalId.bind(this)}
                                                               style={{backgroundColor: '#87f0f0'}}
                                                               id="exampleFormControlFile1"
                                                               label="عکس کارت ملی"/>
                                                    <Button className="mx-auto"
                                                            onClick={this.onFileUploadNationalId.bind(this)}
                                                            color="primary"
                                                            variant="contained">
                                                        آپلود
                                                    </Button>
                                                </Row>
                                                : <p style={{color: 'green'}}>با موفقیت آپلود شد در دست برسی</p>}
                                            {(selectedFileNationalId_Status != 'notcorrectfile') ?
                                                ''
                                                : <p style={{color: 'red'}}>فایل با فرمت اشتباه وارد شده</p>}
                                            {(selectedFileNationalId_Status != 'notcorrect') ?
                                                ''
                                                :
                                                <p style={{color: 'red'}}>عکس کارت ملی شما تایید نشد لطفا دوباره با رفع
                                                    اشکال ارسال کنید</p>}
                                        < /Form.Group>
                                        <p>لطفا تصویر کارت ملی را در کنار چهره خودتان همراه با یک دست نوشته به صورت
                                            کاملا خوانا و واضح دقیقا مانند تصویر نمونه ارسال نمایید. دقت شود متن دست
                                            نوشته نبایستی تایپ شود</p>
                                        <p style={{color: 'red'}}>متن دست نوشته : اینجانب (نام و نام خانوادگی) به کد ملی
                                            (کد ملی ) ضمن مطالعه و تایید قوانین استفاده از خدمات اینجاتتر متعهد میگردم
                                            حساب کاربری و مدارک خود را در اختیار اشخاص غیر قرار ندهم و در صورت تخلف،
                                            مسئولیت آن را بر عهده بگیرم . جهت احراز هویت در سایت اینجاتتر – تاریخ روز و
                                            امضا</p>

                                        <img src={selfilearn}/>

                                        <Form.Group>
                                            {(selectedFileSelfi_Status != 'success') ?
                                                <Row>
                                                    <Form.File onChange={this.onFileChangeSelfi.bind(this)}
                                                               style={{backgroundColor: '#87f0f0'}}
                                                               id="exampleFormControlFile1"
                                                               label="عکس سلفی"/>
                                                    <Button className="mx-auto"
                                                            onClick={this.onFileUploadSelfi.bind(this)} color="primary"
                                                            variant="contained">
                                                        آپلود
                                                    </Button>
                                                </Row>
                                                : <p style={{color: 'green'}}>با موفقیت آپلود شد در دست برسی</p>}
                                            {(selectedFileSelfi_Status != 'notcorrectfile') ?
                                                ''
                                                : <p style={{color: 'red'}}>فایل با فرمت اشتباه وارد شده</p>}
                                            {(selectedFileSelfi_Status != 'notcorrect') ?
                                                ''
                                                : <p style={{color: 'red'}}>عکس سلفی شما تایید نشد لطفا دوباره با رفع
                                                    اشکال ارسال کنید</p>}
                                        </Form.Group>

                                    </div>


                                    <Button style={{width: ' 100%'}} onClick={this.SendFinalCheck.bind(this)} size="large" className="mx-auto" color="primary"
                                            variant="contained">
                                        ارسال مدارک
                                    </Button>

                                </Row>
                            </Form>

                        </Card.Body>
                    </Card>
                        :     <Card style={{
                            border: '0px solid rgba(0,0,0,.125)'
                            , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                            , textAlign: 'Right',
                            marginBottom: '2rem'
                        }}>
                            <Card.Body>
                                <p style={{color: 'green'}}>شما با موفقیت احراز هویت شدید</p>
                            </Card.Body>
                        </Card>}
                    <div className="content">
                    </div>
                </div>
                        :   <div className="paddingtop">

                        <Card style={{
                            border: '0px solid rgba(0,0,0,.125)'
                            , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                            , textAlign: 'Right',
                            marginBottom: '2rem'
                        }}>
                            <Card.Body>
                                <p style={{color: 'green'}}>مدارک شما ارسال شده و در انتظار برسی است ، نتجیه به شماره شما پیامک خواهد شد</p>
                            </Card.Body>
                        </Card>
                    </div>   }
            </div>
        );

    }

}
export default Kyc;
