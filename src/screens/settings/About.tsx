import {
  View,
  Text,
  TouchableNativeFeedback,
  ToastAndroid,
  Linking,
  Alert,
  Switch,
} from 'react-native';
import pkg from '../../../package.json';
import React, {useState} from 'react';
import {Feather} from 'react-native-vector-icons';
import {MMKV} from '../../lib/Mmkv';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {MaterialCommunityIcons} from 'react-native-vector-icons';
import useThemeStore from '../../lib/zustand/themeStore';

// download update
const downloadUpdate = async (url: string, name: string, theme: string) => {
  console.log('downloading', url, name);
  try {
    if (await RNFS.exists(`${RNFS.DownloadDirectoryPath}/${name}`)) {
      return;
    }
  } catch (error) {}
  const {promise} = RNFS.downloadFile({
    fromUrl: url,
    background: true,
    progressInterval: 1000,
    progressDivider: 1,
    toFile: `${RNFS.DownloadDirectoryPath}/${name}`,
    begin: res => {
      console.log('begin', res.jobId, res.statusCode, res.headers);
    },
    progress: res => {
      console.log('progress', res.bytesWritten, res.contentLength);
    },
  });
  promise.then(async res => {
    if (res.statusCode === 200) {
    }
  });
};

// handle check for update
export const checkForUpdate = async (
  setUpdateLoading: React.Dispatch<React.SetStateAction<boolean>>,
  autoDownload: boolean,
  showToast: boolean = true,
  primary: string,
) => {
  setUpdateLoading(true);
  try {
    const res = await fetch(
      'https://api.github.com/repos/Zenda-Cross/vega-app/releases/latest',
    );
    const data = await res.json();
    const localVersion = Number(pkg.version?.split('.').join(''));
    const remoteVersion = Number(
      data.tag_name.replace('v', '')?.split('.').join(''),
    );
    if (remoteVersion > localVersion) {
      ToastAndroid.show('New update available', ToastAndroid.SHORT);
      Alert.alert(`Update v${pkg.version} -> ${data.tag_name}`, data.body, [
        {text: 'Cancel'},
        {
          text: 'Update',
          onPress: () =>
            autoDownload
              ? downloadUpdate(
                  data?.assets?.[2]?.browser_download_url,
                  data.assets?.[2]?.name,
                  primary,
                )
              : Linking.openURL(data.html_url),
        },
      ]);
      console.log(
        'local version',
        localVersion,
        'remote version',
        remoteVersion,
      );
    } else {
      showToast && ToastAndroid.show('App is up to date', ToastAndroid.SHORT);
      console.log(
        'local version',
        localVersion,
        'remote version',
        remoteVersion,
      );
    }
  } catch (error) {
    ToastAndroid.show('Failed to check for update', ToastAndroid.SHORT);
    console.log('Update error', error);
  }
  setUpdateLoading(false);
};

async function handleAction({
  type,
  detail,
}: {
  type: EventType;
  detail: EventDetail;
}) {
  console.log('handleAction', type, detail.pressAction?.id);
  if (type === EventType.PRESS && detail.pressAction?.id === 'install') {
    const res = await RNFS.exists(
      `${RNFS.DownloadDirectoryPath}/${detail.notification?.data?.name}`,
    );
    console.log('install', res);
  }
}

const About = () => {
  const {primary} = useThemeStore(state => state);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [autoDownload, setAutoDownload] = useState(
    MMKV.getBool('autoDownload') || false,
  );
  const [autoCheckUpdate, setAutoCheckUpdate] = useState<boolean>(
    MMKV.getBool('autoCheckUpdate') || true,
  );

  return (
    <View className="w-full h-full bg-black p-4">
      <Text className="text-2xl font-bold text-white mt-7">About</Text>

      {/* version */}
      <View className="flex-row items-center justify-between mt-5 bg-tertiary p-2 rounded-md">
        <Text className="text-white font-semibold my-2">Version</Text>
        <Text className="text-white font-semibold my-2">v{pkg.version}</Text>
      </View>

      {/* Auto Download Updates*/}
      <View className="flex-row items-center justify-between mt-5 bg-tertiary p-2 rounded-md">
        <Text className="text-white font-semibold my-2">
          Auto Install Updates
        </Text>
        <Switch
          value={autoDownload}
          onValueChange={() => {
            setAutoDownload(!autoDownload);
            MMKV.setBool('autoDownload', !autoDownload);
          }}
          thumbColor={autoDownload ? primary : 'gray'}
        />
      </View>

      {/* Auto check for updates */}
      <View className="flex-row items-center justify-between mt-5 bg-tertiary p-2 rounded-md">
        <Text className="text-white font-semibold my-2">
          Check for Updates on Start
        </Text>
        <Switch
          value={autoCheckUpdate}
          onValueChange={() => {
            setAutoCheckUpdate(!autoCheckUpdate);
            MMKV.setBool('autoCheckUpdate', !autoCheckUpdate);
          }}
          thumbColor={autoCheckUpdate ? primary : 'gray'}
        />
      </View>

      <TouchableNativeFeedback
        onPress={() =>
          checkForUpdate(setUpdateLoading, autoDownload, true, primary)
        }
        disabled={updateLoading}
        background={TouchableNativeFeedback.Ripple('gray', false)}>
        <View className=" flex-row items-center px-4 justify-between mt-5 bg-tertiary p-2 py-3 rounded-md">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="update"
              size={24}
              color="white"
              className=""
            />
            <Text className="text-white font-semibold">Check for Updates</Text>
          </View>
          <Feather name="chevron-right" size={20} color="white" />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default About;
