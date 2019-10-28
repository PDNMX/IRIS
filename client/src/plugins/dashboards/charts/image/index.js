import React from 'react';


export default class extends React.Component {
    render() {
        const { data, height, width } = this.props;

        // console.log(height, width, data);

        return (
            <img src={data.image} height={height-4} width={width} alt={'img'} />
        );
    }
}