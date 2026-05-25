'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const recorder= useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
      alert("Failed to fetch transcription history.");
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder.current = new MediaRecorder(stream);
        chunks.current=[];
        recorder.current.ondataavailable = (e) => {
          chunks.current.push(e.data);
        };
        recorder.current.onstop = () => {
          const blob = new Blob(chunks.current, { type: "audio/wav" });
          const file = new File([blob], "record.wav", { type: "audio/wav" });
          setAudioFile(file);
        };
        recorder.current.start();
        setRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    } else {
      alert("getUserMedia not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stop();
      setRecording(false);
    }
  };

  const handleUpload= async () => {
    if (!audioFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const res = await axios.post("/api/upload", formData);
      setTranscription(res.data.transcription);
      fetchHistory();
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to transcribe audio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-6xl font-extrabold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Speech To Text</h1>
          <p className="mt-4 text-slate-400 text-lg">Upload audio or record voice and convert speech into text instantly</p>
        </div>

        {/* Top 2 Cards */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Upload Card */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.08)]">
            <h2 className="text-2xl font-semibold mb-6">Upload / Record</h2>
            <input type="file" accept="audio/*" onChange={(e)=> setAudioFile(e.target.files ? e.target.files[0] : null)} className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700" />
            <button onClick={handleUpload} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500">Upload Audio</button>

            {

              !recording ?
                <button onClick={startRecording} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500">Start Recording</button>
                  :
                  <button onClick={stopRecording} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-red-500 to-pink-600 animate-pulse">Stop Recording</button>

            }
          </div>

          {/* Latest Transcript */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-[0_0_30px_rgba(255,0,255,0.08)]">
            <h2 className="text-2xl font-semibold mb-5">Latest Transcription</h2>
            <div className="bg-slate-900 rounded-2xl p-6 min-h-62.5">
              <p>{transcription || "No transcription available"}</p>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mt-12 bg-white/8 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20">
          <h2 className="text-3xl font-bold mb-8">Transcription History</h2>
          <div className="grid md:grid-cols-2 gap-5 max-h-125 overflow-y-auto pr-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {
              history.length > 0 ?
                history.map((item:any)=>(
                  <div key={item._id} className="bg-slate-900/80 rounded-2xl border border-slate-700 p-5 hover:border-cyan-500 transition">
                    <p>{item.transcription}</p>
                    <div className="text-sm text-slate-400 mt-3">{item.filename}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
                :
                <p className="text-slate-500">No transcription history</p>
            }
          </div>
        </div>
      </div>
    </main>
  );
}
