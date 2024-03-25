import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import ControlPanel from './ControlPanel';
import Drawer from 'react-native-drawer';

//侧滑菜单组件
export default function DrawerMenu(props) {
  let _drawer = null; //侧滑菜单句柄
  let drawerWidth = 270;
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (screenWidth === 360 && screenHeight === 592) {
    drawerWidth = 150;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    drawerWidth = 156;
  } else if (
    parseInt(screenWidth, 10) <= 480 &&
    parseInt(screenHeight, 10) <= 854
  ) {
    drawerWidth = 270;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    drawerWidth = 470;
  }
  if (parseInt(screenWidth, 10) <= 411 && parseInt(screenHeight, 10) <= 842) {
    drawerWidth = 180;
  }
  console.log('props', props);
  console.log('drawerWidth', drawerWidth);
  const [data, setData] = React.useState({
    drawerOpen: false,
    drawerDisabled: false,
  });
  React.useEffect(() => {
    return () => {};
  });
  const closeDrawer = () => {
    _drawer.close();
  };
  const openDrawer = () => {
    _drawer.open();
  };
  return (
    <Drawer
      ref={ref => (_drawer = ref)}
      // Drawer 展开区域组件
      content={
        <ControlPanel
          navigation={props.navigation}
          drawerWidth={drawerWidth}
          closeDrawer={closeDrawer}
        />
      }
      // type: 一共是3种（displace,overlay,static）, 用static就好啦，static让人感觉更舒适一些
      type="overlay"
      // 响应区域双击可以打开抽屉
      acceptDoubleTap
      // styles 和 tweenHandler是设置向左拉后主内容区的颜色，相当于给主内容区加了一个遮罩
      styles={{
        mainOverlay: {
          backgroundColor: 'black',
          opacity: 0,
        },
      }}
      tapToClose={true}
      tweenHandler={ratio => ({
        mainOverlay: {
          opacity: ratio / 2,
        },
      })}
      // drawer打开后调用的函数
      onOpen={() => {
        setData({drawerOpen: true});
      }}
      // drawer关闭后调用的函数
      onClose={() => {
        setData({drawerOpen: false});
      }}
      captureGestures={true}
      // 打开/关闭 Drawer所需要的时间
      tweenDuration={100}
      // 触发抽屉打开/关闭必须经过的屏幕宽度比例
      panThreshold={0.08}
      disabled={data.drawerDisabled}
      // Drawer打开后有边界距离屏幕右边界的距离
      openDrawerOffset={viewport => {
        //这里控制抽屉菜单的宽度
        return drawerWidth;
      }}
      // 拉开抽屉的响应区域
      panOpenMask={0.2}>
      {props.childComponent && props.childComponent(openDrawer)}
    </Drawer>
  );
}

const styles = StyleSheet.create({});
