import React, {useRef} from 'react';
import MainScreen from './src/screens/MainScreen';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import SideBar from './src/screens/SideBar';
import {Dimensions, Pressable, SafeAreaView, Platform} from 'react-native';
import {AppWrapper} from './src/utils/context';
import CustomIcon from './src/utils/CustomIcon';
import 'react-native-gesture-handler';
import AndroidDrawerLayout from './src/screens/AndroidDrawerLayout';

const WIDTH = Dimensions.get('window').width;

export default function App() {
  const drawerRef = useRef<DrawerLayout>(null);

  return (
    <AppWrapper>
      {Platform.OS === 'android' ? (
        <AndroidDrawerLayout drawerWidth={WIDTH * 0.7} />
      ) : (
        <DrawerLayout
          ref={drawerRef}
          drawerWidth={WIDTH * 0.7}
          edgeWidth={WIDTH * 0.3}
          drawerType="front"
          keyboardDismissMode="on-drag"
          renderNavigationView={SideBar}>
          <MainScreen />
          <SafeAreaView style={{position: 'absolute'}}>
            <Pressable
              style={{padding: 10}}
              onPress={() => drawerRef.current?.openDrawer()}>
              <CustomIcon name="menu" size={30} dir="Feather" />
            </Pressable>
          </SafeAreaView>
        </DrawerLayout>
      )}
    </AppWrapper>
  );
}
