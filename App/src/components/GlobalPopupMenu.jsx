/* eslint-disable react-native/no-inline-styles */
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import Menu, {
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default class GlobalPopupMenu extends Component {
  constructor() {
    super();
    this.state = {
      top: 0,
      left: 0,
    };
  }
  onOptionSelect(value) {
    console.log(`Selected number: ${value}`);
    console.log('this.menu', this.menu);
    if (this.menu !== null && typeof this.menu !== 'undefined') {
      this.menu.closeMenu();
    }
    return false;
  }
  openMenu = (menuName, top, left) => {
    console.log('menuName', menuName);
    console.log('this.menu');
    console.log(this.menu);
    if (this.menu !== null && typeof this.menu !== 'undefined') {
      if (this.props.openMenu != null) {
        this.props.openMenu();
      }
      this.setState({top, left});
      this.menu.openMenu(menuName);
    }
  };

  onRef = r => {
    this.menu = r.props.ctx.menuActions;
  };
  render() {
    return (
      <>
        <Menu
          onSelect={value => this.onOptionSelect(value)}
          name={this.props.name}
          style={{display: 'none'}}
          ref={this.onRef}>
          <MenuTrigger text="Select option" />
          <MenuOptions
            optionsContainerStyle={{
              marginTop: parseInt(this.state.top, 10),
              marginLeft: parseInt(this.state.left, 10),
            }}>
            <MenuOption value={1} text="添加到播放列表" />
            <MenuOption value={2} text="添加到歌单" />
            <MenuOption value={3} text="删除歌曲" />
          </MenuOptions>
        </Menu>
      </>
    );
  }
}

const styles = StyleSheet.create({
  menuStyle: {
    marginVertical: 10,
  },
});
