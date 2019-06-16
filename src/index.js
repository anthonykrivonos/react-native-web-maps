import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import * as t from 'prop-types';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import Marker from './Marker';
import Polyline from './Polyline';

const GoogleMapContainer = withGoogleMap(props => (
  <GoogleMap {...props} ref={props.handleMapMounted} defaultOptions={{ styles: props.mapStyle }} />
));

class MapView extends Component {
  state = {
    center: null,
  };

  handleMapMounted = map => {
    this.map = map;
    this.props.onMapReady && this.props.onMapReady();
  };

  animateToRegion(coordinates) {
    this.setState({ center: { lat: coordinates.latitude, lng: coordinates.longitude } });
  }

  onDragEnd = () => {
    const { onRegionChangeComplete } = this.props;
    if (this.map && onRegionChangeComplete) {
      const center = this.map.getCenter();
      onRegionChangeComplete({
        latitude: center.lat(),
        longitude: center.lng(),
      });
    }
  };

  render() {
    const { region, initialRegion, onRegionChange, onPress, options, mapStyle } = this.props;
    const { center } = this.state;
    const style = this.props.style || styles.container;

    const centerProps = region
      ? {
          center: {
            lat: region.latitude,
            lng: region.longitude,
          },
        }
      : center
      ? { center }
      : {
          defaultCenter: {
            lat: initialRegion.latitude,
            lng: initialRegion.longitude,
          },
        };

    return (
      <View style={style}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          {...centerProps}
          onDragStart={onRegionChange}
          onIdle={this.onDragEnd}
          defaultZoom={15}
          onClick={onPress}
          mapStyle={mapStyle}
          options={options}>
          {this.props.children}
        </GoogleMapContainer>
      </View>
    );
  }

  static propTypes = {
    /** Region currently shown on the map. */
    region: t.shape({
      latitude: t.number.isRequired,
      latitudeDelta: t.number.isRequired,
      longitude: t.number.isRequired,
      longitudeDelta: t.number.isRequired,
    }),
    /** Function called when a region is changed. */
    onRegionChange: t.func,
    /** Function called when a region has completed changing. */
    onRegionChangeComplete: t.func,
    /** Function called when the map is pressed. */
    onPress: t.func,
    /** Google Maps styling object. May take in a JSON file using require(..).  */
    mapStyle: t.oneOf(t.object),
  };
}

MapView.Marker = Marker;
MapView.Polyline = Polyline;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

export default MapView;
