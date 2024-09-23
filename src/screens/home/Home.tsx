import {SafeAreaView, ScrollView, RefreshControl} from 'react-native';
import Slider from '../../components/Slider';
import React, {useEffect, useRef, useState} from 'react';
import Hero from '../../components/Hero';
import {View} from 'moti';
import {getHomePageData, HomePageData} from '../../lib/getHomepagedata';
import {MMKV, MmmkvCache} from '../../lib/Mmkv';
import useContentStore from '../../lib/zustand/contentStore';
import useHeroStore from '../../lib/zustand/herostore';
import {manifest} from '../../lib/Manifest';
import useDownloadsStore from '../../lib/zustand/downloadsStore';
// import {FFmpegKit} from 'ffmpeg-kit-react-native';
import useWatchHistoryStore from '../../lib/zustand/watchHistrory';
import useThemeStore from '../../lib/zustand/themeStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../App';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;
const Home = ({}: Props) => {
  const {primary} = useThemeStore(state => state);
  const [refreshing, setRefreshing] = useState(false);
  const [homeData, setHomeData] = useState<HomePageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const downloadStore = useDownloadsStore(state => state);
  const recentlyWatched = useWatchHistoryStore(state => state).history;
  const ShowRecentlyWatched = MMKV.getBool('showRecentlyWatched');

  const {provider} = useContentStore(state => state);
  const {setHero} = useHeroStore(state => state);

  // change status bar color
  const handleScroll = (event: any) => {
    setBackgroundColor(
      event.nativeEvent.contentOffset.y > 0 ? 'black' : 'transparent',
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchHomeData = async () => {
      setLoading(true);
      setHero({link: '', image: '', title: ''});
      const cache = MmmkvCache.getString('homeData' + provider.value);
      // console.log('cache', cache);
      if (cache) {
        const data = JSON.parse(cache as string);
        setHomeData(data);
        // pick random post form random category
        const randomPost =
          data[data?.length - 1].Posts[
            Math.floor(Math.random() * data[data?.length - 1].Posts.length)
          ];
        setHero(randomPost);

        setLoading(false);
      }
      const data = await getHomePageData(provider, signal);
      if (!cache && data.length > 0) {
        const randomPost =
          data[data?.length - 1].Posts[
            Math.floor(Math.random() * data[data?.length - 1].Posts.length)
          ];
        setHero(randomPost);
      }

      if (
        data[data?.length - 1].Posts.length === 0 ||
        data[0].Posts.length === 0
      ) {
        return;
      }
      setLoading(false);
      setHomeData(data);
      MmmkvCache.setString('homeData' + provider.value, JSON.stringify(data));
    };
    fetchHomeData();
    return () => {
      controller.abort();
    };
  }, [refreshing, provider]);

  return (
    <SafeAreaView className="bg-black h-full w-full">
      <ScrollView
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[primary]}
            tintColor={primary}
            progressBackgroundColor={'black'}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1000);
            }}
          />
        }>
        {/* <Hero /> */}
        <View className="p-4">
          {loading
            ? manifest[provider.value].catalog.map((item, index) => (
                <Slider
                  isLoading={loading}
                  key={index}
                  title={item.title}
                  posts={[]}
                  filter={item.filter}
                />
              ))
            : homeData.map((item, index) => (
                <Slider
                  isLoading={loading}
                  key={index}
                  title={item.title}
                  posts={item.Posts}
                  filter={item.filter}
                />
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
