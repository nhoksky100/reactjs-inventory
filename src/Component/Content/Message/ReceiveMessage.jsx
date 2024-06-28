import React, { Component, Fragment } from 'react'
import axios from 'axios';
import imageDefault from '../../Header/imageDefault';
import Pagination from 'react-js-pagination';
import { connect } from 'react-redux';
import { dataReceive, isNodeForm, isNodeSend } from '../../../StoreRcd';
import ReadMore from '../../ReadMore/ReadMore';

const getdataMessage = () => axios.get('/getMessage').then((res) => res.data)

const getDataImageProfile = () => axios.get('/imageFile').then((res) => res.data);

class ReceiveMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataMessage: [],
            dataImage: [],
            imageProfile: '',
            // pagination
            currentPage: 1,
            newsPerPage: 5, // show 5 product
            totalPage: 0,

        }
        this.currentTodos = this.currentTodos.bind(this)
        this._isMounted = false;
    }
    componentDidMount = () => {
        this._isMounted = true;

        Promise.all([this.getData()]).then(() => {
            this.updateCaseMessageStatus()
        });
    }
    componentWillUnmount = () => {
        this._isMounted = false;
    }
    updateCaseMessageStatus = () => {
        const { tokenObj } = this.props || '';
        const { dataMessage } = this.state;

        // Tạo một mảng các Promise
        const updatePromises = dataMessage.map((message) => {
            let messageStatusArray = message.messageStatus.split(',');

            // Loại bỏ phần tử trùng với tokenObj.id
            messageStatusArray = messageStatusArray.filter(status => status !== tokenObj.id);

            // Ghép lại thành chuỗi
            const updatedMessageStatus = messageStatusArray.join(',');

            // Trả về một Promise từ axios.post
            return axios.post('/updateMessageStatus', {
                id: message.id,
                messageStatus: updatedMessageStatus
            });
        });

        // Sử dụng Promise.all để đợi tất cả các Promise hoàn thành
        Promise.all(updatePromises)
            .then((responses) => {
                // Xử lý phản hồi từ tất cả các yêu cầu
                // console.log('Cập nhật thành công',);
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                // console.error('Cập nhật thất bại', error);
            });
    }


    getData = async () => {
        this._isMounted = true;
        try {

            const [dataMessage, dataImage] = await Promise.all([
                getdataMessage(),
                getDataImageProfile(),

            ]);
            if (dataMessage) {
                if (this._isMounted) {
                    this.setState({ dataMessage: dataMessage })
                }
            }
            if (dataImage) {

                const { tokenObj } = this.props || ''
                if (tokenObj) {

                    dataImage.forEach((value) => {

                        if (tokenObj.id === value.id) {
                            if (this._isMounted) {
                                this.setState({

                                    imageProfile: value.image,
                                })
                            }
                            return;
                        }
                    });

                }
                if (this._isMounted) {
                    this.setState({
                        dataImage,

                    })
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
    // pageination
    handlePageChange(currentPage) {
        this.setState({
            currentPage: currentPage,
        });
    }
    currentTodos = (dataMessage) => {
        const { currentPage, newsPerPage } = this.state; // trang hiện tại acti  //cho trang tin tức mỗi trang
        const indexOfLastNews = currentPage * newsPerPage; // lấy vị trí cuối cùng của trang ,của data
        const indexOfFirstNews = indexOfLastNews - newsPerPage; // lấy vị trí đầu tiên  của trang ,của data
        this.state.totalPage = dataMessage.length;
        return dataMessage.length > 0 && dataMessage.slice(indexOfFirstNews, indexOfLastNews); // lấy dữ liệu ban đầu và cuối gán cho các list
    }


    // Hàm tìm chuỗi con giống nhau trong một chuỗi và một mảng các chuỗi
    findCommonSubstring = (str, arr) => {
        let commonSubstring = '';
        arr.forEach(substr => {
            if (str.includes(substr) && substr.length > commonSubstring.length) {
                commonSubstring = substr;
            }
        });
        return commonSubstring;
    };
    sortByDate = (data) => {
        const groupedData = {};
        let orderedGroups;
        data.forEach(item => {
            const key = item.messageDateCreated;
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(item);
        });
        orderedGroups = Object.keys(groupedData).sort((b, a) => {
            // So sánh chuỗi bằng cách tìm chuỗi con giống nhau
            const commonSubstrA = this.findCommonSubstring(a, Object.keys(groupedData));
            const commonSubstrB = this.findCommonSubstring(b, Object.keys(groupedData));

            // Nếu có chuỗi con giống nhau, sắp xếp lại theo thứ tự chuỗi con đó
            if (commonSubstrA !== commonSubstrB) {
                return commonSubstrA.localeCompare(commonSubstrB);
            }

            // Nếu không có chuỗi con giống nhau, sắp xếp theo thứ tự bình thường
            return a.localeCompare(b);
        });
        // Kết hợp các nhóm đã sắp xếp lại thành một mảng duy nhất
        let sortedData = [];
        orderedGroups.forEach(key => {
            sortedData = sortedData.concat(groupedData[key]);
        });


        return sortedData


    }

    // Set day
    // Set day
    SetDay(dateOf) {
        // Parse the date string into a Date object
        const [datePart, timePart] = dateOf.split(' - ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [time, period] = timePart.split(' ');

        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        const dateOfParsed = new Date(year, month - 1, day, hours, minutes);

        const today = new Date();

        // Calculate the difference in milliseconds
        const diffInMillis = today - dateOfParsed;

        // Convert the difference to seconds
        const diffInSeconds = Math.floor(diffInMillis / 1000);

        // Calculate the time components
        const yearDiff = Math.floor(diffInSeconds / (60 * 60 * 24 * 365.24));
        const monthDiff = Math.floor(diffInSeconds % (60 * 60 * 24 * 365.24) / (60 * 60 * 24 * 30.44));
        const dayDiff = Math.floor(diffInSeconds % (60 * 60 * 24 * 30.44) / (60 * 60 * 24));
        const hoursDiff = Math.floor(diffInSeconds % (60 * 60 * 24) / (60 * 60));
        const minutesDiff = Math.floor(diffInSeconds % (60 * 60) / 60);
        const secondsDiff = Math.floor(diffInSeconds % 60);

        const obj = {
            "y": yearDiff,
            "mo": monthDiff,
            "d": dayDiff,
            "h": hoursDiff,
            "m": minutesDiff,
            "s": secondsDiff
        };

        return obj;
    }

    handleSendMessage = (dataReceive) => {
        // this.props.is_NodeSend(true)
        this.props.is_NodeForm(true)

        this.props.data_Receive(dataReceive)

    }


    checkSend = (idReceiver) => {
        const { tokenObj } = this.props || '';

        return idReceiver.includes(tokenObj.id);
    }
    showFormMessageSend = () => {
        const { dataMessage, dataImage } = this.state;

        let countData = 0;
        if (dataMessage) {
            let currentTodos = dataMessage.length > 5 ? this.currentTodos(dataMessage) : dataMessage || [];

            currentTodos = this.sortByDate(currentTodos);
            return currentTodos.map((value, key) => {
                let idReceiver = value.idReceiver !== null && value.idReceiver.split(",") || []

                let date = this.SetDay(value.messageDateCreated);
                let profileImage = imageDefault; // Default image
                if (value.idSend) {
                    // console.log(value.idSend,'value.idSend');

                    // Find the image in dataImage based on idSend
                    const imageObj = dataImage.length > 0 && dataImage.find(img => img.id === value.idSend);
                    if (imageObj) {
                        profileImage = imageObj.image;
                    }
                }

                if (this.checkSend(idReceiver) && idReceiver.length > 0) {

                    countData++;
                    return (
                        <div style={countData > 1 ? { marginTop: '-30px' } : {}} key={key}>
                            <div className="card v-card v-sheet theme--light elevation-2">
                                <div className="header">
                                    <div className="v-avatar avatar" style={{ height: 30, width: 30 }}>
                                        <img src={profileImage} />
                                    </div>
                                    <span className="displayName ">{value.messageNameSend}</span>

                                    <span className="displayName caption">
                                        <span className="text-black-50" title={value.messageDateCreated}>
                                            {
                                                date.y !== 0 ? date.y + " Năm trước" :
                                                    date.mo !== 0 ? date.mo + " Tháng trước" :
                                                        date.d !== 0 ? date.d + " Ngày trước" :
                                                            date.h !== 0 ? date.h + " Giờ trước" :
                                                                date.m !== 0 ? date.m + " Phút trước" :
                                                                    date.s !== 0 ? date.s + " Giây trước" :
                                                                        ''
                                            }
                                        </span>
                                    </span>
                                </div>
                                <div className=" title">
                                    <p> <h7> -{value.messageTitle}-</h7></p>

                                </div>
                                <div className="wrapperMessage comment">
                                    <p>
                                        <ReadMore
                                            text={value.messageContent}

                                            length={70}
                                            color={'#45b7f9'}
                                        />
                                    </p>
                                </div>
                                <div className="actions">
                                    <img onClick={() => this.handleSendMessage(value)} className='paper' src="./icons/image/paper-airplane.png" title='trả lời tin nhắn' alt="" />
                                    {/* <img className='trash' src="./icons/image/android-trash.png" alt="" title='xoá bỏ tin nhắn này' /> */}
                                </div>
                                <div className="v-dialog__container" style={{ display: "block" }} />
                            </div>
                            <div className="answers"></div>
                        </div>
                    );
                } else return null;
            });
        }
    }

    render() {

        return (
            <Fragment>
                <h4 style={{ margin: '20px' }}>Tin gửi đến</h4>

                <div className='massgageSent'>
                    {this.showFormMessageSend()}

                </div>
                {this.state.totalPage > 5 &&

                    <div style={{ marginTop: '160px' }} className="pagination">

                        <Pagination
                            activePage={this.state.currentPage}
                            itemsCountPerPage={this.state.newsPerPage}
                            totalItemsCount={
                                this.state.dataMessage.length !== 0
                                    ? this.state.totalPage
                                    : 0
                            }
                            pageRangeDisplayed={5} // show page
                            // firstPageText ={'Đầu'}
                            onChange={this.handlePageChange.bind(this)}
                        />

                    </div>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isNodeSend: state.allReducer.isNodeSend
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        is_NodeForm: (acttion_isNodeSend) => {
            dispatch(isNodeForm(acttion_isNodeSend));
        },
        is_NodeSend: (acttion_isNodeSend) => {
            dispatch(isNodeSend(acttion_isNodeSend));
        },
        data_Receive: (acttion_dataReceive) => {
            dispatch(dataReceive(acttion_dataReceive));
        },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ReceiveMessage);

