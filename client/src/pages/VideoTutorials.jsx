import React from 'react';
import { PlayCircle } from 'lucide-react';

const tutorials = [
  {
    id: 1,
    title: 'Getting Started with BlogPro',
    desc: 'Learn how to set up your account and create your first post.',
    duration: '4:12',
    thumbnail: 'https://img.youtube.com/vi/TXkZb7aX2JY/0.jpg',
  },
  {
    id: 2,
    title: 'Using the AI Writing Assistant',
    desc: 'Generate better content ideas using AI Studio.',
    duration: '6:47',
    thumbnail: 'https://img.youtube.com/vi/N83ZtS3P5xQ/0.jpg',
  },
  {
    id: 3,
    title: 'Master the Dashboard Analytics',
    desc: 'Analyze your content performance and trends.',
    duration: '5:05',
    thumbnail: 'https://img.youtube.com/vi/ONv3uG1Xw1Y/0.jpg',
  },
];

const VideoTutorials = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <PlayCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Video Tutorials</h1>
        <p className="text-gray-500 dark:text-gray-400">Watch and learn to use every feature effectively.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tutorials.map((tut) => (
          <div key={tut.id} className="card overflow-hidden hover:shadow-xl transition rounded-2xl">
            <div className="relative">
              <img src={tut.thumbnail} alt={tut.title} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white opacity-90" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">{tut.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{tut.desc}</p>
              <div className="text-xs text-gray-400">⏱ {tut.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoTutorials;
