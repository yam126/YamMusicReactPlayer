/* eslint-disable react-native/no-inline-styles */
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import Menu, {
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default class CustomPopupMenu extends Component {
  constructor() {
    super();
    this.state = {
      top: 0,
      left: 0,
      menu: null,
      menuOptions: [],
    };
  }
  onOptionSelect(value) {
    console.log(`Selected number: ${value}`);
    console.log('this.menu', this.menu);
    if (this.menu !== null && typeof this.menu !== 'undefined') {
      if (this.props.onOptionSelect != null) {
        this.props.onOptionSelect(value);
      }
      this.menu.closeMenu();
    }
    return false;
  }
  openMenu = (menuName, top, left) => {
    console.log('menuName', menuName);
    console.log('this.menu', this.menu);
    if (this.menu !== null && typeof this.menu !== 'undefined') {
      try {
        this.setState({top, left});
        console.log('openMenu open 11111');
        this.menu.openMenu(menuName);
        console.log('openMenu open 22222');
      } catch (exp) {
        console.log('openMenu exp', exp);
      }
    }
  };

  onRef = r => {
    console.log('onRef r', r);
    if (r === null || typeof r === 'undefined') {
      return false;
    }
    this.menu = r.props.ctx.menuActions;
  };

  componentDidMount() {
    console.log('this.props.menuOptions', this.props.menuOptions);
    if (
      this.props.menuOptions !== null &&
      typeof this.props.menuOptions !== 'undefined'
    ) {
      this.setState({menuOptions: this.props.menuOptions});
    }
  }

  render() {
    let menuOptions = this.props.menuOptions;
    console.log('menuOptions', menuOptions);
    return (
      <Menu
        onSelect={value => this.onOptionSelect(value)}
        name={this.props.name}
        style={{zIndex: 10000, display: 'none'}}
        ref={this.onRef}>
        <MenuTrigger text="Select option" />
        <MenuOptions
          optionsContainerStyle={{
            marginTop: parseInt(this.state.top, 10),
            marginLeft: parseInt(this.state.left, 10),
          }}>
          {menuOptions.map((item, index) => {
            return <MenuOption value={index} text={item} />;
          })}
        </MenuOptions>
      </Menu>
    );
  }
}

const styles = StyleSheet.create({
  menuStyle: {
    marginVertical: 10,
  },
});
