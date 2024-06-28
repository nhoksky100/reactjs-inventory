import React, { Component } from 'react';

class ReadMore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setShowLess: true
        }
    }

    SetShowLess = () => {
        this.setState({ setShowLess: !this.state.setShowLess })

    }

    ReadMore = (text, length, color) => {
        // const length = 3000;
        if (text.length < length) {
            return <div>{text}</div>;
        }
        return (
            <div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: this.state.setShowLess ? `${text.slice(0, length)}...` : text,
                    }}
                ></div>
                <a
                    style={{ color: color, cursor: "pointer" }}
                    onClick={() => this.SetShowLess()}
                >
                    {/* &nbsp; {this.state.setShowLess ? "Xem thêm ▼" : "Rút gọn ▲"} */}
                </a>
            </div>
        )
    }
    render() {
        const { text, length,color } = this.props;
        return (
            <div>
                {this.ReadMore(text, length,color)}
            </div>
        );
    }
}

export default ReadMore;
