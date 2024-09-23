import React, {useEffect} from 'react';
import Home from './screens/home/Home';
import Info from './screens/home/Info';
import Player from './screens/home/Player';
import Settings from './screens/settings/Settings';
import WatchList from './screens/WatchList';
import Search from './screens/Search';
import ScrollList from './screens/ScrollList';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import 'react-native-reanimated';
import WebView from './screens/WebView';
import SearchResults from './screens/SearchResults';
import DisableProviders from './screens/settings/DisableProviders';
import About, {checkForUpdate} from './screens/settings/About';
import {MMKV} from './lib/Mmkv';
import {enableFreeze, enableScreens} from 'react-native-screens';
import Preferences from './screens/settings/Preference';
import useThemeStore from './lib/zustand/themeStore';
import {LogBox, Text} from 'react-native';
import {View} from 'moti';
import {EpisodeLink} from './lib/providers/types';

enableScreens(true);
enableFreeze(true);

export type HomeStackParamList = {
  Home: undefined;
  Info: {link: string; provider?: string; poster?: string};
  ScrollList: {
    filter: string;
    title?: string;
    providerValue?: string;
    isSearch: boolean;
  };
  Webview: {link: string};
};

export type RootStackParamList = {
  TabStack: undefined;
  Player: {
    linkIndex: number;
    episodeList: EpisodeLink[];
    type: string;
    primaryTitle?: string;
    secondaryTitle?: string;
    poster: {
      logo?: string;
      poster?: string;
      background?: string;
    };
    file?: string;
    providerValue?: string;
  };
};

export type SearchStackParamList = {
  Search: undefined;
  ScrollList: {
    filter: string;
    title?: string;
    providerValue?: string;
    isSearch: boolean;
  };
  Info: {link: string; provider?: string; poster?: string};
  SearchResults: {filter: string};
};

export type WatchListStackParamList = {
  WatchList: undefined;
  Info: {link: string; provider?: string; poster?: string};
};

export type SettingsStackParamList = {
  Settings: undefined;
  DisableProviders: undefined;
  About: undefined;
  Preferences: undefined;
};

export type TabStackParamList = {
  HomeStack: undefined;
  SearchStack: undefined;
  WatchList: undefined;
  SettingsStack: undefined;
};
const Tab = createBottomTabNavigator<TabStackParamList>();
const App = () => {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const SearchStack = createNativeStackNavigator<SearchStackParamList>();
  const WatchListStack = createNativeStackNavigator<WatchListStackParamList>();
  const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
  const {primary} = useThemeStore(state => state);

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'ios',
          animationDuration: 200,
          freezeOnBlur: true,
        }}>
        <HomeStack.Screen name="Home" component={Home} />
        <HomeStack.Screen name="Info" component={Info} />
        {/* <HomeStack.Screen name="ScrollList" component={ScrollList} />
        <HomeStack.Screen name="Webview" component={WebView} /> */}
      </HomeStack.Navigator>
    );
  }

  function SearchStackScreen() {
    return (
      <SearchStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'ios',
          animationDuration: 200,
          freezeOnBlur: true,
        }}>
        <SearchStack.Screen name="Search" component={Search} />
        <SearchStack.Screen name="ScrollList" component={ScrollList} />
        <SearchStack.Screen name="Info" component={Info} />
        <SearchStack.Screen name="SearchResults" component={SearchResults} />
      </SearchStack.Navigator>
    );
  }

  function WatchListStackScreen() {
    return (
      <WatchListStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'ios',
          animationDuration: 200,
          freezeOnBlur: true,
        }}>
        <WatchListStack.Screen name="WatchList" component={WatchList} />
        <WatchListStack.Screen name="Info" component={Info} />
      </WatchListStack.Navigator>
    );
  }

  function SettingsStackScreen() {
    return (
      <SettingsStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'ios',
          animationDuration: 200,
          freezeOnBlur: true,
        }}>
        <SettingsStack.Screen name="Settings" component={Settings} />
        <SettingsStack.Screen
          name="DisableProviders"
          component={DisableProviders}
        />
        <SettingsStack.Screen name="About" component={About} />
        <SettingsStack.Screen name="Preferences" component={Preferences} />
      </SettingsStack.Navigator>
    );
  }

  function TabStack() {
    return (
      <Tab.Navigator
        detachInactiveScreens={true}
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true,
          tabBarActiveTintColor: primary,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {backgroundColor: 'black'},
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStackScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <Ionicons name="home" color={color} size={size} />
              ) : (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
          }}
        />
        <Tab.Screen
          name="SearchStack"
          component={SearchStackScreen}
          options={{
            title: 'Search',
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <Ionicons name="search" color={color} size={size} />
              ) : (
                <Ionicons name="search-outline" color={color} size={size} />
              ),
          }}
        />
        <Tab.Screen
          name="WatchList"
          component={WatchListStackScreen}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <Entypo name="folder-video" color={color} size={size} />
              ) : (
                <Entypo name="folder-video" color={color} size={size} />
              ),
          }}
        />
        <Tab.Screen
          name="SettingsStack"
          component={SettingsStackScreen}
          options={{
            title: 'Settings',
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <Ionicons name="settings" color={color} size={size} />
              ) : (
                <Ionicons name="settings-outline" color={color} size={size} />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          background: 'black',
          card: 'black',
          primary: primary,
          text: 'white',
          border: 'black',
          notification: primary,
        },
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerBlurEffect: 'light',
          headerTintColor: primary,
          headerStyle: {backgroundColor: '#171717'},
        }}>
        <Stack.Screen name="TabStack" component={TabStack} />
        {/* <Stack.Screen
          options={{
            orientation: 'landscape',
          }}
          name="Player"
          component={Player}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
