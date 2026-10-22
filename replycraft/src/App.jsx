
import { useState } from "react";
import "./App.css";

function App() {
  // Form values
  const [purpose, setPurpose] = useState("Job application");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");

  // Reply and loading status
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [favoriteSuccess, setFavoriteSuccess] = useState("");
  const [historySuccess, setHistorySuccess] = useState("");

  // Expand or collapse a history item
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // Load saved data from localStorage
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(
      localStorage.getItem("replycraft-favorites") || "[]"
    );
  });

  const [history, setHistory] = useState(() => {
    return JSON.parse(
      localStorage.getItem("replycraft-history") || "[]"
    );
  });

  // Generate a reply using our Spring Boot backend
  async function generateReply() {
    if (!details.trim()) {
      setError("Please enter your message details.");
      setReply("");
      return;
    }

    setError("");
    setIsLoading(true);
    setReply("");

    try {
      const response = await fetch( "https://replycraft-64tm.onrender.com/api/reply",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    purpose,
                                    tone,
                                    length,
                                    details: details.trim(),
                                  }),
                                });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate reply. Please try again."
        );
      }

      const message = (data.message || "").trim();

      if (!message) {
        throw new Error("The AI returned an empty reply. Please try again.");
      }

      setReply(message);


      // Save the generated message to history
      const historyItem = {
        id: Date.now(),
        purpose,
        tone,
        length,
        message,
      };

      const updatedHistory = [
        historyItem,
        ...history,
      ].slice(0, 20);

      setHistory(updatedHistory);

      localStorage.setItem(
        "replycraft-history",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      if (error.message === "Failed to fetch") {
        setError(
          "Unable to connect to the server. Please make sure the backend is running and try again."
        );
      } else {
        setError(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Copy the generated reply
  
  async function copyReply() {
    if (!reply || isLoading) return;

    try {
      await navigator.clipboard.writeText(reply);
      setSuccessMessage("Reply copied successfully!");
    } catch {
      setError("Copy failed. Please copy the message manually.");
    }
  }


  // Save a reply to favorites
  function saveFavorite() {
    if (!reply || isLoading) return;

    const favorite = {
      id: Date.now(),
      purpose,
      tone,
      length,
      message: reply,
    };

    const updatedFavorites = [
      ...favorites,
      favorite,
    ];

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "replycraft-favorites",
      JSON.stringify(updatedFavorites)
    );

    alert("Message saved to favorites!");
  }

  // Remove a favorite message
  function removeFavorite(id) {
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.id !== id
    );

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "replycraft-favorites",
      JSON.stringify(updatedFavorites)
    );
  }

  // Clear message history
  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("replycraft-history");
    setExpandedHistoryId(null);
  }

  // Reset the form
  function clearForm() {
    setPurpose("Job application");
    setDetails("");
    setTone("Professional");
    setLength("Medium");
    setReply("");
    setError("");
  }

  // Reuse an existing message
  function reuseMessage(item) {
    setReply(item.message);
    setPurpose(item.purpose);
    setTone(item.tone);
    setLength(item.length);
    setError("");
  }

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="/">
          <span className="logo-icon">R</span>
          ReplyCraft
        </a>
        <span className="header-label">  YOUR SMART WRITING SPACE </span>
      </header>

      <main className="main">
        <section className="intro">
          <span className="eyebrow">  WRITE BETTER. CONNECT BETTER.  </span>
          <h1>Find the right words.</h1>
          <p>
            Create thoughtful, professional messages for work,
            networking, and everyday conversations.
          </p>
        </section>

        <div className="workspace">
          {/* Message form */}
          <section className="panel editor">
            <div className="panel-heading">
              <div>
                <span className="step-label">STEP 01</span>
                <h2>Craft your message</h2>
              </div>
              <span className="heading-icon">✍️</span>
            </div>

            <label htmlFor="purpose">  What type of message do you need?  </label>

            <select id="purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)}>
              <option value="Job application">  Job application email </option>
              <option value="Recruiter follow-up">  Recruiter follow-up  </option>
              <option value="Thank-you email">  Thank-you email  </option>
              <option value="LinkedIn message">  LinkedIn message  </option>
            </select>

            <label htmlFor="details">Add your details</label>

            <textarea id="details" rows="5" placeholder="Enter the job role, company name, or what you want to communicate..." value={details}
              onChange={(event) => {
                setDetails(event.target.value);
                if (event.target.value.trim()) {
                  setError("");
                }
              }}/>

            <div className="character-counter">  {details.length} characters  </div>

            {error && (
              <p className="error-message">{error}</p>
            )}

            <label>Choose your tone</label>

            <div className="tone-options">
              {["Professional", "Friendly", "Confident"].map(
                (option) => (
                  <button key={option} type="button" className={`tone-button ${ tone === option ? "active" : "" }`} onClick={() => setTone(option)}>
                 {option} </button>)
              )}
            </div>

            <label htmlFor="length">  Choose message length  </label>

            <select id="length" value={length} onChange={(event) => setLength(event.target.value)}>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Detailed">Detailed</option>
            </select>

            <button className="generate-button" onClick={generateReply} disabled={isLoading}>
              <span>✦</span>{" "}
              {isLoading
                ? "Generating..."
                : reply
                  ? "Regenerate Reply"
                  : "Generate Reply"}{" "}
              <span>→</span>
            </button>

            <button type="button" className="copy-button" onClick={clearForm} disabled={isLoading}> Clear form  </button>

            <p className="helper-text"> Your message, your tone, your way.  </p>
          </section>

          {/* Generated reply */}
          <section className="panel result-panel">
            <div className="panel-heading">
              <div>
                <span className="step-label">STEP 02</span>
                <h2>Your reply</h2>
              </div>
              <span className="heading-icon">💌</span>
            </div>

            {reply ? (
              <div className="reply-content">
              {successMessage && (
                  <p className="success-message" role="status">
                    ✓ {successMessage}
                  </p>
                )}
                <div className="reply-status">
                  {isLoading
                    ? "GENERATING YOUR REPLY..."
                    : "YOUR DRAFT IS READY"}
                </div>

                <p className="reply-text">{reply}</p>

                {!isLoading && (
                  <>
                    <button className="copy-button" onClick={copyReply}>  Copy message  </button>
                    <button className="copy-button"  onClick={saveFavorite}>  ⭐ Save to Favorites  </button>
                  </>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✉</div>
                <h3>Your words will appear here</h3>
                <p>
                  Enter your details, choose your tone and length,
                  and generate your first message.
                </p>
                <div className="preview-tags">
                  <span>Job applications</span>
                  <span>Emails</span>
                  <span>Networking</span>
                </div>
              </div>
            )}

            <div className="privacy-note">
              <span>✦</span> A little help finding the right words.
            </div>
          </section>

          {/* Favorite messages */}
          <section className="panel favorites-panel">
            <div className="panel-heading">
              <div>
                <span className="step-label">YOUR COLLECTION</span>
                <h2>Favorite Messages ⭐</h2>
                {favoriteSuccess && (
                    <p className="success-message" role="status">  ✓ {favoriteSuccess}  </p>
                  )}
              </div>
            </div>

            {favorites.length === 0 ? (
              <p className="helper-text">  No favorites yet. Generate a message and save it here!  </p>
            ) : (
              <div className="favorites-list">
                {favorites.map((favorite) => (
                  <div className="favorite-card" key={favorite.id}>
                    <h3>{favorite.purpose}</h3>

                    <p className="favorite-meta">  {favorite.tone} · {favorite.length}  </p>
                    <p className="reply-text">  {favorite.message}  </p>

                    <div className="favorite-actions">
                      <button className="copy-button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              favorite.message
                            );
                            setFavoriteSuccess("Reply copied successfully!");
                          } catch {
                            setError("Copy failed. Please copy manually.");
                          }
                        }}>  Copy  </button>

                      <button className="copy-button" onClick={() => reuseMessage(favorite)}>  Use message  </button>
                      <button className="copy-button" onClick={() => removeFavorite(favorite.id)}>  Remove </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Message history */}
          <section className="panel history-panel">
            <div className="panel-heading">
              <div>
                <span className="step-label">RECENT ACTIVITY</span>
                <h2>Message History</h2>
                {historySuccess && (
                    <p className="success-message" role="status">  ✓ {historySuccess}  </p>
                  )}
              </div>

              {history.length > 0 && (
                <button className="copy-button" onClick={clearHistory}>  Clear history  </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="helper-text">  Your generated messages will appear here.  </p>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-card" key={item.id}>
                    <div className="history-card-heading"
                      onClick={() =>
                        setExpandedHistoryId(
                          expandedHistoryId === item.id
                            ? null
                            : item.id
                        )
                      }
                    >
                      <div>
                        <h3>{item.purpose}</h3>
                        <p className="favorite-meta">  {item.tone} · {item.length}  </p>
                      </div>

                      <span>  {expandedHistoryId === item.id ? "▲" : "▼"}  </span>
                    </div>

                    {expandedHistoryId === item.id && (
                      <div className="history-card-content">
                        <p className="reply-text">  {item.message} </p>

                        <button className="copy-button" onClick={() => reuseMessage(item)}>  Reuse message  </button>
                        <button className="copy-button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(item.message);
                              setHistorySuccess("Reply copied successfully!");
                            } catch {
                              setError("Copy failed. Please copy manually.");
                            }
                          }}>
                          Copy message
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="footer">
          Made with care <span>♥</span> · ReplyCraft
        </footer>
      </main>
    </div>
  );
}

export default App;
