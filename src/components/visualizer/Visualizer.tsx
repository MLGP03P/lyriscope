import { useEffect, useRef } from "react";
import { audioService } from "../../services/audio";
import { usePlayerStore } from "../../state/playerStore";

export function Visualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isPlaying = usePlayerStore((state) => state.isPlaying);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const dataArray = new Uint8Array(1024);

        const renderFrame = () => {
            audioService.getAnalyserData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //here i will add the drawing logic

            animationFrameId = requestAnimationFrame(renderFrame);
        };

        if (isPlaying) {
            renderFrame();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying]);

    return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
}