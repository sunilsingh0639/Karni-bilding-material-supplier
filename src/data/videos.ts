export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
}

export const videos: VideoItem[] = [
  {
    id: 'v1',
    title: 'Our Building Materials',
    description: 'A look at our premium quality building materials and supplies.',
    videoId: 'YOUTUBE_VIDEO_ID_V1',
    thumbnail: 'https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_V1/mqdefault.jpg',
  },
  {
    id: 'v2',
    title: 'Delivery & Supply Process',
    description: 'How we ensure timely and reliable delivery to your construction site.',
    videoId: 'YOUTUBE_VIDEO_ID_V2',
    thumbnail: 'https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_V2/mqdefault.jpg',
  },
  {
    id: 'v3',
    title: 'Our Warehouse & Stock',
    description: 'Take a tour of our well-stocked warehouse and material yard.',
    videoId: 'YOUTUBE_VIDEO_ID_V3',
    thumbnail: 'https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_V3/mqdefault.jpg',
  },
];
