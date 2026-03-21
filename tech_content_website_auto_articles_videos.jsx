import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CHANNEL_ID = "UC"; // replace with real channel ID from YouTube API
const API_KEY = "YOUR_YOUTUBE_API_KEY";

export default function TechWebsite() {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // 🔴 REAL YouTube Auto Fetch
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
        );
        const data = await res.json();

        const videoIds = data.items.map((item) => item.id.videoId).join(",");

        const statsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=statistics`
        );
        const statsData = await statsRes.json();

        const videosData = data.items.map((item, index) => ({
          id: item.id.videoId,
          url: `https://www.youtube.com/embed/${item.id.videoId}`,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          views: parseInt(statsData.items[index].statistics.viewCount),
          date: new Date(item.snippet.publishedAt)
        }));

        setVideos(videosData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideos();
  }, []);

  // ➕ Add Article (with image)
  const addArticle = () => {
    const newArticle = {
      id: Date.now(),
      title,
      content,
      image,
      date: new Date()
    };
    setArticles([newArticle, ...articles]);
    setTitle("");
    setContent("");
    setImage(null);
  };

  // 📊 Auto Sections
  const latestArticles = [...articles].sort((a, b) => b.date - a.date);
  const latestVideos = [...videos].sort((a, b) => b.date - a.date);
  const topVideos = [...videos].sort((a, b) => b.views - a.views);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Tech Sunlight</h1>
        <a href="https://www.youtube.com/@TechSunlight" target="_blank">
          <Button>Visit Channel</Button>
        </a>
      </div>

      {/* Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
        🚀 Tech Sunlight - Latest Technology Updates
      </div>

      {/* Upload Article */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <h2 className="text-xl font-semibold">Upload Article</h2>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="file"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          />
          <Button onClick={addArticle}>Post Article</Button>
        </CardContent>
      </Card>

      {/* Latest Videos */}
      <div>
        <h2 className="text-2xl font-bold">Latest Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestVideos.map((v) => (
            <iframe key={v.id} src={v.url} className="w-full h-48" allowFullScreen></iframe>
          ))}
        </div>
      </div>

      {/* Top Videos */}
      <div>
        <h2 className="text-2xl font-bold">Trending Videos (Highest Views)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topVideos.map((v) => (
            <iframe key={v.id} src={v.url} className="w-full h-48" allowFullScreen></iframe>
          ))}
        </div>
      </div>

      {/* Latest Articles */}
      <div>
        <h2 className="text-2xl font-bold">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestArticles.map((a) => (
            <Card key={a.id}>
              <CardContent>
                {a.image && <img src={a.image} className="w-full h-40 object-cover" />}
                <h3 className="font-semibold">{a.title}</h3>
                <p>{a.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
