import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Import necessary Lucide icons
import {
  Send,
  Loader2,
  User,
  Bot,
  AlertCircle,
  Sparkles,
  Search,
  Paperclip,
  BrainCircuit,
  X,
  Copy,
  Check,
  MessageSquare,
  ClipboardCopy, // Using a slightly different icon for clarity, or stick with Copy
} from "lucide-react";

// --- NEW Imports for Markdown and Syntax Highlighting ---
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Or your preferred theme
// --- End NEW Imports ---

// --- Configuration Data ---
const availableChatModels = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    iconPath: "/gemma.svg",
  },
  {
    id: "gemini-2.5-pro-exp-03-25",
    name: "Gemini 2.5 Pro Exp",
    iconPath: "/gemma.svg",
  },
  {
    id: "gemini-2.0-flash-exp-image-generation",
    name: "Gemini 2.0 Flash Img Gen Exp",
    iconPath: "/gemma.svg",
  },
  {
    id: "gemini-2.0-flash-thinking-exp",
    name: "Gemini 2.0 Flash Thinking Exp",
    iconPath: "/gemma.svg",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    iconPath: "/gemma.svg",
  },
];
const defaultSettings = {
  model: availableChatModels[0].id,
  webSearch: false,
};
// --- End Configuration Data ---

// --- API Endpoint ---
const API_BASE_URL = "http://127.0.0.1:8000"; // Ensure this is correct
const CHAT_API_ENDPOINT = `${API_BASE_URL}/api/chat/gemini/`;
// --- End API Endpoint ---

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ChatPage = () => {
  // --- State Variables ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(
    defaultSettings.model
  );
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState<boolean>(
    defaultSettings.webSearch
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Removed copiedMessageIndex as we will handle copy state locally per block
  // const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize finding the current model object
  const currentModel = useMemo(
    () =>
      availableChatModels.find((m) => m.id === selectedModel) ||
      availableChatModels[0],
    [selectedModel]
  );

  // --- Effects ---
  useEffect(() => {
    const scrollAreaElement = scrollAreaRef.current;
    const viewport = scrollAreaElement?.querySelector<HTMLDivElement>(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 10); // Small delay to allow rendering
    } else if (scrollAreaElement) {
      setTimeout(() => {
        scrollAreaElement.scrollTop = scrollAreaElement.scrollHeight;
      }, 10);
    }
  }, [messages, isLoading]);

  // --- Handlers ---
  const handleModelChange = useCallback((value: string) => {
    setSelectedModel(value);
  }, []);

  const handleWebSearchToggle = useCallback((checked: boolean) => {
    setIsWebSearchEnabled(checked);
  }, []);

  const handleReasoningClick = useCallback(() => {
    alert("Reasoning feature not yet implemented.");
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        if (event.target) {
          event.target.value = ""; // Allow re-selecting the same file
        }
        console.log("File selected:", file.name);
      }
    },
    []
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    console.log("Selected file removed");
  }, []);

  // Removed handleCopy for the whole message, as it's replaced by per-block copy
  // const handleCopy = useCallback((textToCopy: string, index: number) => { ... }, []);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = currentInput.trim();
    if (!trimmedInput || isLoading) {
      if (!trimmedInput) {
        console.log("Skipping send: Text input is required.");
      }
      return;
    }

    const newUserMessage: ChatMessage = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, newUserMessage]);

    const textToSend = trimmedInput;
    setCurrentInput("");
    setSelectedFile(null); // Clear file indicator after sending
    setIsLoading(true);
    setError(null);
    // setCopiedMessageIndex(null); // No longer needed

    const payload = {
      text: textToSend,
      model: selectedModel,
      // You might want to include web search status or file info here if the backend needs it
      // web_search: isWebSearchEnabled,
      // file: selectedFile ? ... : null // Need to decide how to send file content/info
    };

    console.log("Sending Payload to backend:", CHAT_API_ENDPOINT, payload);

    try {
      // --- NOTE: If sending files, use FormData instead of JSON ---
      // let body: BodyInit;
      // let headers: HeadersInit = {};
      // if (selectedFile) {
      //   const formData = new FormData();
      //   formData.append('text', textToSend);
      //   formData.append('model', selectedModel);
      //   formData.append('file', selectedFile, selectedFile.name);
      //   // Add other fields if needed
      //   body = formData;
      //   // Don't set 'Content-Type': 'multipart/form-data', browser does it with boundary
      // } else {
      //   body = JSON.stringify(payload);
      //   headers['Content-Type'] = 'application/json';
      // }
      // const response = await fetch(CHAT_API_ENDPOINT, {
      //   method: 'POST',
      //   headers: headers,
      //   body: body,
      // });
      // --- End File Sending Example ---

      // --- Using current simple text implementation ---
      const response = await fetch(CHAT_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // --- End simple text implementation ---

      const responseBodyText = await response.text();

      if (!response.ok) {
        console.error("API Error:", response.status, responseBodyText);
        // Try parsing as JSON for potentially structured errors from backend
        let errorMsg = `Request failed with status ${response.status}`;
        try {
          const errorJson = JSON.parse(responseBodyText);
          errorMsg = errorJson.detail || errorJson.error || responseBodyText;
        } catch (parseError) {
          // Ignore if it's not JSON
          errorMsg = responseBodyText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const assistantResponse: ChatMessage = {
        role: "assistant",
        content: responseBodyText.trim(), // Assume backend sends plain text for now
      };
      setMessages((prev) => [...prev, assistantResponse]);
    } catch (err: any) {
      console.error("Chat API request failed:", err);
      setError(
        err.message || "An error occurred while contacting the AI service."
      );
    } finally {
      setIsLoading(false);
      // Clear selected file reference *after* API call (if backend handles it)
      // setSelectedFile(null);
      // if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [
    currentInput,
    isLoading,
    selectedModel,
    selectedFile /*, isWebSearchEnabled */,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !isLoading) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage, isLoading]
  );

  // --- Custom Markdown Renderers ---
  const markdownComponents = useMemo(
    () => ({
      // Wrap in useMemo if components are complex
      // Target 'code' tags
      code({ node, inline, className, children, ...props }: any) {
        // --- NEW: State for this specific code block's copy button ---
        const [isCopied, setIsCopied] = useState(false);
        // --- End NEW ---

        const match = /language-(\w+)/.exec(className || "");
        const codeText = String(children).replace(/\n$/, ""); // Raw text content

        // --- NEW: Copy handler for this block ---
        const handleBlockCopy = () => {
          navigator.clipboard.writeText(codeText).then(
            () => {
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
            },
            (err) => {
              console.error("Failed to copy code block: ", err);
              // Optionally show an error state on the button or a global error
            }
          );
        };
        // --- End NEW ---

        return !inline ? (
          // --- MODIFIED: Wrap block code in a relative div ---
          <div className="code-block relative group my-2">
            {/* --- NEW: Add Copy Button --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-gray-700/80 hover:bg-gray-600/90 text-gray-300 hover:text-white rounded-md"
                  onClick={handleBlockCopy}
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <ClipboardCopy className="h-3.5 w-3.5" /> // Or use Copy icon
                  )}
                  <span className="sr-only">Copy code</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                <p>{isCopied ? "Copied!" : "Copy code"}</p>
              </TooltipContent>
            </Tooltip>
            {/* --- End NEW --- */}

            <SyntaxHighlighter
              // --- MODIFIED: Added padding-top to make space for button ---
              customStyle={{ paddingTop: "2rem" }} // Adjust as needed based on button size/position
              // --- End MODIFIED ---
              style={vscDarkPlus} // Your chosen theme
              language={match ? match[1] : undefined} // Handle case with/without language
              PreTag="div" // Use div instead of pre to avoid nesting issues
              className="rounded-md text-sm border border-gray-700/50 !bg-gray-900/70" // Added background
              {...props}
            >
              {codeText}
            </SyntaxHighlighter>
          </div>
        ) : (
          // --- End MODIFIED ---
          // Inline code - unchanged
          <code
            className="bg-gray-700/70 text-cyan-300 px-1 py-0.5 rounded text-sm font-mono mx-0.5"
            {...props}
          >
            {children}
          </code>
        );
      },
      // Optional: Style paragraphs if needed
      p({ children }: any) {
        // Check if the only child is a code block wrapper, if so, don't add margins
        const firstChild = React.Children.toArray(children)[0];
        if (
          (React.isValidElement(firstChild) &&
            typeof firstChild.type !== "string" && // Check if it's a component
            (firstChild.type as any).displayName?.includes(
              "SyntaxHighlighter"
            )) || // Direct child
          firstChild.props?.className?.includes("code-block") // Or our wrapper div
        ) {
          return <>{children}</>; // Render without <p> margins
        }
        return <p className="mb-2 last:mb-0">{children}</p>;
      },
      // Optional: Style lists, headers etc.
      ul({ children }: any) {
        return <ul className="list-disc list-inside mb-2 ml-4">{children}</ul>; // Added margin
      },
      ol({ children }: any) {
        return (
          <ol className="list-decimal list-inside mb-2 ml-4">{children}</ol>
        ); // Added margin
      },
      li({ children }: any) {
        return <li className="mb-1">{children}</li>;
      },
    }),
    []
  ); // Memoize the components object

  // --- End Custom Markdown Renderers ---

  // --- Render ---
  return (
    <DashboardLayout>
      <TooltipProvider delayDuration={100}>
        <div className="flex flex-col h-full text-gray-300">
          {/* Chat Display Area */}
          <ScrollArea
            className="flex-grow overflow-y-auto relative"
            ref={scrollAreaRef}
          >
            <div
              className={cn(
                "p-4 md:p-6 max-w-4xl mx-auto",
                messages.length === 0 && !isLoading && !error
                  ? "flex flex-col items-center justify-center min-h-full"
                  : "space-y-4" // Adjusted spacing
              )}
            >
              {/* Initial Placeholder */}
              {messages.length === 0 && !isLoading && !error && (
                <div className="text-center text-gray-600">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h2 className="text-xl font-semibold mb-2 text-gray-400">
                    Chat Assistant
                  </h2>
                  <p className="text-sm">
                    Select options below and start your conversation.
                  </p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="w-full max-w-3xl mx-auto my-4">
                  <Alert
                    variant="destructive"
                    className="bg-red-900/50 border-red-700 text-red-200"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Rendered Messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 max-w-[95%] md:max-w-[90%] w-fit", // Slightly wider max-width
                    message.role === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  {/* Assistant Icon */}
                  {message.role === "assistant" && (
                    <Bot className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1.5" />
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "rounded-lg px-3.5 py-2.5 text-sm md:text-base relative group/message", // Added group/message for potential outer controls
                      message.role === "user"
                        ? "bg-cyan-800/40 border border-cyan-700/50 text-gray-200"
                        : "bg-gray-800/70 border border-gray-700/80 text-gray-300"
                    )}
                  >
                    {/* --- MODIFIED: Apply prose styles wrapper --- */}
                    {/* Note: Prose styles might conflict slightly with syntax highlighter styles.
                        Adjust prose config or syntax highlighter theme if needed.
                        We apply prose styles here, and the code block renderer handles its own styling. */}
                    <div className="prose prose-sm prose-invert max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown components={markdownComponents}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {/* --- END MODIFIED --- */}

                    {/* Removed general copy button for the whole message
                      {message.role === "assistant" && message.content && (
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover/message:opacity-100 ...">
                              ...
                          </div>
                      )}
                    */}
                  </div>

                  {/* User Icon */}
                  {message.role === "user" && (
                    <User className="h-6 w-6 text-cyan-300 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start items-center gap-3 max-w-[90%] w-fit mr-auto">
                  <Bot className="h-6 w-6 text-blue-400 flex-shrink-0" />
                  <div className="rounded-lg px-3.5 py-2.5 bg-gray-800/70 border border-gray-700/80">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
                  </div>
                </div>
              )}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          {/* Controls Area */}
          <div className="w-full px-4 pb-4 pt-2">
            {" "}
            {/* Added bg */}
            {/* Settings Bar */}
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs max-w-4xl mx-auto mb-3">
              {/* Model Selector */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Select
                  value={selectedModel}
                  onValueChange={handleModelChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-transparent border-none text-gray-400 hover:text-gray-200 focus:ring-0 p-0 h-auto text-xs pr-2">
                    <div className="flex items-center gap-1.5">
                      {/* Optional: Show current model icon */}
                      {currentModel.iconPath && (
                        <img
                          src={currentModel.iconPath}
                          alt=""
                          className="w-3.5 h-3.5 object-contain"
                        />
                      )}
                      <SelectValue placeholder="Select model" />
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="top"
                    align="center"
                    className="bg-gray-800 border-gray-700 text-gray-300 max-h-60" // Added max-height
                  >
                    {availableChatModels.map((model) => (
                      <SelectItem
                        key={model.id}
                        value={model.id}
                        className="focus:bg-gray-700 text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {model.iconPath && (
                            <img
                              src={model.iconPath}
                              alt={`${model.name} logo`}
                              className="w-4 h-4 object-contain flex-shrink-0"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          )}
                          <span>{model.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Web Search Toggle */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Switch
                  id="web-search-toggle"
                  checked={isWebSearchEnabled}
                  onCheckedChange={handleWebSearchToggle}
                  disabled={isLoading}
                  className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-3 data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600"
                />
                <Label
                  htmlFor="web-search-toggle"
                  className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer hover:text-gray-200"
                >
                  {isWebSearchEnabled ? (
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                  ) : (
                    <Search className="h-3 w-3" />
                  )}
                  Web Search
                </Label>
              </div>
              {/* Reasoning Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReasoningClick}
                    disabled={isLoading}
                    className="h-6 w-6 text-gray-400 hover:text-gray-200 flex-shrink-0 p-0"
                    aria-label="Trigger Reasoning"
                  >
                    <BrainCircuit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="text-xs">
                  <p>Trigger Reasoning (Not implemented)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {/* Main Input Area */}
            <div className="w-full max-w-4xl mx-auto flex items-end gap-2">
              {/* File Upload Button */}
              <div className="flex-shrink-0 self-end mb-px">
                {!selectedFile ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleUploadClick}
                        disabled={isLoading}
                        className="h-9 w-9 text-gray-400 hover:text-cyan-400"
                        aria-label="Attach File"
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p>Attach File (Backend support needed)</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        disabled={isLoading}
                        className="h-9 w-9 text-cyan-500 hover:text-red-500 relative group/file"
                        aria-label={`Remove file ${selectedFile.name}`}
                      >
                        <Paperclip className="h-5 w-5 group-hover/file:opacity-0 transition-opacity" />
                        <X className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover/file:opacity-100 transition-opacity" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p>Remove: {selectedFile.name}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.csv,image/*,.json" // Adjust accepted types as needed
                aria-hidden="true"
              />

              {/* Textarea and Send Button */}
              <div className="relative flex-grow">
                <Textarea
                  id="chat-input"
                  placeholder={
                    selectedFile
                      ? `File "${selectedFile.name.substring(0, 25)}${
                          selectedFile.name.length > 25 ? "..." : ""
                        }" attached. Add your message...` // Improved placeholder
                      : "Ask anything..."
                  }
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className={cn(
                    "bg-gray-800/50 border border-gray-700 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 rounded-lg resize-none text-base text-gray-200 placeholder-gray-500 pl-4 py-2.5 pr-14", // Adjusted padding/colors
                    "self-center min-h-[48px] max-h-40 w-full" // Adjusted min-height
                  )}
                  disabled={isLoading}
                  aria-label="Chat input"
                />
                <div className="absolute right-2 bottom-[7px]">
                  {" "}
                  {/* Adjusted position slightly */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentInput.trim()}
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-md flex items-center justify-center text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-cyan-500 flex-shrink-0", // Slightly larger, rounded-md
                      isLoading || !currentInput.trim()
                        ? "cursor-not-allowed opacity-50 bg-gray-600" // Clearer disabled state
                        : "bg-gradient-to-br from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow" // Adjusted gradient
                    )}
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 -mr-px" /> // Slightly adjust icon position
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
};

export default ChatPage;
