import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useUserSets } from "@/hooks/useUserSet";
import { AiService } from "@/services/ai.service";
import { useAuthStore } from "@/store/auth.store";
import { useSetStore } from "@/store/set.store";
import {
  Smile,
  AlignStartHorizontal,
  GraduationCap,
  MessageCircle,
  Lightbulb,
  Sparkles,
  MousePointerClick,
  BookOpenText,
  Copy,
  Check,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AiStoryPage() {
  const styles = [
    { name: "Funny", icon: Smile },
    { name: "Academic", icon: GraduationCap },
    { name: "Dialogue", icon: MessageCircle },
    { name: "Creative", icon: Lightbulb },
  ];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [story, setStory] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { loading } = useUserSets(user?.id, 1);
  const setList = useSetStore((s) => s.sets);
  const [selectedSetId, setSelectedSetId] = useState<string | undefined>();
  const [storyLength, setStoryLength] = useState(150);
  const [selectedStyle, setSelectedStyle] = useState("Funny");
  const handleGenerateStory = async () => {
    if (!selectedSetId) {
      toast.error("Please select a flashcard set");
      return;
    }

    try {
      setIsGenerating(true);

      const res = await AiService.generateStory(selectedSetId, {
        storyLength: storyLength,
        style: selectedStyle,
      });

      setStory(res.data.story);
      toast.success("Story generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate story");
    } finally {
      setIsGenerating(false);
    }
  };
  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const formatStory = (text: string) => {
    return text
      .replace(
        /(^|\n)([A-Z][a-zA-Z]+:)/g,
        `<br/><strong class="text-black">$2</strong>`
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        `<span class="font-bold text-primary">$1</span>`
      )
      .replace(/\n/g, "<br/>")
      .replace(/^<br\/>/, "");
  };

  const toggleSpeakStory = (text: string) => {
    if (!text) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText(text));

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };
  const handleCopyStory = async (text: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(cleanText(text));

      setCopied(true);
      toast.success("Copied!");

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      toast.error("Failed to copy story");
    }
  };

  return (
    <div className="px-4">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        Practice in Context
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <p>Transform dry lists into vibrant stories</p>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-primary">
          <Lightbulb size={18} />
          <p>Tip! Try a funny style</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 rounded-lg bg-white p-5 shadow lg:col-span-1">
          <div>
            <h2 className="mb-2 block font-medium flex items-center gap-2">
              <MousePointerClick size={18} />
              Select Flashcard
            </h2>
            <Select
              value={selectedSetId}
              onValueChange={(value) => setSelectedSetId(value)}
            >
              <SelectTrigger className="w-full bg-primary text-white [&>svg]:text-white">
                <SelectValue
                  placeholder={
                    <span className="text-white/80">Select flashcard</span>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {setList && setList.length > 0 ? (
                  setList.map((set) => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {loading ? "Loading..." : "No flashcard sets found"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="mb-3 font-medium flex items-center gap-2">
              <AlignStartHorizontal size={18} />
              Paragraph Settings
            </h2>

            <div className="mb-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Length</span>
                <span className="text-primary">
                  {storyLength < 100
                    ? "Short"
                    : storyLength < 220
                    ? "Medium"
                    : "Long"}{" "}
                  ~{storyLength} words
                </span>
              </div>

              <Slider
                value={[storyLength]}
                max={300}
                min={50}
                step={1}
                onValueChange={(value) => setStoryLength(value[0])}
              />

              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Short</span>
                <span>Medium</span>
                <span>Long</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Style & Tone</p>
              <div className="grid grid-cols-2 gap-2">
                {styles.map(({ name, icon: Icon }) => {
                  const isActive = selectedStyle === name;

                  return (
                    <Button
                      key={name}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStyle(name)}
                      className={`
          flex items-center justify-center gap-1 cursor-pointer transition-colors
          ${
            isActive
              ? "bg-primary text-white border-primary hover:bg-primary/90"
              : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
          }
        `}
                    >
                      <Icon size={14} />
                      {name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateStory}
            disabled={isGenerating}
            className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 flex items-center justify-center cursor-pointer gap-2 disabled:opacity-60"
          >
            <Sparkles size={20} />
            {isGenerating ? "Generating..." : "Create Story"}
          </button>
        </div>

        <div className="rounded-lg bg-white p-5 shadow lg:col-span-2">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="mb-1 font-medium flex items-center gap-2 text-gray-900">
                <BookOpenText className="w-5 h-5" />
                Result
              </h2>
              <p className="text-sm text-gray-500">Generated by AI</p>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <button
                disabled={!story}
                onClick={() => handleCopyStory(story)}
                className="disabled:opacity-50 disabled:cursor-not-allowed group p-2 hover:bg-primary cursor-pointer rounded-full transition-colors"
              >
                {copied ? (
                  <Check size={18} className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy
                    size={18}
                    className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors"
                  />
                )}
              </button>

              <button
                onClick={() => toggleSpeakStory(story)}
                className={`group p-2 cursor-pointer rounded-full transition-colors
    ${isSpeaking ? "bg-primary" : "hover:bg-primary"}
  `}
              >
                <Volume2
                  size={18}
                  className={`w-5 h-5 transition-colors
      ${isSpeaking ? "text-white" : "text-gray-700 group-hover:text-white"}
    `}
                />
              </button>
            </div>
          </div>

          <div className="mt-3 max-h-[300px] overflow-y-auto rounded-md border border-gray-200 p-4 text-sm leading-relaxed">
            {story ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: formatStory(story),
                }}
              />
            ) : (
              <p className="italic text-gray-400">
                Your generated story will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
