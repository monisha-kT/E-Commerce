import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiX, FiSend, FiShoppingBag, FiMinus } from "react-icons/fi";
import "./ShopMindAssistant.css";

const QUICK_PROMPTS = [
  "Find skincare products",
  "Show products under $50",
  "Recommend something popular",
];

const money = (value) => `$${Number(value).toFixed(2)}`;

function getSearchTerm(message) {
  return message
    .replace(/under\s*\$?\s*\d+(?:\.\d+)?/gi, "")
    .replace(/below\s*\$?\s*\d+(?:\.\d+)?/gi, "")
    .replace(/less than\s*\$?\s*\d+(?:\.\d+)?/gi, "")
    .replace(/\$\s*\d+(?:\.\d+)?/g, "")
    .replace(/\b(find|show|search|recommend|recommend me|suggest|looking for|products?|items?|something|popular|best|cheap|affordable|please|me|i want|under|below|less than)\b/gi, "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildFallbackReply(message, products) {
  const budgetMatch = message.match(/(?:under|below|less than)\s*\$?\s*(\d+(?:\.\d+)?)/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;

  if (!products.length) {
    return "I couldn't find a close match in the current product catalog. Try a product name or category such as skincare, furniture, or smartphones.";
  }

  const matchingProducts = budget === null ? products : products.filter((product) => product.price <= budget);
  if (!matchingProducts.length) {
    return `I couldn't find a matching item under ${money(budget)} in the results I checked. Try increasing your budget or searching for a specific category.`;
  }

  if (budget !== null) {
    return `Here are ${matchingProducts.length} option(s) at or below ${money(budget)} from the current catalog. Prices and availability should be confirmed on the product page.`;
  }

  return `I found ${matchingProducts.length} product option(s) that may fit your request. Open any item to see more details.`;
}

export default function ShopMindAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm ShopMind, your shopping assistant. Tell me what you're looking for, your preferred category, or your budget.",
      products: [],
      demo: false,
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;

    setInput("");
    setMessages((previous) => [
      ...previous,
      { id: `user-${Date.now()}`, role: "user", text: message, products: [] },
    ]);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_SHOPMIND_API_URL;
      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: messages.map(({ role, text }) => ({ role, content: text })),
          }),
        });
        if (!response.ok) throw new Error("ShopMind API request failed");
        const data = await response.json();
        setMessages((previous) => [
          ...previous,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: data.reply || data.message || "I couldn't generate a response. Please try again.",
            products: Array.isArray(data.products) ? data.products : [],
            demo: false,
          },
        ]);
        return;
      }

      const term = getSearchTerm(message);
      const budgetMatch = message.match(/(?:under|below|less than)\s*\$?\s*(\d+(?:\.\d+)?)/i);
      const query = term || "";
      const url = query
        ? `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=12`
        : "https://dummyjson.com/products?limit=12&sortBy=rating&order=desc";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not load products");
      const data = await response.json();
      let foundProducts = Array.isArray(data.products) ? data.products : [];
      if (budgetMatch) {
        foundProducts = foundProducts.filter((product) => product.price <= Number(budgetMatch[1]));
      }
      foundProducts = foundProducts.slice(0, 4);
      const reply = buildFallbackReply(message, foundProducts);

      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: reply,
          products: foundProducts,
          demo: true,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: "Sorry, I couldn't connect to the product catalog right now. Please try again in a moment.",
          products: [],
          demo: !import.meta.env.VITE_SHOPMIND_API_URL,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shopmind-root">
      {isOpen && (
        <section className="shopmind-panel" aria-label="ShopMind shopping assistant">
          <header className="shopmind-header">
            <div className="shopmind-brand-icon"><FiShoppingBag aria-hidden="true" /></div>
            <div className="shopmind-heading">
              <strong>ShopMind AI</strong>
              <span><i /> Shopping assistant</span>
            </div>
            <button className="shopmind-icon-button" type="button" onClick={() => setIsOpen(false)} aria-label="Minimize chat">
              <FiMinus />
            </button>
            <button className="shopmind-icon-button" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <FiX />
            </button>
          </header>

          <div className="shopmind-messages" aria-live="polite">
            {messages.map((message) => (
              <div className={`shopmind-message-row ${message.role === "user" ? "is-user" : "is-assistant"}`} key={message.id}>
                <div className="shopmind-bubble">
                  <p>{message.text}</p>
                  {message.products?.length > 0 && (
                    <div className="shopmind-products">
                      {message.products.map((product) => (
                        <button
                          className="shopmind-product"
                          type="button"
                          key={product.id}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          <img src={product.thumbnail || product.images?.[0]} alt="" loading="lazy" />
                          <span className="shopmind-product-copy">
                            <strong>{product.title}</strong>
                            <small>{money(product.price)}{product.rating ? ` · ★ ${product.rating}` : ""}</small>
                          </span>
                          <span className="shopmind-product-arrow">View</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {message.demo && <span className="shopmind-demo-note">Catalog demo · connect an AI API for conversational recommendations</span>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="shopmind-message-row is-assistant">
                <div className="shopmind-bubble shopmind-typing" aria-label="Searching products">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="shopmind-quick-prompts">
              {QUICK_PROMPTS.map((prompt) => (
                <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>{prompt}</button>
              ))}
            </div>
          )}

          <form
            className="shopmind-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products or budget..."
              aria-label="Message ShopMind"
              maxLength={500}
            />
            <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message">
              <FiSend />
            </button>
          </form>
          <p className="shopmind-disclaimer">Suggestions use the demo catalog unless an AI API is configured.</p>
        </section>
      )}

      <button
        type="button"
        className={`shopmind-launcher ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close ShopMind assistant" : "Open ShopMind assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FiX /> : <><FiMessageCircle /><span>Ask ShopMind</span></>}
      </button>
    </div>
  );
}
