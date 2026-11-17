
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  ShoppingCart,
  Sparkles,
} from "lucide-react";



export interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  image?: string;
  stock?: number;
  isActive?: boolean;
}

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  products?: Product[];
};

interface ToyAssistantProps {
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  endpoint?: string;
}



const STORAGE_KEY = "toyland_assistant_chat";

const SUGGESTIONS = [
  "Recommend toys under Rs. 3000",
  "Show me soft toys",
  "Educational toys",
  "Gift for a 5 year old",
  "Tell me about shipping",
];

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "Hi! I'm Teddy 🧸, your ToyLand assistant.\n\nTell me what kind of toy you're looking for, and I'll help you find it!",
};



const money = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-LK")}`;

const imageSource = (image?: string) => {
  if (!image) return "";

  if (/^(https?:\/\/|data:|\/)/i.test(image)) {
    return image;
  }

  return `/${image.replace(/^\/+/, "")}`;
};

function getProductMatches(
  reply: string,
  products: Product[]
): Product[] {
  const lowerReply = reply.toLowerCase();

  return products
    .filter(
      (product) =>
        product.isActive !== false &&
        lowerReply.includes(product.name.toLowerCase())
    )
    .slice(0, 3);
}

function getResponseText(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (!data || typeof data !== "object") {
    return "";
  }

  const root = data as Record<string, unknown>;

  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const reply =
    nested.reply ??
    nested.response ??
    nested.answer ??
    nested.text;

  return typeof reply === "string" ? reply : "";
}



