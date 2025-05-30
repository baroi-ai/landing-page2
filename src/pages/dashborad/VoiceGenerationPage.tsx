// src/pages/dashboard/VoiceGenerationPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Mic,
  AlertCircle,
  Loader2,
  Download,
  Settings2,
  LinkIcon,
  Gauge,
  TrendingUp,
  Sparkles,
  User as UserIconLucide,
  Smile as WomanIconLucide,
  // AudioLines, // Ensure this is removed if you don't want the top placeholder
} from "lucide-react";

// --- Configuration Data (Assumed unchanged) ---
interface TtsVoice {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  engineId: string;
}
const availableTtsVoices: TtsVoice[] = [
  {
    id: "Wise_Woman",
    name: "Wise Woman",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Friendly_Person",
    name: "Friendly Person",
    gender: "neutral",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Inspirational_girl",
    name: "Inspirational Girl",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Deep_Voice_Man",
    name: "Deep Voice Man",
    gender: "male",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Calm_Woman",
    name: "Calm Woman",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Casual_Guy",
    name: "Casual Guy",
    gender: "male",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Lively_Girl",
    name: "Lively Girl",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Patient_Man",
    name: "Patient Man",
    gender: "male",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Young_Knight",
    name: "Young Knight",
    gender: "male",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Determined_Man",
    name: "Determined Man",
    gender: "male",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Lovely_Girl",
    name: "Lovely Girl",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Decent_Boy",
    name: "Decent Boy",
    gender: "male",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Imposing_Manner",
    name: "Imposing Manner",
    gender: "neutral",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Elegant_Man",
    name: "Elegant Man",
    gender: "male",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Abbess",
    name: "Abbess",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Sweet_Girl_2",
    name: "Sweet Girl 2",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
  {
    id: "Exuberant_Girl",
    name: "Exuberant Girl",
    gender: "female",
    engineId: "minimax/speech-02-hd",
  },
];
const userClonedVoices = [
  { id: "clone-user-123-alpha", name: "My Main Clone" },
  { id: "clone-user-123-beta", name: "Project Voice" },
];
const defaultVoiceSettings = {
  generationMode: "tts" as "tts" | "clone",
  textInput: "",
  selectedTtsVoice:
    availableTtsVoices.length > 0 ? availableTtsVoices[0].id : "",
  selectedClonedVoice:
    userClonedVoices.length > 0 ? userClonedVoices[0].id : "",
  speechRate: [1.0],
  pitch: [0],
};
// --- End Configuration Data ---

const VoiceGenerationPage = () => {
  const [generationMode, setGenerationMode] = useState<"tts" | "clone">(
    defaultVoiceSettings.generationMode
  );
  const [textInput, setTextInput] = useState(defaultVoiceSettings.textInput);
  const [selectedTtsVoice, setSelectedTtsVoice] = useState(
    defaultVoiceSettings.selectedTtsVoice
  );
  const [selectedClonedVoice, setSelectedClonedVoice] = useState(
    defaultVoiceSettings.selectedClonedVoice
  );
  const [speechRate, setSpeechRate] = useState<number[]>(
    defaultVoiceSettings.speechRate
  );
  const [pitch, setPitch] = useState<number[]>(defaultVoiceSettings.pitch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(
    null
  );

  const currentRate = useMemo(() => speechRate[0] ?? 1.0, [speechRate]);
  const currentPitch = useMemo(() => pitch[0] ?? 0.0, [pitch]);

  const calculateCost = useCallback(() => {
    const charCount = textInput.trim().length;
    if (charCount === 0) return 0;
    let costPerChar = 0.05;
    if (generationMode === "clone") {
      costPerChar = 0.15;
    }
    return Math.max(1, Math.round(charCount * costPerChar));
  }, [textInput, generationMode]);

  const estimatedCost = calculateCost();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedAudioUrl(null);
    const trimmedText = textInput.trim();
    if (!trimmedText) {
      setError("Please enter some text to generate speech.");
      setIsLoading(false);
      return;
    }
    if (generationMode === "clone" && !selectedClonedVoice) {
      setError("Please select a cloned voice or create one first.");
      setIsLoading(false);
      return;
    }

    let backendUrl = "";
    const payload: any = {
      text: trimmedText,
      rate: currentRate,
      pitch: currentPitch,
    };

    if (generationMode === "tts") {
      const currentTtsVoiceDetails = availableTtsVoices.find(
        (v) => v.id === selectedTtsVoice
      );
      if (!currentTtsVoiceDetails) {
        setError("Selected TTS voice not found or configured incorrectly.");
        setIsLoading(false);
        return;
      }
      const engineRouteSegment = currentTtsVoiceDetails.engineId.replace(
        /^\/|\/$/g,
        ""
      );
      backendUrl = `http://127.0.0.1:8000/api/speech/generate/${engineRouteSegment}/`;
      payload.voiceId = selectedTtsVoice;
      if (currentTtsVoiceDetails.engineId === "minimax/speech-02-hd") {
        payload.volume = 1.0;
        payload.bitrate = 128000;
        payload.channel = "mono";
        payload.emotion = "neutral";
        payload.sample_rate = 32000;
        payload.language_boost = "English";
        payload.english_normalization = true;
      }
    } else {
      backendUrl = `http://127.0.0.1:8000/api/speech/generate/clone/`; // Placeholder
      payload.voiceId = selectedClonedVoice;
    }

    console.log(
      "Generating speech with payload:",
      payload,
      "to URL:",
      backendUrl
    );

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Failed to parse error." }));
        throw new Error(
          errData.error ||
            errData.detail ||
            `Request failed: ${response.status}`
        );
      }
      const data = await response.json();
      if (data.audio_url && typeof data.audio_url === "string") {
        setGeneratedAudioUrl(data.audio_url);
      } else {
        throw new Error("Invalid audio data format from server.");
      }
    } catch (err: any) {
      console.error("Speech generation failed:", err);
      setError(
        err.message || "An unknown error occurred during speech generation."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [
    textInput,
    generationMode,
    selectedTtsVoice,
    selectedClonedVoice,
    speechRate,
    pitch,
    error,
  ]);

  const canGenerate = useMemo(() => {
    const hasText = textInput.trim().length > 0;
    const hasValidCloneSelection =
      generationMode === "tts" ||
      (generationMode === "clone" && !!selectedClonedVoice);
    return hasText && hasValidCloneSelection && !isLoading;
  }, [textInput, generationMode, selectedClonedVoice, isLoading]);

  const renderGenderIcon = (gender: "male" | "female" | "neutral") => {
    switch (gender) {
      case "male":
        return <UserIconLucide className="w-3.5 h-3.5 text-blue-400" />;
      case "female":
        return <WomanIconLucide className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Mic className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full text-gray-300">
        {/* --- Top Area: Large Text Input & Generate Button --- */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-4xl mx-auto">
            <Textarea
              id="text-input"
              placeholder="Enter text to synthesize..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={8}
              className="w-full bg-transparent border border-gray-700 focus:border-cyan-500 focus:ring-0 rounded-lg resize-y text-base text-gray-200 placeholder-gray-500 pl-4 pr-12 md:pr-36 py-3 min-h-[200px] md:min-h-[250px]"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3 flex flex-col space-y-2 items-end">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`h-9 px-3 rounded-full flex items-center justify-center gap-1.5 text-white text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 flex-shrink-0 ${
                  !canGenerate
                    ? "bg-gray-600 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-br from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-600 shadow-lg"
                }`}
                aria-label="Generate Speech"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-medium whitespace-nowrap hidden sm:inline">
                      {estimatedCost > 0
                        ? `${estimatedCost} Credits`
                        : "Generate"}
                    </span>
                    <span className="text-xs font-medium whitespace-nowrap sm:hidden">
                      Generate
                    </span>
                  </>
                )}
              </Button>
              <div className="text-xs text-gray-500 pr-1">
                {textInput.trim().length} / 5000 chars
              </div>
            </div>
          </div>

          {/* Conditional Loading/Error Overlay - Only if no audio is present yet */}
          {isLoading && !generatedAudioUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/30 backdrop-blur-sm z-10">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mb-3" />
              <span>Synthesizing audio...</span>
            </div>
          )}
          {error && !generatedAudioUrl && (
            <div className="mt-4 w-full max-w-3xl">
              {" "}
              {/* Changed from absolute to flow with content if textarea is smaller */}
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-700 text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Generating Speech</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* --- Middle Area: Controls (Settings Bar ONLY) --- */}
        <div className="w-full px-4 py-3 border-t border-b border-gray-800">
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs max-w-4xl mx-auto">
            <RadioGroup
              value={generationMode}
              className="flex space-x-3 items-center"
              onValueChange={(value) =>
                setGenerationMode(value as "tts" | "clone")
              }
              aria-label="Generation Mode"
            >
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem
                  value="tts"
                  id="mode-tts"
                  className="h-3 w-3 border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="mode-tts"
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  <Mic className="h-3.5 w-3.5" /> TTS
                </Label>
              </div>
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem
                  value="clone"
                  id="mode-clone"
                  className="h-3 w-3 border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="mode-clone"
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  <UserIconLucide className="h-3.5 w-3.5" /> Clone
                </Label>
              </div>
            </RadioGroup>

            {generationMode === "tts" && (
              <div className="flex items-center gap-1 sm:gap-2">
                {" "}
                <Select
                  value={selectedTtsVoice}
                  onValueChange={setSelectedTtsVoice}
                  disabled={isLoading}
                >
                  {" "}
                  <SelectTrigger className="bg-transparent border-none text-gray-400 hover:text-gray-200 focus:ring-0 p-0 h-auto text-xs pr-2 min-w-[180px]">
                    {" "}
                    <div className="flex items-center gap-1.5">
                      {" "}
                      {renderGenderIcon(
                        availableTtsVoices.find(
                          (v) => v.id === selectedTtsVoice
                        )?.gender ?? "neutral"
                      )}{" "}
                      <SelectValue placeholder="Select TTS voice" />{" "}
                    </div>{" "}
                  </SelectTrigger>{" "}
                  <SelectContent
                    position="popper"
                    side="top"
                    align="center"
                    className="bg-gray-800 border-gray-700 text-gray-300 max-h-60 overflow-y-auto"
                  >
                    {" "}
                    {availableTtsVoices.map((voice) => (
                      <SelectItem
                        key={voice.id}
                        value={voice.id}
                        className="focus:bg-gray-700 text-xs"
                      >
                        {" "}
                        <div className="flex items-center gap-2">
                          {" "}
                          {renderGenderIcon(voice.gender)}{" "}
                          <span>{voice.name}</span>{" "}
                        </div>{" "}
                      </SelectItem>
                    ))}{" "}
                  </SelectContent>{" "}
                </Select>{" "}
              </div>
            )}
            {generationMode === "clone" && (
              <div className="flex items-center gap-1 sm:gap-2">
                {" "}
                <Select
                  value={selectedClonedVoice}
                  onValueChange={setSelectedClonedVoice}
                  disabled={isLoading || userClonedVoices.length === 0}
                >
                  {" "}
                  <SelectTrigger className="bg-transparent border-none text-gray-400 hover:text-gray-200 focus:ring-0 p-0 h-auto text-xs pr-2 disabled:opacity-50 min-w-[150px]">
                    {" "}
                    <div className="flex items-center gap-1.5">
                      {" "}
                      <UserIconLucide className="w-3.5 h-3.5 text-gray-500" />{" "}
                      <SelectValue
                        placeholder={
                          userClonedVoices.length === 0
                            ? "No clones"
                            : "Select clone"
                        }
                      />{" "}
                    </div>{" "}
                  </SelectTrigger>{" "}
                  <SelectContent
                    position="popper"
                    side="top"
                    align="center"
                    className="bg-gray-800 border-gray-700 text-gray-300 max-h-48"
                  >
                    {" "}
                    {userClonedVoices.map((voice) => (
                      <SelectItem
                        key={voice.id}
                        value={voice.id}
                        className="focus:bg-gray-700 text-xs"
                      >
                        {voice.name}
                      </SelectItem>
                    ))}{" "}
                  </SelectContent>{" "}
                </Select>{" "}
                <Button
                  variant="link"
                  size="sm"
                  className="text-cyan-500 hover:text-cyan-400 h-auto p-0 text-xs"
                  disabled={isLoading}
                >
                  <LinkIcon className="h-3 w-3 mr-0.5" /> Manage
                </Button>{" "}
              </div>
            )}
            <div className="flex items-center gap-2 min-w-[130px]">
              {" "}
              <Gauge className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />{" "}
              <Slider
                id="speech-rate"
                min={0.5}
                max={2.0}
                step={0.1}
                value={speechRate}
                onValueChange={setSpeechRate}
                disabled={isLoading}
                className="[&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-cyan-500 [&>span]:bg-gray-700 [&_button]:h-3 [&_button]:w-3 [&_button]:border-cyan-500 [&_button]:bg-gray-950 [&_button:focus-visible]:ring-cyan-500 [&_button:focus-visible]:ring-offset-gray-950"
              />{" "}
              <span className="text-gray-400 w-8 text-right tabular-nums">
                {currentRate.toFixed(1)}x
              </span>{" "}
            </div>
            <div className="flex items-center gap-2 min-w-[130px]">
              {" "}
              <TrendingUp className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />{" "}
              <Slider
                id="speech-pitch"
                min={-10}
                max={10}
                step={0.5}
                value={pitch}
                onValueChange={setPitch}
                disabled={isLoading}
                className="[&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-cyan-500 [&>span]:bg-gray-700 [&_button]:h-3 [&_button]:w-3 [&_button]:border-cyan-500 [&_button]:bg-gray-950 [&_button:focus-visible]:ring-cyan-500 [&_button:focus-visible]:ring-offset-gray-950"
              />{" "}
              <span className="text-gray-400 w-9 text-right tabular-nums">
                {currentPitch > 0 ? "+" : ""}
                {currentPitch.toFixed(1)}
              </span>{" "}
            </div>
          </div>
        </div>

        {/* --- Bottom Area: Audio Output --- */}
        <div className="flex-shrink-0 w-full px-4 pt-4 pb-6">
          {isLoading &&
            generatedAudioUrl && ( // Show loader here if audio was present but now reloading/updating
              <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-500 mb-2" />
                <span className="text-sm text-gray-400">Updating audio...</span>
              </div>
            )}
          {/* Show player only if NOT loading AND audio URL exists */}
          {!isLoading && generatedAudioUrl && (
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
              <audio
                key={generatedAudioUrl}
                controls
                className="w-full rounded-lg"
                preload="metadata"
              >
                <source src={generatedAudioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                asChild
              >
                <a
                  href={generatedAudioUrl}
                  download={`generated_speech_${Date.now()}.mp3`}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Audio
                </a>
              </Button>
            </div>
          )}
          {/* Show error here if an error occurred AND there was a previously generated audio URL */}
          {/* This avoids showing duplicate errors if the initial generation failed (covered by top error display) */}
          {error && generatedAudioUrl && (
            <div className="w-full max-w-3xl mx-auto mt-4">
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-700 text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Generating Speech</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VoiceGenerationPage;
