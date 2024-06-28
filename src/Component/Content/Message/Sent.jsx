import React, { Component, Fragment } from 'react'
import axios from 'axios';
import imageDefault from '../../Header/imageDefault';
import Pagination from 'react-js-pagination';
import ReadMore from '../../ReadMore/ReadMore'; // read more describe

// const getdataMessage = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/getMessage').then((res) => res.data)

// const getDataImageProfile = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/imageFile').then((res) => res.data);

export default class Sent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataMessage: [],
            dataImage: [],
            imageProfile: '',
            // pagination
            currentPage: 1,
            newsPerPage: 4, // show 5 product
            totalPage: 0,

        }
        this.currentTodos = this.currentTodos.bind(this)
        this._isMounted = false;
    }
    componentDidMount = () => {
        this._isMounted = true;

        // Promise.all([this.getData()]).then(() => {

        // });
    }
    componentWillUnmount = () => {
        this._isMounted = false;
    }

    // getData = async () => {
    //     this._isMounted = true;
    //     try {

    //         const [dataMessage, dataImage] = await Promise.all([
    //             getdataMessage(),
    //             getDataImageProfile(),

    //         ]);
    //         if (dataMessage) {
    //             if (this._isMounted) {
    //                 this.setState({ dataMessage: dataMessage })
    //             }
    //         }
    //         if (dataImage) {

    //             const { tokenObj } = this.props || ''
    //             if (tokenObj) {

    //                 dataImage.forEach((value) => {

    //                     if (tokenObj.id === value.id) {
    //                         if (this._isMounted) {
    //                             this.setState({

    //                                 imageProfile: value.image,
    //                             })
    //                         }
    //                         return;
    //                     }
    //                 });


    //             }
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
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



    showFormMessageSend = () => {
        const { dataMessage, imageProfile } = this.props || '';

        const { tokenObj } = this.props || '';
        let countData = 0;
        if (dataMessage) {
            let currentTodos = dataMessage.length > 4 ? this.currentTodos(dataMessage) : dataMessage || [];
            currentTodos = this.sortByDate(currentTodos);
            return currentTodos.map((value, key) => {

                let date = this.SetDay(value.messageDateCreated);
                if (value.idSend === tokenObj.id) {

                    countData++;
                    return (
                        <div style={countData > 1 ? { marginTop: '-30px' } : {}} key={key}>
                            <div className="card v-card v-sheet theme--light elevation-2">
                                <div className="header">
                                    <div className="v-avatar avatar" style={{ height: 30, width: 30 }}>
                                        <img src={imageProfile !== '' ? imageProfile : imageDefault} />
                                    </div>
                                    <span className="displayName">{value.messageNameSend}</span>

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

                {/* <h4 style={{ marginBottom: '20px' }}>Đã gửi</h4> */}
                <div className='messageProfile'>
                    {this.showFormMessageSend()}

                </div>
                {this.state.totalPage > 4 &&

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
