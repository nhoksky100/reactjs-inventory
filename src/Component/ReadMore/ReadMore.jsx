import React, { Component } from 'react';

class ReadMore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setShowLess: true,
            
        }
    }

    SetShowLess = () => {
        this.setState({ setShowLess: !this.state.setShowLess })

    }
  
    ReadMore = (text, length, color) => {
        // const length = 3000;
        if (text.length < length) {
            return <span>{text}</span>;
        }
        return (
            <span>
                <span
                    dangerouslySetInnerHTML={{
                        __html: this.state.setShowLess ? `${text.slice(0, length)}...` : text,
                    }}
                ></span>
                <span
                   className='readmore'
                    style={{ color: color, cursor: "pointer" }}
                    onClick={() => this.SetShowLess()}
                >
                    &nbsp; {this.state.setShowLess ? "Xem thêm ▼" : "Rút gọn ▲"}
                </span>
            </span>
        )
    }
    render() {
        const { text, length, color } = this.props;
        return (
            <span>
                {this.ReadMore(text, length, color)}
            </span>
        );
    }
}

export default ReadMore;
