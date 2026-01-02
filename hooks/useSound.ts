'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audio.store';

export function useSound(url: string, options: { volume?: number; loop?: boolean } = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted, masterVolume } = useAudioStore();

  useEffect(() => {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.loop = options.loop || false;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [url, options.loop]);

  useEffect(() => {
    if (audioRef.current) {
      const vol = (options.volume ?? 1) * masterVolume;
      audioRef.current.volume = isMuted ? 0 : Math.max(0, Math.min(1, vol));
    }
  }, [options.volume, masterVolume, isMuted]);

  const play = useCallback(() => {
    if (audioRef.current) {
      if (!options.loop) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play().catch(_error => {});
    }
  }, [options.loop]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, pause, stop };
}
