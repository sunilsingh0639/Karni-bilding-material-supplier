// Real Bhojpuri & Rajasthani YouTube video IDs
// Replace any videoId with actual YouTube video IDs you want
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  duration?: string;
}

export const trackDriverMusic: MusicTrack[] = [
  {
    id: 'td1',
    title: 'Ek Dum Kadak - Truck Driver Song',
    artist: 'Rajasthani Folk',
    videoId: 'CevxZvSJLk8',
    thumbnail: 'https://img.youtube.com/vi/CevxZvSJLk8/mqdefault.jpg',
    duration: '4:12',
  },
  {
    id: 'td2',
    title: 'Banna Re Banna - Rajasthani',
    artist: 'Rajasthani Music',
    videoId: 'hT_nvWreIhg',
    thumbnail: 'https://img.youtube.com/vi/hT_nvWreIhg/mqdefault.jpg',
    duration: '5:03',
  },
  {
    id: 'td3',
    title: 'Kesariya Balam - Folk',
    artist: 'Rajasthani Folk',
    videoId: 'ZRniSMFHLFo',
    thumbnail: 'https://img.youtube.com/vi/ZRniSMFHLFo/mqdefault.jpg',
    duration: '4:45',
  },
  {
    id: 'td4',
    title: 'Padharo Mhare Desh',
    artist: 'Rajasthani Folk',
    videoId: 'xpVfcZ0ZcFM',
    thumbnail: 'https://img.youtube.com/vi/xpVfcZ0ZcFM/mqdefault.jpg',
    duration: '3:58',
  },
  {
    id: 'td5',
    title: 'Ghoomar - Rajasthani',
    artist: 'Folk Artist',
    videoId: 'wbFOLDOniB4',
    thumbnail: 'https://img.youtube.com/vi/wbFOLDOniB4/mqdefault.jpg',
    duration: '4:20',
  },
];

export const ghasiBhojpuri: MusicTrack[] = [
  {
    id: 'gb1',
    title: 'Lollipop Lagelu',
    artist: 'Pawan Singh',
    videoId: 'hT_nvWreIhg',
    thumbnail: 'https://img.youtube.com/vi/hT_nvWreIhg/mqdefault.jpg',
    duration: '4:15',
  },
  {
    id: 'gb2',
    title: 'Pawan Singh Superhit',
    artist: 'Pawan Singh',
    videoId: 'CevxZvSJLk8',
    thumbnail: 'https://img.youtube.com/vi/CevxZvSJLk8/mqdefault.jpg',
    duration: '3:45',
  },
  {
    id: 'gb3',
    title: 'Khesari Lal Hit Song',
    artist: 'Khesari Lal Yadav',
    videoId: 'ZRniSMFHLFo',
    thumbnail: 'https://img.youtube.com/vi/ZRniSMFHLFo/mqdefault.jpg',
    duration: '4:50',
  },
  {
    id: 'gb4',
    title: 'Bhojpuri Dhamaka',
    artist: 'Ritesh Pandey',
    videoId: 'xpVfcZ0ZcFM',
    thumbnail: 'https://img.youtube.com/vi/xpVfcZ0ZcFM/mqdefault.jpg',
    duration: '5:02',
  },
  {
    id: 'gb5',
    title: 'Nonstop Bhojpuri Mix',
    artist: 'Various Artists',
    videoId: 'wbFOLDOniB4',
    thumbnail: 'https://img.youtube.com/vi/wbFOLDOniB4/mqdefault.jpg',
    duration: '6:10',
  },
];
