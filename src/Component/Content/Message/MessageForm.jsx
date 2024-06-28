import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import SendMessage from './SendMessage';
import ReceiveMessage from './ReceiveMessage';
import axios from 'axios';
import { countMessage, isNodeForm, isNodeSend } from '../../../StoreRcd';

const getdataMessage = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/getMessage').then((res) => res.data)

class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'Gửi',
            selectedComponentInto: null,
            activeMenu: 'Đơn gửi đã tạo',
            activeMenuReceive: 'Đơn Nhận đã tạo',
            selectedComponentExport: null,
            canClick: true,
            countMessage: 0,
            dataMessage: []
        };
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true
       
        this.getData()
        this.getDidMount();
    }

    getData = () => {
        this._isMounted = true;
        try {

            getdataMessage().then((res) => {
                const { tokenObj } = this.props;
                if (res) {
                    if (this._isMounted) {


                        let count = 0;

                        res.forEach((message) => {
                            const messageStatusArray = message.messageStatus.split(',');

                            if (messageStatusArray.includes(tokenObj.id)) {
                                count += 1;
                            }
                        });

                        this.setState({
                            dataMessage: res,
                            countMessage: count,

                        })
                        this.props.is_countMessage(count)
                    }

                }
            })

        } catch (error) {

        }


    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeTab !== this.state.activeTab) {
            this.updateSearchFormHistoryProfile(this.state.activeTab);
        }

        const { countMessage } = this.props;
        const { isNodeForm } = this.props;
      
        if (countMessage !== prevProps.countMessage) {
            
            this.getData()
        }

        if (isNodeForm !== prevProps.isNodeForm) {
           
            this.props.is_NodeForm(false)
            this.props.is_NodeSend(true)
            this.changeTab('Gửi')
        }


    }

    componentWillUnmount() {
        this._isMounted = false
        this.setState({
            activeMenu: 'Đơn gửi đã tạo',
            activeTab: 'Gửi',
            selectedComponentSendMessage: null,
            activeMenuReceive: 'Đơn Nhận đã tạo',
            selectedComponentReceiveMessage: null,
        });
       
    
    }

    getDidMount = () => {
        const { tokenObj } = this.props || '';
        const { imageProfile } = this.props || '';
        const request = sessionStorage.getItem('requestMessage') || 'Gửi';
        this.setState({
            activeTab: request,
            selectedComponentSendMessage: <SendMessage imageProfile={imageProfile} tokenObj={tokenObj} />,
            selectedComponentReceiveMessage: <ReceiveMessage imageProfile={imageProfile} tokenObj={tokenObj} />,
        }, () => {
            this.updateSearchFormHistoryProfile(this.state.activeTab);
        });
    }

    updateSearchFormHistoryProfile = (tabName) => {
        if (tabName === 'Gửi') {

            // this.props.is_SearchFormIntoProfile(true);
            // this.props.is_SearchFormExportProfile(false);
        } else {
            // this.props.is_SearchFormIntoProfile(false);
            // this.props.is_SearchFormExportProfile(true);
        }
        sessionStorage.setItem('requestMessage', tabName);
    };

    changeTab = (tabName) => {
        if (!this.state.canClick) return;
        this.setState({ activeTab: tabName, canClick: false }, () => {
            setTimeout(() => {
                this.setState({ canClick: true });
            }, 500);
        });
    };

    renderTabContent = () => {
        const { activeTab, selectedComponentSendMessage, selectedComponentReceiveMessage } = this.state;
        switch (activeTab) {
            case 'Gửi':

                return selectedComponentSendMessage;
            case 'Nhận':
               
                return selectedComponentReceiveMessage;
            default:
                return null;
        }
    };

    render() {
        const { activeTab } = this.state;
        const { countMessage } = this.state;

        return (
            <Fragment>
                <div style={{ borderBottom: 0, marginTop: '50px' }} className="tabsOverView">
                    <div
                        className={activeTab === 'Gửi' ? 'active tab' : 'tab'}
                        onClick={() => this.changeTab('Gửi')}
                    >
                        Gửi
                    </div>
                    <div
                        style={{ position: 'relative' }}
                        className={activeTab === 'Nhận' ? 'active tab' : 'tab'}
                        onClick={() => this.changeTab('Nhận')}
                    >
                        {countMessage > 0 && <span className='redMessageForm'></span>}
                        Nhận
                    </div>
                </div>
                {this.renderTabContent()}
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        countMessage: state.allReducer.countMessage,
        isNodeForm: state.allReducer.isNodeForm,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        is_countMessage: (acttion_countMessage) => {
            dispatch(countMessage(acttion_countMessage));
        },
        is_NodeForm: (acttion_isNodeForm) => {
            dispatch(isNodeForm(acttion_isNodeForm));
        },
        is_NodeSend: (acttion_isNodeSend) => {
            dispatch(isNodeSend(acttion_isNodeSend));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageForm);
