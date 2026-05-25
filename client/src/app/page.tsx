'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const recorder= useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("/api/history");
      setHistory(res.data);
    } catch (err: any) {
      console.error("Error fetching history:", err);
      setError("Failed to fetch transcription history.");
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
        setError("Failed to access microphone.");
      }
    } else {
      setError("getUserMedia not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stop();
      setRecording(false);
    }
  };

  const handleUpload= async () => {
    if (!audioFile) {
      setError("Please select an audio file or record your voice first.");
      return;
    };

    const validTypes = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/webm"];
    if (audioFile && !validTypes.includes(audioFile.type)) {
      setError("Unsupported file type. Please upload a WAV, MP3, or WEBM audio file.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", audioFile);
    setError("");
    try {
      const res = await axios.post("/api/upload", formData);
      setTranscription(res.data.transcription);
      fetchHistory();
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.response?.data?.error);
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
            <input type="file" accept="audio/*"  onChange={(e)=> setAudioFile(e.target.files ? e.target.files[0] : null)} className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700" />
            {
              audioFile && (
                <p className="text-sm text-cyan-300 mt-3">Selected file: {audioFile.name}</p>
              )
            }

            {
              error &&
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-xl mt-3">
                  {error}
                </div>
            }

            <button onClick={handleUpload} disabled={loading} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 font-semibold flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
              {
                loading ?
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transcribing...</span>
                  </>
                  :
                  "Upload Audio"
              }
            </button>
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
              {
                loading ?
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-700 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse" />
                  </div>
                  :
                  <p>{transcription || "No transcription available"}</p>
              }
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
                    {
                      loading && (
                        <p className="text-cyan-400 text-sm mb-4">Analyzing audio using AI...</p>
                      )
                    }
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
