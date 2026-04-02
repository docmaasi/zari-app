/**
 * Speech-to-text using Web Speech Recognition API.
 * Returns transcript text from microphone input.
 */

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
      isFinal: boolean;
    };
    length: number;
  };
}

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

let recognition: SpeechRecognitionInstance | null = null;

export function isVoiceInputSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  );
}

export function startListening(
  lang: string = "en-US",
  onResult: (text: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError?: (error: string) => void
): void {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Speech recognition not supported");
    return;
  }

  stopListening();

  recognition = new (SpeechRecognition as new () => SpeechRecognitionInstance)();
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let transcript = "";
    let isFinal = false;
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) isFinal = true;
    }
    onResult(transcript, isFinal);
  };

  recognition.onerror = (event) => {
    onError?.(event.error);
    onEnd();
  };

  recognition.onend = () => {
    onEnd();
  };

  recognition.start();
}

export function stopListening(): void {
  if (recognition) {
    try {
      recognition.abort();
    } catch {
      // ignore
    }
    recognition = null;
  }
}