function MessageText({ text }: { text: string }) {
  return (
    <div className="space-y-2 whitespace-pre-wrap break-word">
      {text.split("\n").map((line, index) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return (
          <p key={index}>
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}



function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-orange-50 text-3xl">
      {product.image && !failed ? (
        <img
          src={imageSource(product.image)}
          alt={product.name}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        "🧸"
      )}
    </div>
  );
}



function ProductCard({
  product,
  onAdd,
  onView,
}: {
  product: Product;
  onAdd?: (product: Product) => void;
  onView?: (product: Product) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-orange-100">
      <ProductImage product={product} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-[#14284b]">
          {product.name}
        </p>

        <p className="text-xs text-slate-400">
          {product.category}
        </p>

        <p className="mt-1 text-sm font-black text-orange-600">
          {money(product.price)}
        </p>

        {product.stock !== undefined && (
          <p className="text-xs text-slate-500">
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {onAdd && (
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={() => onAdd(product)}
            className="flex items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart size={13} />
            Add
          </button>
        )}

        {onView && (
          <button
            type="button"
            onClick={() => onView(product)}
            className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}



export default function ToyAssistant({
  products = [],
  onAddToCart,
  onViewProduct,
  endpoint = `${import.meta.env.VITE_API_BASE_URL}/chat`,
}: ToyAssistantProps) {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) ?? "null"
      );

      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
    } catch {
      
    }

    return [WELCOME];
  });

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hint, setHint] = useState(true);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-40))
      );
    } catch {
     
    }
  }, [messages]);

  
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typing, open]);

  
  useEffect(() => {
    if (!open) return;

    setHint(false);

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [open]);

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addMessage = (
    message: Omit<ChatMessage, "id">
  ) => {
    setMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        ...message,
      },
    ]);
  };



  const ask = async (rawMessage: string) => {
    const message = rawMessage.trim();

    if (!message || typing) return;

    addMessage({
      role: "user",
      text: message,
    });

    setInput("");
    setTyping(true);

    let replyText = "";

    try {
      if (!endpoint) {
        throw new Error("Chat API URL is not configured.");
      }

      const controller = new AbortController();

      const timeout = window.setTimeout(() => {
        controller.abort();
      }, 30000);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || `Server error: ${response.status}`
          );
        }

        if (data?.success === false) {
          throw new Error(
            data?.message || "AI request failed."
          );
        }

        replyText = getResponseText(data);

        if (!replyText.trim()) {
          throw new Error("Empty response from AI.");
        }
      } finally {
        window.clearTimeout(timeout);
      }
    } catch (error) {
      console.error("ToyLand AI Error:", error);

      if ((error as Error).name === "AbortError") {
        replyText =
          "Sorry! The request took too long. Please try again.";
      } else if (
        (error as Error).message ===
        "Chat API URL is not configured."
      ) {
        replyText =
          "The AI assistant is not configured yet. Please try again later.";
      } else {
        replyText =
          "Sorry! I'm having trouble connecting to ToyLand right now. Please try again.";
      }
    }

    const recommendedProducts = getProductMatches(
      replyText,
      products
    );

    setTyping(false);

    addMessage({
      role: "bot",
      text: replyText,
      products: recommendedProducts,
    });
  };

 

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;

    onAddToCart?.(product);

    addMessage({
      role: "bot",
      text: `Added **${product.name}** to your cart! 🛒`,
    });
  };

  

  const clearChat = () => {
    setMessages([WELCOME]);

    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      
    }
  };

  

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(input);
  };

  

  return (
    <>
      <style>
        {`
          @keyframes teddy-pop {
            from {
              transform: translateY(15px) scale(.96);
              opacity: 0;
            }
            to {
              transform: none;
              opacity: 1;
            }
          }

          @keyframes teddy-bounce {
            0%, 80%, 100% {
              transform: translateY(0);
              opacity: .4;
            }
            40% {
              transform: translateY(-5px);
              opacity: 1;
            }
          }
        `}
      </style>

      

      {open && (
        <section
          role="dialog"
          aria-label="ToyLand AI Assistant"
          className="fixed bottom-24 right-4 z-80 flex h-[min(640px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl bg-[#fff8f0] shadow-2xl sm:right-6 sm:w-100"
          style={{ animation: "teddy-pop .3s ease-out" }}
        >
         

          <header className="flex items-center gap-3 bg-linear-to-br from-orange-400 to-orange-600 px-5 py-4 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-3xl">
              🧸
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black">
                Teddy
              </h2>

              <p className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                ToyLand AI Assistant
              </p>
            </div>

            <button
              type="button"
              onClick={clearChat}
              aria-label="Clear chat"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/30"
            >
              <Trash2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/30"
            >
              <X size={18} />
            </button>
          </header>

        

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "bot" && (
                  <span className="mr-2 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-lg">
                    🧸
                  </span>
                )}

                <div
                  className={`max-w-[82%] space-y-2`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-md bg-[#14284b] text-white"
                        : "rounded-bl-md bg-white text-[#14284b] ring-1 ring-orange-100"
                    }`}
                  >
                    <MessageText text={message.text} />
                  </div>

                  {message.products?.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={onAddToCart ? addToCart : undefined}
                      onView={onViewProduct}
                    />
                  ))}
                </div>
              </div>
            ))}

           

            {typing && (
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-lg">
                  🧸
                </span>

                <div className="flex gap-1.5 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-orange-100">
                  {[0, 1, 2].map((number) => (
                    <span
                      key={number}
                      className="h-2 w-2 rounded-full bg-orange-500"
                      style={{
                        animation: `teddy-bounce 1s ${
                          number * 0.15
                        }s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            

            {messages.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void ask(suggestion)}
                    className="rounded-full bg-white px-3 py-2 text-sm font-bold text-[#14284b] ring-1 ring-orange-100 transition hover:bg-orange-500 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div ref={endRef} />
          </div>

          

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-orange-100 bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={300}
              placeholder="Ask Teddy about toys..."
              aria-label="Message Teddy"
              className="min-w-0 flex-1 rounded-full border border-orange-100 bg-orange-50 px-5 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-orange-500 text-white shadow-lg transition hover:scale-105 hover:bg-orange-600 disabled:opacity-40"
            >
              <Send size={19} />
            </button>
          </form>
        </section>
      )}

      

      <div className="fixed bottom-5 right-4 z-80 sm:right-6">
        {!open && hint && (
          <div className="absolute bottom-18 right-0 w-56 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#14284b] shadow-xl">
            <button
              type="button"
              onClick={() => setHint(false)}
              aria-label="Dismiss hint"
              className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#14284b] text-white"
            >
              <X size={12} />
            </button>

            <span className="flex items-center gap-1.5 text-orange-500">
              <Sparkles size={14} />
              Need help?
            </span>

            Ask Teddy to find the perfect toy!
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close assistant" : "Open assistant"}
          className="relative grid h-16 w-16 place-items-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-white shadow-2xl shadow-orange-500/40 transition hover:scale-110"
        >
          {!open && (
            <span className="absolute inset-0 animate-ping rounded-full bg-orange-500/30" />
          )}

          <span className="relative">
            {open ? (
              <X size={28} />
            ) : (
              <MessageCircle size={30} />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
