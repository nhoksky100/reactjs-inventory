import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select/creatable';
import axios from 'axios';
import { connect } from 'react-redux';
import imageDefault from '../../Header/imageDefault';
import { randomId } from '../../RandomId/randomId';
import { toast } from 'react-toastify';
import { UpdateDateTime } from '../../UpdateDateTime';
import Sent from './Sent';
import { isNodeSend } from '../../../StoreRcd';
const getDataMember = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/getMember').then((res) => res.data)
const getDataImageProfile = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/imageFile').then((res) => res.data);
const getdataMessage = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/getMessage').then((res) => res.data)

class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataMember: [],
            dataImage: [],
            dataMessage: [],
            memberNameOption: [],
            departmentMember: '',
            listNameItemsOpt: [],
            selectedOptions: [],
            memberName: '',
            messageContent: '',
            messageTitle: '',
            idReceiver: [],
            // idImageProfile: '',
            imageProfile: '',
            isButtonDisabled: false,
            messageContentLimit: 250,
            messageTitleLimit:50,

        }
        this._isMounted = false;
    }
    componentDidMount = () => {
        this._isMounted = true;

        Promise.all([this.getData()]).then(() => {
            this.fetchDataMemberSelect();

        });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidUpdate(prevProps, prevState) {

        const { isNodeSend } = this.props;
      
        if (isNodeSend) {
            const { idReceiver, messageDepartmentSend, messageNameSend, messageTitle } = this.props.dataReceive;

            const selectedOptions = [{
                value: messageNameSend,
                label: `${messageNameSend} (${messageDepartmentSend})`
            }]

            this.handleSelectChange(selectedOptions);

            this.setState({
                selectedOptions,
                messageTitle,
            });
            this.props.is_NodeSend(false)
        }
    }


   getData = async () => {
    this._isMounted = true;
    try {
        const [dataMember, dataImage, dataMessage] = await Promise.all([
            getDataMember(),
            getDataImageProfile(),
            getdataMessage()
        ]);

        if (dataMember && this._isMounted) {
            console.log(dataMember,'dtMemberCDM')
            this.setState({ dataMember });
        }

        if (dataImage && this._isMounted) {
            const { tokenObj } = this.props || '';
            if (tokenObj) {
                dataImage.forEach((value) => {
                    if (tokenObj.id === value.id) {
                        this.setState({
                            imageProfile: value.image,
                        });
                        return;
                    }
                });
            }
        }

        if (dataMessage && this._isMounted) {
            this.setState({ dataMessage });
        }

    } catch (error) {
        console.error("Error in getData:", error);
    }
}

fetchDataMemberSelect = () => {
    const { dataMember } = this.state;
    const { memberName } = this.props;

    if (!dataMember) {
        console.error("dataMember is not available in state");
        return;
    }

    console.log(dataMember, 'dataMember');

    const filteredDataMemberArray = dataMember.filter(item => item.memberName !== memberName);
    console.log(filteredDataMemberArray, 'filteredDataMemberArray');

    const options = filteredDataMemberArray.map(item => ({
        value: item.memberName,
        label: `${item.memberName} (${item.memberDepartment})`
    }));

    if (this._isMounted) {
        this.setState({ memberNameOption: options });
    }
}

    randomIdSend = (data) => {
        let id = randomId();
        let countId = 0;
        const isDuplicateitemCode = (id) => {

            return data.some(item => item.id === id);
        };

        // Kiểm tra và tạo itemCode mới nếu trùng lặp
        while (isDuplicateitemCode(id) && countId < 20) {

            countId++;
            id = randomId();
        }
        return id
    }


    handleSelectChange = (selectedOptions) => {
        let memberNames = [];
        let idReceiver = []
        const { dataMember } = this.state;
        if (selectedOptions) {
            memberNames = selectedOptions.map(option => option.value.split(' (')[0]);

        }

        const filterMemberNames = dataMember.filter(item => memberNames.includes(item.memberName));

        // Lấy danh sách id của các thành viên đã chọn
        idReceiver = filterMemberNames.map(item => item.id);
        this.setState({
            selectedOptions,
            listNameItemsOpt: filterMemberNames,
            idReceiver,
        });
    }
    handleChange = (e) => {
        const { value, name } = e.target;

        if (name === 'messageTitle' && value.length > 50) {

            return
        } else if (name === 'messageContent' && value.length > 250) {
            return
        }
        else {

            this.setState({ [name]: value })
        }

    }
    handleKeyDown = (e) => {
        const { value, name } = e.target;

        // Prevent further input if length exceeds limits for messageTitle and messageContent
        if ((name === 'messageTitle' && value.length > 50) || (name === 'messageContent' && value.length > 250)) {
            if (e.key !== 'Backspace' && e.key !== 'Delete' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        }
    }
    handleSend = () => {
        try {
            if (this._isMounted) {


                this.setState({ isButtonDisabled: true }); // Reset btnLoaded after 2 seconds

                const { idReceiver, messageTitle, messageContent, dataMember, } = this.state;
                const { memberName, department, tokenObj } = this.props || ''
                let messageStatus = []
                let { imageProfile } = this.state
                if (!imageProfile) {
                    imageProfile = imageDefault
                }
                const id = this.randomIdSend(dataMember) || ''
                if (idReceiver.length === 0 || !messageContent || !messageTitle) {
                    this.setState({ isButtonDisabled: false }); // Reset btnLoaded after 2 seconds
                    return toast(<div className="advertise"><i className="fa fa-minus-circle" aria-hidden="true" /><i>Gửi thất bại, kiểm tra các trường!</i></div>);
                }

                for (let i = 0; i < idReceiver.length; i++) {
                    messageStatus[i] = 'True'
                }
                axios.post(process.env.REACT_APP_BACKEND_URL+'/messageSendAdd', {
                    id,
                    idReceiver: idReceiver.length > 0 ? idReceiver.join(",") : '',
                    idSend: tokenObj.id,
                    messageNameSend: memberName,
                    messageDepartmentSend: department,
                    messageTitle,
                    messageContent,
                    messageStatus: idReceiver.length > 0 ? idReceiver.join(",") : '',

                    messageDateCreated: UpdateDateTime(),

                }).then((res) => {
                    toast(<div className="advertise"><i className="fa fa-minus-circle" aria-hidden="true" /><i>Gửi thành công!</i></div>);
                    this.setState({ idReceiver: [], messageContent: '', messageTitle: '', selectedOptions: [] })
                    this.getData()
                }).catch(error => {
                    this.setState({ isButtonDisabled: false }); // Reset btnLoaded after error
                    toast(<div className="advertise"><i className="fa fa-minus-circle" aria-hidden="true" /><i>Gửi thất bại, có lỗi xảy ra!</i></div>);
                })
                    .finally(() => {
                        setTimeout(() => {
                            this.setState({ isButtonDisabled: false }); // Reset btnLoaded after 2 seconds
                        }, 2000);
                    });
            }

        }
        catch (error) {
            if (this._isMounted) {

                this.setState({ isButtonDisabled: false }); // Set btnLoaded to true at the beginning
            }
            toast(<div className="advertise"><i className="fa fa-minus-circle" aria-hidden="true" /><i>Gửi thất bại,có lỗi {error}!</i></div>);
        }
    }
    render() {
        const { memberNameOption, selectedOptions, isButtonDisabled, dataMessage, imageProfile } = this.state;
        const { tokenObj } = this.props || ''
        const { messageContent, messageContentLimit,messageTitleLimit,messageTitle } = this.state;
        const remainingChars = messageContentLimit - messageContent.length;
        const remainingCharsTitle = messageTitleLimit - messageTitle.length;
        return (
            <div className='table-data'>
                <div className="order" id='messageSend'>

                    <div className='massgageSend'>


                        <div style={{ marginLeft: '0px !important' }} className="form-group">
                            <label htmlFor="title">Chọn tên muốn gửi</label>
                            <Select
                                className='select-message'

                                isMulti
                                onChange={this.handleSelectChange}
                                options={memberNameOption}
                                name={''}
                                placeholder="Chọn tên..."
                                value={selectedOptions}
                            />

                        </div>
                        <div className="form-group title-container">
                            <label htmlFor="messageTitle">Tiêu đề</label>
                            <input onChange={(e) => this.handleChange(e)} onKeyDown={this.handleKeyDown}
                                type="text" value={this.state.messageTitle || ''} className="form-control"
                                name="messageTitle" id="messageTitle" aria-describedby="helpId" placeholder="tiêu đề" />
                            <div className="char-counter">
                                {remainingCharsTitle}/50
                            </div>

                        </div>
                        <div className="form-group textarea-container">
                            <label htmlFor="messageContent">Soạn tin nhắn</label>
                            <textarea onChange={(e) => this.handleChange(e)} onKeyDown={this.handleKeyDown}
                                type="text" value={this.state.messageContent || ''} className="form-control"
                                name="messageContent" id="messageContent" aria-describedby="helpId" placeholder="Soạn tin nhắn" />
                            <div className="char-counter">
                                {remainingChars}/250
                            </div>
                        </div>
                        <button disabled={isButtonDisabled} onClick={() => this.handleSend()} type="button" name="" id="btnMessage" className="btn btn-primary">Gửi</button>
                    </div>


                    <div className='massgageSent'>
                        <Sent dataMessage={dataMessage} imageProfile={imageProfile} tokenObj={tokenObj} />
                    </div>


                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        permission: state.allReducer.permission,
        department: state.allReducer.department,
        memberName: state.allReducer.memberName,
        isNodeSend: state.allReducer.isNodeSend,
        dataReceive: state.allReducer.dataReceive,


    };
}

function mapDispatchToProps(dispatch) {
    return {
        is_NodeSend: (acttion_isNodeSend) => {
            dispatch(isNodeSend(acttion_isNodeSend));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SendMessage);
