/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import {Image} from 'react-native-animatable';

export default class Index extends Component {
  gotoBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    return (
      <LinearGradient style={styles.container} colors={['#12fff7', '#ffffff']}>
        {/*AppBar B*/}
        <View style={styles.barHeader}>
          <TouchableOpacity
            onPress={() => {
              this.gotoBack();
            }}>
            <Icon
              style={styles.forwardBack}
              name="chevron-back-outline"
              size={styles.forwardBack.iconSize}
            />
          </TouchableOpacity>
          <View style={styles.AppBarTitleContainer}>
            <Text numberOfLines={1} style={styles.AppBarTitle}>
              关于程序
            </Text>
          </View>
        </View>
        {/*AppBar E*/}
        <ScrollView horizontal={false}>
          <View
            style={{
              width: Dimensions.get('window').width,
              height: styles.logo.height + 10,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={styles.logo}
              source={require('../../images/LogoHorizontal.png')}
            />
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.titleFontStyle}>一、开源声明</Text>
            <Text numberOfLines={30} style={styles.contentFontStyle}>
              &nbsp;&nbsp;&nbsp;本软件旨在研究学习只用,软件图标,界面设计版权归作者所有。
              软件下载使用者禁止在未经作者同意用于商业用途。{'\n'}
              &nbsp;&nbsp;&nbsp;软件下载使用者，可以在学习研究用途对本软件进行修改，重新
              编译，但是不得删除作者信息。{'\n'}
              &nbsp;&nbsp;&nbsp;本软件包含第三方的开源组件或库，这些组件或库受其各自的许
              可限制，您也要遵守这些许可限制。{'\n'}
              &nbsp;&nbsp;&nbsp;原作者不对本软件任何使用方式负任何责任，包括但不限于直接
              或间接的损失或损坏。{'\n'}
              &nbsp;&nbsp;&nbsp;原作者保留随时修改本开源使用声明的权利，修改后的声明将在
              原作者的官方网站或代码仓库上公布。{'\n'}
            </Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.titleFontStyle}>一、Open source statement</Text>
            <Text numberOfLines={30} style={styles.contentFontStyle}>
              &nbsp;&nbsp;&nbsp;This software is designed for research purposes
              only. The copyright of the software icon and interface design
              belongs to the author. Software download users are prohibited from
              using it for commercial purposes without the author's consent.
              {'\n'}
              &nbsp;&nbsp;&nbsp;Software download users can modify and re
              install this software for learning and research purposes Compile,
              but do not delete author information.{'\n'}
              &nbsp;&nbsp;&nbsp;This software contains third-party open-source
              components or libraries, which are licensed under their respective
              licenses May be restricted, and you must also comply with these
              license restrictions.{'\n'}
              &nbsp;&nbsp;&nbsp;The original author is not responsible for any
              usage of this software, including but not limited to direct use Or
              indirect loss or damage.{'\n'}
              &nbsp;&nbsp;&nbsp;The original author reserves the right to modify
              this open source usage statement at any time, and the modified
              statement will be published in the Published on the official
              website or code repository of the original author.{'\n'}
            </Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.titleFontStyle}>二、版权声明</Text>
            <Text numberOfLines={30} style={styles.contentFontStyle}>
              &nbsp;&nbsp;&nbsp;本程序的音乐数据版权仅供学习研究只用,任何人因传播或者用
              于商业用途造成的版权问题和作者无关。{'\n'}
              &nbsp;&nbsp;&nbsp;本程序使用的第三方图标和背景图均已购买，所以第三方图标
              和背景图片不存在任何版权问题。{'\n'}
            </Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.titleFontStyle}>二、 Copyright Notice</Text>
            <Text numberOfLines={30} style={styles.contentFontStyle}>
              &nbsp;&nbsp;&nbsp;The music data copyright of this program is for
              learning and research purposes only, and no one may use it for
              dissemination or use Copyright issues caused by commercial use are
              not related to the author.{'\n'}
              &nbsp;&nbsp;&nbsp;The third-party icons and background images used
              in this program have been purchased, so the third-party icons
              There is no copyright issue with the background image.{'\n'}
            </Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.titleFontStyle}>三、作者信息</Text>
            <Text numberOfLines={30} style={styles.contentFontStyle}>
              姓名:杨明{'\n'}
              QQ:760044511{'\n'}
              Email:yms126@qq.com{'\n'}
              WeChat:Ming_Yang_760444511{'\n'}
            </Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.titleFontStyle}>三、Contact Author</Text>
            <Text numberOfLines={30} style={styles.contentFontStyle}>
              Name:Ming Yang{'\n'}
              QQ:760044511{'\n'}
              Email:yms126@qq.com{'\n'}
              WeChat:Ming_Yang_760444511{'\n'}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: Dimensions.get('window').width - 71,
    height: 126,
    resizeMode: 'stretch',
    marginVertical: 7,
  },
  lineContainer: {
    width: Dimensions.get('window').width,
    minHeight: 15,
    maxHeight: 581,
    marginVertical: 36,
    borderWidth: 0,
    borderColor: 'red',
    textAlign: 'left',
  },
  titleFontStyle: {
    fontSize: 27,
    color: 'black',
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  contentFontStyle: {
    fontSize: 18,
    color: 'black',
    flexWrap: 'wrap',
    marginHorizontal: 6,
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
    //backgroundColor: 'rgba(8,112,113,0.7)',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  AppBarTitleContainer: {
    width: Dimensions.get('window').width - 75,
    height: 37,
    marginVertical: 9,
    borderColor: 'red',
    borderWidth: 0,
  },
  AppBarTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    paddingTop: 5,
  },
  forwardBack: {
    color: 'black',
    marginVertical: 10,
    iconSize: 35,
  },
});
