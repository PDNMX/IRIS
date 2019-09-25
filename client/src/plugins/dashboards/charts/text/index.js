import React from 'react';

export default class EditorDemo extends React.Component {

    state = {
        text: this.props.data.text
    };
    render () {
        const { text } = this.state;
        return (
            <div style={{textAlign: 'left'}}>
                <div dangerouslySetInnerHTML={{__html: text}}/>
            </div>
        );
    }
}
