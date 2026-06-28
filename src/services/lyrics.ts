import { LyricLine } from '../state/lyricsStore';

export const lyricsService = {

    parseLRC: (lrcText: string): LyricLine[] => {
        const rawLines = lrcText.split('\n');
        const parsedLines: LyricLine[] = [];

        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

        rawLines.forEach((line) => {
            const match = line.match(timeRegex);

            if(match){
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = parseInt(match[3], 10);

                const msMultiplier = match[3].length === 2?10:1;

                const timeInSeconds = (minutes * 60) + seconds + (milliseconds * msMultiplier / 1000);
                const text = line.replace(timeRegex, '').trim();

                if (text){
                    parsedLines.push({ time: timeInSeconds, text });
                }
            }
        })
        return parsedLines;
    }
}

