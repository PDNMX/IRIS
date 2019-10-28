import React from 'react';
import DeckGL, {FlyToInterpolator} from 'deck.gl';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import MapGL from 'react-map-gl';
import rp from 'request-promise';
import auth from '../../../../../auth';
import _ from 'lodash';

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
        weightMin: 0,
        weightMax: 1,
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

        try{
            await this.setState({ loading: true });
        }catch (e) {
            console.log(e)
        }

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

        try {
            const documents = await rp(options),
                { latitude, longitude, weight } = this.props.options.fields;

            const weightArray = documents.map(d => d[weight.value.name]);

            this.setState({
                documents,
                weightMin: _.min(weightArray),
                weightMax: _.max(weightArray),
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
        catch (e) {
            console.log(e);
            try{
                await this.setState({documents: [], loading: false});
            }catch (e) {
                console.log(e)
            }
        }
    };

    onViewStateChange = ({viewState}) => {
        this.setState({viewState});
    };

    getLayer = () => {
        const { documents, weightMax, weightMin  } = this.state,
            r = weightMax - weightMin,
            { latitude, longitude, weight } = this.props.options.fields;

        return new HeatmapLayer({
            id: 'heat-map',
            data: documents,
            getWeight: d => (d[weight.value.name] - weightMin) / r,
            getPosition: d => [d[longitude.value.name], d[latitude.value.name]]
        });
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
                </DeckGL>
            </div>
        );
    }
}