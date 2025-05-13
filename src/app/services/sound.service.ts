import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private context: AudioContext = new AudioContext();

  playSound(index: number): void {
    const freqs = [261.63, 329.63, 392.0, 523.25];
    const osc = this.context.createOscillator();
    osc.frequency.value = freqs[index];
    osc.type = 'sine';

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.1, this.context.currentTime);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.4);
  }
}
