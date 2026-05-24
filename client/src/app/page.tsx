'use client';

import axios from "axios";
import { useRef, useState } from "react";

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const recorder= useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

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
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to transcribe audio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-125 space-y-5">
        <h1 className="text-3xl font-bold text-center">Speech To Text</h1>

        <div>
          <label className="block mb-2 font-medium">Upload Audio File</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 border rounded-lg" />
        </div>
        {
          audioFile && (
            <p className="text-sm text-gray-600">Selected file: {audioFile.name}</p>
          )
        }
        <button onClick={handleUpload} disabled={loading} className="bg-blue-600 text-white w-full py-2 rounded">Upload Audio</button>
        
        {
          !recording ? (
            <button onClick={startRecording} className="w-full bg-green-600 text-white p-2 rounded">Start Recording</button>
          ) : (
            <button onClick={stopRecording} className="w-full bg-red-600 text-white p-2 rounded">Stop Recording</button>
          )
        }

        <div className="border rounded p-4 min-h-30">
          <h2 className="font-semibold mb-2">Transcription</h2>
          {
            loading ? (
              <p className="text-gray-500">Transcribing...</p>
            ) : (
              <p className="text-gray-700">{transcription || "Transcription will appear here"}</p>
            )
          }
        </div>
      </div>
    </main>
  );
}
