import Image from 'next/image';

const VideoMessage = ({
  video
}: {
  video: { thumbnail: string; title: string; description: string; url: string };
}) => {
  return (
    <div className='bg-gray-300 rounded p-4'>
      <Image src={video.thumbnail} alt={video.title} className='w-full' />
      <h3 className='text-xl font-bold mt-2'>{video.title}</h3>
      <p className='text-gray-700 mt-2'>{video.description}</p>
      <a
        href={video.url}
        className='inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded-full'
      >
        Ver en YouTube
      </a>
    </div>
  );
};

export default VideoMessage;
