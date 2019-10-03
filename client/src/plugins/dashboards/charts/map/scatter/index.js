/// app.js
import React from 'react';
import DeckGL, {FlyToInterpolator, ScatterplotLayer} from 'deck.gl';
import MapGL from 'react-map-gl';
import rp from 'request-promise';
import auth from '../../../../../auth';
import chroma from 'chroma-js';
import _ from 'lodash';
import './styles.css';
import { Card, Descriptions } from 'antd';
import helpers from '../../../../../helpers';


// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGVtcGhpemEiLCJhIjoiY2pjODNlYXZlMDBuZTJ3cWhmNXd6bWdtYyJ9.6b5c0hraYC08xGiqW66m4w';

const median = (array) => {
    array = array.sort();
    if (array.length % 2 === 0) { // array with even number elements
        return (array[array.length/2] + array[(array.length / 2) - 1]) / 2;
    }
    else {
        return array[(array.length - 1) / 2]; // array with odd number elements
    }
};

export default class extends React.Component {
    state = {
        documents: [],
        loading: true,
        cmin: 0,
        cmax: 1,
        rmin: 0,
        rmax: 1,
        viewState: {
            longitude: -122.41669,
            latitude: 37.7853,
            zoom: 6,
            pitch: 0,
            bearing: 0,
            height: 100,
            width: 100
        },
        hoveredObject: null
    };

    async componentDidMount() {
        // await this.loadData();
    }

    loadData = async (match=undefined) => {
        const { dataSet } = this.props;

        await this.setState({loading: true});

        let options = {
            method: 'POST',
            uri: `${auth.getHost()}/dataset/${dataSet.id}`,
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`
            },
            json: true
        };

        if (!!match && !!match.$match && !_.isEmpty(match.$match)) {
            options.body = {
                where: match.$match
            };
        }

        // console.log('#match', match, options.body);

        try {
            const documents = await rp(options),
                { latitude, longitude, color, radius } = this.props.options.fields;

            // console.log(documents);

            if (!!documents && documents.length > 0) {
                const colorArray = documents.map(d => d[color.value.name]),
                    radiusArray = documents.map(d => d[radius.value.name]);

                this.setState({
                    documents,
                    cmin: _.min(colorArray),
                    cmax: _.max(colorArray),
                    rmin: _.min(radiusArray),
                    rmax: _.max(radiusArray),
                    loading: false,
                    viewState: {
                        ...this.state.viewState,
                        longitude: median(documents.map(d => d[longitude.value.name])),
                        latitude: median(documents.map(d => d[latitude.value.name])),
                        transitionDuration: 2000,
                        transitionInterpolator: new FlyToInterpolator()
                    }
                });
            }
            else {
                await this.setState({
                    documents: [],
                    loading: false,
                    cmin: 0,
                    cmax: 1,
                    rmin: 0,
                    rmax: 1,
                    viewState: {
                        longitude: -122.41669,
                        latitude: 37.7853,
                        zoom: 6,
                        pitch: 0,
                        bearing: 0,
                        height: 100,
                        width: 100
                    },
                    hoveredObject: null
                });
            }
        }
        catch (e) {
            console.log(e);
            await this.setState({documents: [], loading: false});
        }
    };

    onViewStateChange = ({viewState}) => {
        this.setState({viewState});
    };

    renderField = (field, value) => {
        const { formatter } = field;

        if (!!formatter && formatter in helpers) {
            return helpers[formatter](value);
        }
        else {
            return value;
        }
    };

    renderTooltip = () => {
        const {x, y, hoveredObject} = this.state,
            { fields } = this.props.options;

        return (
            hoveredObject && (
                <div className={'map-floating-card'} style={{top: y, left: x}}>
                    <Card size={'small'} bodyStyle={{width: 220}}>
                        <Descriptions column={1}>
                            {
                                _.uniqBy(
                                    _.map(fields),
                                    f => f.value.name
                                ).map(
                                    (f, n) =>
                                    <Descriptions.Item key={n} label={f.alias? f.alias: f.value.name}>
                                        {this.renderField(f, hoveredObject[f.value.name])}
                                    </Descriptions.Item>
                                )
                            }
                        </Descriptions>
                    </Card>
                </div>
            )
        );
    };

    onHover = ({x, y, object}) => {
        this.setState({x, y, hoveredObject: object});
    };

    getLayer = () => {
        const { documents, cmin, cmax, rmin, rmax } = this.state,
            r = rmax - rmin,
            fc = chroma.scale('Spectral').domain([cmin, cmax]),
            { latitude, longitude, color, radius, id } = this.props.options.fields;
        let options = {
            id: 'points',
            data: documents,
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusScale: 6,
            radiusMinPixels: 1,
            radiusMaxPixels: 100,
            getRadius: d => {
                const delta = d[radius.value.name] - rmin;

                return delta > 0? Math.floor(delta / r * 1000): 1000
            },
            getPosition: d => [d[longitude.value.name], d[latitude.value.name]],
            getFillColor: d => fc(d[color.value.name]).rgb(),
            onHover: this.onHover
        };

        if (!!id && !!id.value && !!id.formatter) {
            const { formatter } = id;

            if (
                'onClick' in formatter.args &&
                this.props.makeFormatter instanceof Function
            ) {
                const onClickHandler = this.props.makeFormatter(formatter, {event: 'onClick'});
                options.onClick = data => onClickHandler(data.object[id.value.name]);
            }
        }

        return new ScatterplotLayer(options);
    };

    render() {
        const { width, height } = this.props;

        return (
            <div style={{height, width}}>
                <DeckGL
                    viewState={this.state.viewState}
                    onViewStateChange={this.onViewStateChange}
                    controller={true}
                    layers={[this.getLayer()]}>
                    <MapGL mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
                    {this.renderTooltip()}
                </DeckGL>
            </div>
        );
    }
}