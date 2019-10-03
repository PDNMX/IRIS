import React from 'react';
import DeckGL, {FlyToInterpolator, GeoJsonLayer, TextLayer} from 'deck.gl';
import {Skeleton} from 'antd';
import MapGL from 'react-map-gl';
import _ from 'lodash';
import chroma from 'chroma-js';
import getData from '../../data';
import latinize from 'latinize';
import helpers from '../../../../../helpers';
import { Global } from 'viser-react';
import './styles.css';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGVtcGhpemEiLCJhIjoiY2pjODNlYXZlMDBuZTJ3cWhmNXd6bWdtYyJ9.6b5c0hraYC08xGiqW66m4w';
const DEFAULT_COLOR = [255, 255, 255];

export default class extends React.Component {
    state = {
        geoJson: {
            type:'FeatureCollection',
            features: []
        },
        loading: true,
        weightMin: 0,
        weightMax: 1,
        viewState: {
            longitude: -122.41669,
            latitude: 37.7853,
            zoom: 3.5,
            pitch: 0,
            bearing: 0
        },
        hoveredObject: null,
        colorScale: []
    };

    async componentDidMount() {

        if (!!Global && 'colors' in Global && Global.colors.length > 1) {
            const { colors }= Global,
                primaryColor = colors[0],
                secondaryColor = colors[1];
            this.setState({primaryColor, secondaryColor});
        }
    }

    loadData = async (match=undefined) => {
        const { dataSet } = this.props,
            { fields } = this.props.options,
            { color, id } = fields,
            idName = id.value.name,
            colorName = color.value.name;

        let geoJson = this.props.options.config.geoJson.value;

        await this.setState({loading: true});

        // console.log(match);

        let documents = await getData(
            'cartesian',
            dataSet.id,
            {
                axis: id,
                values: {
                    type: 'array',
                    value: [{...color, ...color.value}]
                }
            },
            match
        );

        // console.log(idName, documents);

        documents.forEach(d => d[idName] = d['_id']);

        documents = _.fromPairs(
            documents.map(d =>
                [
                    latinize(d[idName]).toUpperCase(),
                    {[colorName]: d[colorName]}
                ]
            )
        );

        // console.log(idName, documents);

        geoJson.features.forEach(f => {
            const _id = latinize(f.properties.name).toUpperCase();
            // console.log(_id);
            f.properties[idName] = _id in documents? _id: 'NA';
            f.properties[colorName] = _id in documents? documents[_id][colorName]: 0;
        });

        const colorMin = _.min(geoJson.features.map(d => d.properties[colorName])),
            colorMax = _.max(geoJson.features.map(d => d.properties[colorName]));

        this.setState({
            loading: false,
            geoJson,
            [`${colorName}_min`]: colorMin,
            [`${colorName}_max`]: colorMax,
            colorScale: _.range(colorMin, colorMax, (colorMax-colorMin) / 100),
            viewState: {
                ...this.state.viewState,
                longitude: _.mean(geoJson.features.map(d => d.properties.longitude)),
                latitude: _.mean(geoJson.features.map(d => d.properties.latitude)),
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator()
            }
        });
    };

    onViewStateChange = ({viewState}) => {
        this.setState({viewState});
    };

    onHover = ({x, y, object}) => {
        this.setState({x, y, hoveredObject: object});
    };

    getLayers = () => {
        const { geoJson, primaryColor, secondaryColor} = this.state,
            { fields } = this.props.options,
            { color } = fields,
            colorName = color.value.name,
            fc = chroma.scale([secondaryColor, primaryColor]).domain([this.state[`${colorName}_min`], this.state[`${colorName}_max`]]);

        return [
            new GeoJsonLayer({
                id: 'geojson',
                data: geoJson,
                opacity: 0.8,
                stroked: false,
                filled: true,
                extruded: true,
                wireframe: true,
                getElevation: f => 0,
                getFillColor: f => fc(f.properties[colorName]).rgb(),
                getLineColor: [255, 255, 255],
                pickable: true,
                onHover: this.onHover
            }),
            new TextLayer({
                id: 'labels',
                data: geoJson.features,
                getText: d => d.properties.postal,
                getPosition: x => [x.properties.longitude, x.properties.latitude],
                getColor: d => DEFAULT_COLOR,
                getSize: d => 18,
                sizeScale: 22 / 20
            })
        ];
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

    renderScale = () => {
        const { colorScale, primaryColor, secondaryColor } = this.state,
            { fields } = this.props.options,
            { color } = fields,
            colorName = color.value.name,
            fc = chroma.scale([secondaryColor, primaryColor]).domain([this.state[`${colorName}_min`], this.state[`${colorName}_max`]]);

        // console.log(colorScale.map(cs => fc(cs).hex()));

        return (
            <div className={'map-scale'} style={{top: 0, left: 0}}>
                {
                    colorScale.map((cs, i) =>
                        <span
                            key={i}
                            className='grad-step'
                            style={{backgroundColor: fc(cs).hex()}} />
                    )
                }
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{flex: 0.5, textAlign: 'left'}}>
                        {!!color.formatter? helpers[color.formatter](this.state[`${colorName}_min`]): this.state[`${colorName}_min`]}
                    </div>
                    <div style={{flex: 0.5}}>
                        {!!color.formatter? helpers[color.formatter](this.state[`${colorName}_max`]): this.state[`${colorName}_max`]}
                    </div>
                </div>
            </div>
        );
    };

    renderTooltip = () => {
        const {x, y, hoveredObject} = this.state,
            { fields } = this.props.options;

        return (
            hoveredObject && (
                <div className={'map-tooltip'} style={{top: y, left: x}}>
                    {
                        _.uniqBy(
                            _.map(_.pickBy(fields, f => !!f.value)),
                            f => f.value.name
                        ).map(
                            (f, n) =>
                                <div key={n}>
                                    <div><strong>{f.alias? f.alias: f.value.name}:</strong></div>
                                    <div>{this.renderField(f, hoveredObject.properties[f.value.name])}</div>
                                </div>
                        )
                    }
                </div>
            )
        );
    };

    render() {
        const { width, height } = this.props,
            { loading } = this.state;

        return (
            <div style={{height, width}}>
                <Skeleton loading={loading} active>
                    {
                        !loading &&
                        <DeckGL
                            viewState={this.state.viewState}
                            onViewStateChange={this.onViewStateChange}
                            controller={true}
                            layers={this.getLayers()}>
                            <MapGL mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}/>
                            {this.renderTooltip()}
                            {this.renderScale()}
                        </DeckGL>
                    }
                </Skeleton>
            </div>
        );
    }
}