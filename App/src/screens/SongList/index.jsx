/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image} from 'react-native-animatable';
import {formatDuration} from '../../utils';

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      SongList: [],
      songId: '',
      refreshing: false, // 是否刷新标识
    };
  }
  gotoBack = () => {
    this.props.navigation.goBack();
  };
  componentDidMount() {
    let SongList = this.props.route.params.SongList;
    let songId = this.props.route.params.songId;
    console.log('SongList', SongList);
    console.log('songId', songId);
    this.setState({SongList: SongList, songId: songId});
  }
  gotoPlay = songId => {
    console.log('gotoPlay songId', songId);
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };
  renderItem = ({index, item}) => {
    let createdatetime = item.createdatetime.replace('T', '');
    let durationObj = formatDuration(item.duration);
    let isCurrent = item.songId === this.state.songId;
    let itemSongId = item.songId;
    let frontColor = isCurrent ? 'red' : 'black';
    return (
      <TouchableOpacity
        onPress={() => {
          this.gotoPlay(itemSongId);
        }}>
        <View
          style={
            isCurrent
              ? styles.SongCurrentItemContainer
              : styles.SongItemNormalContainer
          }>
          <Image style={styles.SongItemCover} source={{uri: item.cover}} />
          <View style={styles.SongItemInfoContainer}>
            <View style={styles.SongItemLine}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 17,
                  color: frontColor,
                  fontWeight: 'bold',
                  marginHorizontal: 7,
                }}>
                {item.title}
              </Text>
            </View>
            <View style={styles.SongItemLine}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 13,
                  color: frontColor,
                  marginHorizontal: 7,
                }}>
                {item.artist}
              </Text>
            </View>
            <View style={styles.SongItemLine}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 13,
                  color: frontColor,
                  marginHorizontal: 7,
                }}>
                {durationObj.hour}:{durationObj.minute}:{durationObj.second}
              </Text>
            </View>
            <View style={styles.SongItemLine}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 13,
                  color: frontColor,
                  marginHorizontal: 7,
                }}>
                {createdatetime}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <LinearGradient
        style={styles.linearGradient}
        colors={['#12fff7', 'white']}>
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
              播放列表
            </Text>
          </View>
        </View>
        <View style={styles.SongListContainer}>
          <FlatList
            data={this.state.SongList}
            renderItem={this.renderItem}
            keyExtractor={item => item.songId}
            horizontal={false}
          />
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  SongItemCover: {
    width: 87,
    height: 87,
    borderRadius: 10,
    marginHorizontal: 7,
    marginVertical: 17,
  },
  SongItemLine: {
    width: Dimensions.get('window').width - 147,
    minHeight: 15,
    maxHeight: 32,
    textAlign: 'left',
    marginVertical: 3,
    borderWidth: 0,
    borderColor: 'red',
  },
  SongItemInfoContainer: {
    width: Dimensions.get('window').width - 145,
    height: 125,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 0,
    borderColor: 'red',
  },
  SongCurrentItemContainer: {
    width: Dimensions.get('window').width - 35,
    height: 136,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  SongItemNormalContainer: {
    width: Dimensions.get('window').width - 35,
    height: 136,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 12,
    borderBottomColor: 'rgba(236,236,251,0.8)',
    borderBottomWidth: 1,
  },
  SongListContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 55,
    borderWidth: 0,
    borderColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
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
    fontWeight: 'bold',
    paddingTop: 5,
  },
  forwardBack: {
    marginVertical: 10,
    iconSize: 35,
  },
});
