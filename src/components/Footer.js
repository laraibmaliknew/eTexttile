import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

export default class Footer extends React.Component {
  onPress = () => {
    this.props.onPress && this.props.onPress();
  };
  render() {
    const { onPress, style, ...props } = this.props;
    const disabled = this.props.disabled;
    return (
      <TouchableHighlight disabled = {disabled}
        underlayColor={'#eeeeee'}
        {...props}
        onPress={this.onPress}
        style={[styles.touchable, style]}
      >
        <Text style={styles.text}>{(disabled)?'No More Posts':'Loading More...'}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
  text: { fontWeight: 'bold', fontSize: 16 },
});
