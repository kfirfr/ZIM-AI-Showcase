"use client";

import React, { useState } from 'react';
import { Play } from 'lucide-react';

export const TranslationBox = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="relative w-full h-full min-h-[320px] bg-slate-950/50 flex flex-col group">
            {!isPlaying && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="group relative flex items-center gap-3 px-6 py-3 bg-gen-orange/10 hover:bg-gen-orange/20 border border-gen-orange/50 rounded-full transition-all hover:scale-105"
                    >
                        <div className="w-8 h-8 rounded-full bg-gen-orange flex items-center justify-center text-black">
                            <Play size={14} fill="currentColor" />
                        </div>
                        <span className="text-gen-orange font-bold text-sm tracking-wide">TRANSLATE LIVE</span>
                    </button>
                </div>
            )}

            <div className="flex-1 p-0 relative overflow-hidden flex flex-col">
                <div className="bg-[#1e293b]/50 p-2 flex justify-between items-center border-b border-white/5 z-20">
                    <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500/50"></div><div className="w-2 h-2 rounded-full bg-yellow-500/50"></div><div className="w-2 h-2 rounded-full bg-green-500/50"></div></div>
                    <div className="text-[9px] text-slate-400 font-mono">Input: THAI (Auto-Detect)</div>
                </div>
                <div className="flex-1 p-6 relative">
                    <div className="space-y-4 opacity-50 blur-[0.5px]">
                        <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-orange-500/20 text-[9px] flex items-center justify-center text-orange-400 font-bold">C</div><div className="bg-[#1e293b] p-3 rounded-xl rounded-tl-none text-xs text-slate-300">สวัสดีครับ ผมต้องการตรวจสอบสถานะตู้สินค้า ZIMU882</div></div>
                        <div className="flex gap-3 flex-row-reverse"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-[9px] flex items-center justify-center text-blue-400 font-bold">A</div><div className="bg-blue-600 p-3 rounded-xl rounded-tr-none text-xs text-white">ได้เลยครับ ขอเวลาตรวจสอบสักครู่ครับ</div></div>
                        <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-orange-500/20 text-[9px] flex items-center justify-center text-orange-400 font-bold">C</div><div className="bg-[#1e293b] p-3 rounded-xl rounded-tl-none text-xs text-slate-300">มันล่าช้ามาก ผมกังวลเรื่องค่าใช้จ่าย</div></div>
                        <div className="flex gap-3 flex-row-reverse"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-[9px] flex items-center justify-center text-blue-400 font-bold">A</div><div className="bg-blue-600 p-3 rounded-xl rounded-tr-none text-xs text-white">ส่งเอกสารให้แล้วครับ</div></div>
                    </div>

                    <div className="absolute inset-0 p-6 space-y-4 bg-[#020617] z-10 transition-all duration-0" style={{ clipPath: isPlaying ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', animation: isPlaying ? 'reveal-mask 3s linear forwards' : 'none' }}>
                        <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-orange-500/20 text-[9px] flex items-center justify-center text-orange-400 font-bold">C</div><div className="bg-[#1e293b] p-3 rounded-xl rounded-tl-none text-xs text-white border border-orange-500/50"><strong>[EN]</strong> Hello, checking status of ZIMU882.</div></div>
                        <div className="flex gap-3 flex-row-reverse"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-[9px] flex items-center justify-center text-blue-400 font-bold">A</div><div className="bg-blue-600 p-3 rounded-xl rounded-tr-none text-xs text-white"><strong>[EN]</strong> Certainly. One moment please.</div></div>
                        <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-orange-500/20 text-[9px] flex items-center justify-center text-orange-400 font-bold">C</div><div className="bg-[#1e293b] p-3 rounded-xl rounded-tl-none text-xs text-white border border-orange-500/50"><strong>[EN]</strong> It is late. Worried about costs.</div></div>
                        <div className="flex gap-3 flex-row-reverse"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-[9px] flex items-center justify-center text-blue-400 font-bold">A</div><div className="bg-blue-600 p-3 rounded-xl rounded-tr-none text-xs text-white"><strong>[EN]</strong> Documents have been sent.</div></div>
                    </div>
                    {isPlaying && <div className="absolute top-0 bottom-0 w-2 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-20 animate-scan-sweep" style={{ left: '0%', animationDuration: '3s', animationFillMode: 'forwards' }}></div>}
                </div>
            </div>
        </div>
    );
};
