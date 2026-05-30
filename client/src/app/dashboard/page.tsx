'use client';
import axios from 'axios';
import { AudioWaveform, Upload, Mic, LogOut, User, Loader2, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'
import toast from "react-hot-toast";

const Dashboard = () => {
    const router = useRouter();
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);
    const [liveTranscription, setLiveTranscription] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognition = useRef<any>(null);

    useEffect(()=>{
        const checkAuth= async() => {
            try {
                await axios.get("/api/auth/me", {withCredentials: true});
                const storedUser= localStorage.getItem('user');
                if(storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                fetchHistory();
            } catch (err) {
                router.push("/login");
            }
        }
        checkAuth();
    },[]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if(!SpeechRecognition) {
            toast.error("Speech Recognition API is not supported in this browser.");
            return;
        }

        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";
            for(let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if(event.results[i].isFinal) {
                    finalTranscript += transcript + " ";
                } else {
                    interimTranscript += transcript;
                }
            }
            setLiveTranscription(finalTranscript + interimTranscript);
        };

        recog.onerror = () => {
            toast.error("Speech recognition error. Please try again.");
            setIsListening(false);
        }

        recognition.current = recog;
    },[])


    const fetchHistory = async () => {
        try {
            const res = await axios.get("/api/history", {withCredentials: true});
            setHistory(res.data);
        } catch (err: any) {
            console.error("Error fetching history:", err);
            toast.error(err.response?.data?.error || "Failed to fetch history");
        }
    };

    const startRecording = async () => {
        if(recognition.current) {
            recognition.current.start();
            setIsListening(true);
            toast.success("Live transcription started. Speak now!");
        }
    };

    const stopRecording = () => {
        if(recognition.current) {
            recognition.current.stop();
            setIsListening(false);
            setTranscription(liveTranscription);
            toast.success("Live transcription stopped.");
        }
    };

    const handleUpload = async () => {
        if (!audioFile) {
            setError("Please select an audio file or record your voice first.");
            return;
        };

        const validTypes = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/webm"];
        if (audioFile && !validTypes.includes(audioFile.type)) {
            setError("Unsupported file type. Please upload a WAV, MP3, or WEBM audio file.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("audio", audioFile);
            const res = await axios.post("/api/upload", formData, { withCredentials: true });
            setError("");
            setTranscription(res.data.transcription);
            fetchHistory();
            toast.success("Audio transcribed successfully!");
        } catch (err: any) {
            console.error("Error uploading file:", err);
            toast.error(err.response?.data?.error || "Failed to transcribe audio");
        } finally {
            setLoading(false);
        }
    }

    const handleSaveLiveTranscription = async () => {
        if(!liveTranscription.trim()) {
            toast.error("No live transcription to save.");
            return;
        }
        try {
            setLoading(true);
            await axios.post("/api/save-live", { transcription: liveTranscription }, { withCredentials: true });
            setTranscription(liveTranscription);
            setLiveTranscription("");
            fetchHistory();
            toast.success("Live transcription saved successfully!");
        } catch (err: any) {
            console.error("Error saving live transcription:", err);
            toast.error(err.response?.data?.error || "Failed to save live transcription");
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            const res= await axios.post("/api/auth/logout", {}, { withCredentials: true });
            localStorage.removeItem('user');
            toast.success(res.data.message || "Logged out successfully");
            router.replace("/login");
        }
        catch(err: any) {
            console.error("Logout error:", err);
            toast.error(err.response?.data?.error || "Logout failed");
        }
    }

    return (
        <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white px-8 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-14">
                    <div>
                        <div className="flex text-center gap-3">
                            <AudioWaveform size={44} className="text-cyan-400" />
                            <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Speech To Text</h1>
                        </div>
                        <p className="mt-4 text-slate-400 text-lg">Upload audio or record voice and convert speech into text instantly</p>
                    </div>

                    <div className='flex items-center gap-3 bg-white/5 border border-cyan-500/20 px-5 py-3 rounded-2xl backdrop-blur-lg'>
                        <User size={20} className="text-cyan-400" />
                        <p className="text-slate-300">
                            Hello, <span className="font-semibold text-cyan-400 ml-2">{user?.name || ""}</span>
                        </p>
                    </div>

                    <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 hover:bg-red-500 transition px-5 py-3 rounded-2xl">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Top 2 Cards */}
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Upload Card */}
                    <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.08)]">
                        <h2 className="text-2xl font-semibold mb-6">Upload / Record</h2>
                        <div className="mb-6">
                            <label htmlFor="audio-upload" className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-3xl
                                bg-slate-950/50 cursor-pointer transition-all duration-300">

                                <Upload size={40} className="text-slate-500 mb-4" />

                                <p className="text-lg text-slate-300">Click to upload or drag & drop</p>
                                <p className="text-slate-500 text-sm mt-2">Audio files only</p>

                                {
                                    audioFile &&
                                        <div className="mt-5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                            <span className="text-cyan-300">
                                            {audioFile.name}
                                            </span>
                                        </div>
                                }
                            </label>
                            <input id="audio-upload" type="file" accept="audio/*" hidden onChange={(e) => {setError(""); setAudioFile(e.target.files ? e.target.files[0] : null);}} />
                            {/* Supported Formats */}
                            <div className="mt-3 text-center">
                                <p className="text-sm text-slate-400">
                                    Supported formats: <span className="text-cyan-400 ml-1">MP3, WAV, WEBM, M4A</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Maximum file size: 25 MB</p>
                            </div>
                        </div>
                        {
                            audioFile && (
                                <p className="text-sm text-cyan-300 mt-3">Selected file: {audioFile.name}</p>
                            )
                        }

                        {
                            error &&
                                <div className="text-red-400 mt-3">
                                    {error}
                                </div>
                        }

                        <button onClick={handleUpload} disabled={loading} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 font-semibold flex justify-center items-center gap-3">
                        {
                            loading ?
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Transcribing...</span>
                            </>
                            :
                            <>
                                <Upload size={20} />
                                <span>Upload Audio</span>
                            </>
                        }
                        </button>
                        {
                            !isListening ?
                                <button onClick={startRecording} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 flex justify-center items-center gap-2">
                                    <Mic size={20} />
                                    <span>Start Recording</span>
                                </button>
                                :
                                <button onClick={stopRecording} className="w-full mt-4 py-3 rounded-xl bg-linear-to-r from-red-500 to-pink-600 animate-pulse">
                                    Stop Recording
                                </button>
                        }
                        
                    </div>

                    {/* Latest Transcript */}
                    <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-[0_0_30px_rgba(255,0,255,0.08)]">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-semibold">Latest Transcription</h2>
                            {
                                isListening ? (
                                    <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 animate-pulse">
                                        Live Recording
                                    </span>
                                ) : (
                                    liveTranscription && (
                                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-500/20 text-green-400">
                                            Ready To Save
                                        </span>
                                    )
                                )
                            }
                        </div>
                        <div className="bg-slate-900 mb-4 rounded-2xl p-6 h-80 border border-slate-800 overflow-y-auto">
                            {
                                loading ?
                                    <div className="space-y-4">
                                        <div className="h-4 bg-slate-700 rounded animate-pulse" />
                                        <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
                                        <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse" />
                                    </div>
                                    :
                                    <p className="text-slate-200 leading-8">{liveTranscription || transcription || "No transcription available"}</p>
                            }
                        </div>
                        {
                            liveTranscription && !isListening && (
                                <button onClick={handleSaveLiveTranscription} className="bg-linear-to-r from-purple-500 to-pink-500 px-5 py-2.5 rounded-xl font-medium hover-scale-105 transition">
                                    Save Live Transcription to History
                                </button>             
                            )
                        }
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-12 bg-white/8 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20">
                    <div className="flex items-center gap-3 mb-8">
                        <History className="text-cyan-400" />
                        <h2 className="text-3xl font-bold">Transcription History</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 max-h-125 overflow-y-auto pr-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {
                            history.length > 0 ?
                                history.map((item:any)=>(
                                    <div key={item._id} className="bg-slate-900/80 rounded-2xl border border-slate-700 p-5 hover:border-cyan-500 transition">
                                        <div className= "flex justify-between items-center mb-3">
                                            <span className={`text-xs px-3 py-1 rounded-full ${item.source === 'live' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                                                {
                                                    item.source === 'live' ? (
                                                        <span className="flex items-center gap-1">
                                                            <Mic className="w-4 h-4" />
                                                            Live
                                                        </span>
                                                        ) : (
                                                        <span className="flex items-center gap-1">
                                                            <Upload className="w-4 h-4" />
                                                            Uploaded
                                                        </span>
                                                    )
                                                }
                                            </span>
                                        </div>
                                        {/* {
                                            loading && (
                                                <p className="text-cyan-400 text-sm mb-4">Analyzing audio using AI...</p>
                                            )
                                        } */}
                                        <p className="text-slate-200">{item.transcription}</p>
                                        <div className="text-sm text-slate-400 mt-3">{item.filename}</div>
                                        <div className="text-xs text-slate-500 mt-1">
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

export default Dashboard;