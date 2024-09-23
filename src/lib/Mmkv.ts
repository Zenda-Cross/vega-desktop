// import {MMKVLoader} from 'react-native-mmkv-storage';

export const MMKV = {
  initialize: () => {},
  setString: (st: string) => {},
  getString: (st: string) => {},
  setMap: (st: string) => {},
  getMap: (st: string) => {},
  setArray: (st: string) => {},
  getArray: (st: string) => { return 23 as any}
  getBool: (st: string) => {},
  setBool: (st: string) => {},
  getInt: (st: string) => {},
  setInt: (st: string) => {},
  getFloat: (st: string) => {},
  setFloat: (st: string) => {},
};

export const MmmkvCache = {
  initialize: () => {},
  setString: (st: string) => {},
  getString: (st: string) => {return 23 as any},
  setMap: () => {},
  getMap: () => {},
  setArray: () => {},
  getArray: () => {},
  getBool: () => {},
  setBool: () => {},
  getInt: () => {},
  setInt: () => {},
  getFloat: () => {},
  setFloat: () => {},
};
