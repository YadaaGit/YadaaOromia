import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

// simple in-memory cache: key -> { uid, src, promise, timestamp }
const imageCache = new Map();
const DEFAULT_RETRIES = 3;
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

const Loading = ({ className = "", style = {} }) => {
  return (
    <div
      className={`flex items-center justify-center bg-white ${className}`}
      style={{
        width: "100px",
        height: "50px",
        background: "#00000075",
        borderRadius: 8,
        ...style,
      }}
    >
      <div className="flex space-x-1">
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </div>
    </div>
  );
};

const Dot = ({ delay }) => (
  <span
    className="w-2 h-2 bg-gray-700 rounded-full mx-1 animate-bounce"
    style={{ animationDelay: delay }}
  ></span>
);

const ErrorDisplay = ({ className = "", style = {} }) => (
  <div
    className={`flex items-center justify-center ${className}`}
    style={{
      width: "100%",
      height: "100%",
      background: "#ffe5e5",
      border: "1px solid red",
      borderRadius: 8,
      color: "red",
      fontWeight: "bold",
      fontSize: 20,
      ...style,
    }}
  >
    !
  </div>
);

function RemoteImage({
  uid,
  lang,
  alt = "Image",
  className = "",
  style = {},
  loadingClassName = "",
  loadingStyle = {},
  errorClassName = "",
  errorStyle = {},
  ...props
}) {
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let mounted = true;
    const key = `${lang}|${String(uid)}`;
    const uidStr = String(uid);

    // helper to determine if cache entry is still fresh
    function isFresh(entry) {
      if (!entry || !entry.timestamp) return false;
      return Date.now() - entry.timestamp < CACHE_TTL_MS;
    }

    // actual fetch with retries, returns dataUrl or throws
    async function fetchImageData(retries = DEFAULT_RETRIES) {
      let attempt = 0;
      const baseUrl = `${api}/api/${encodeURIComponent(lang)}/images/${encodeURIComponent(
        uidStr
      )}`;

      while (attempt < retries) {
        attempt++;
        try {
          // on retries, add a cache-buster to avoid hitting CDN/browser cached 304s
          const url = attempt > 1 ? `${baseUrl}?_=${Date.now()}` : baseUrl;
          const res = await fetch(url);
          // Immediately handle 404 as non-retriable (image missing)
          if (res.status === 404) {
            const msg = `Image ${key} not found (404)`;
            const err = new Error(msg);
            err.noRetry = true;
            throw err;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const imageDoc = await res.json();
          if (!imageDoc.data || !imageDoc.contentType)
            throw new Error("Invalid image data");
          return `data:${imageDoc.contentType};base64,${imageDoc.data}`;
        } catch (err) {
          console.error(
            `Attempt ${attempt} failed to load image ${key}:`,
            err.message || err
          );
          if (err && err.noRetry) throw err;
          if (attempt >= retries) throw err;
          await new Promise((r) => setTimeout(r, 200 * attempt));
        }
      }
    }

    async function load() {
      setLoading(true);
      setError(false);

      const entry = imageCache.get(key);

      // If we have a fresh src for the exact uid, use it immediately
      if (entry && entry.uid === uidStr && entry.src && isFresh(entry)) {
        if (mounted) {
          setSrc(entry.src);
          setLoading(false);
        }
        return;
      }

      // If there's an in-flight promise for the same uid, reuse it
      if (entry && entry.uid === uidStr && entry.promise) {
        try {
          const dataUrl = await entry.promise;
          if (mounted) {
            setSrc(dataUrl);
            setLoading(false);
            setError(false);
          }
        } catch (err) {
          if (mounted) {
            setError(true);
            setLoading(false);
          }
        }
        return;
      }

      // Start a new fetch and store the promise (include uid so reads can validate)
      const promise = (async () => {
        try {
          const dataUrl = await fetchImageData(DEFAULT_RETRIES);
          // store successful result with uid and timestamp
          imageCache.set(key, { uid: uidStr, src: dataUrl, timestamp: Date.now() });
          return dataUrl;
        } catch (err) {
          // remove failed entry to allow future retries
          imageCache.delete(key);
          throw err;
        } finally {
          // ensure promise field removed if present (replace with src on success)
          const cur = imageCache.get(key);
          if (cur && cur.promise) {
            const newEntry = { ...cur };
            delete newEntry.promise;
            imageCache.set(key, newEntry);
          }
        }
      })();

      // set the promise so concurrent callers wait for same request; store uid too
      imageCache.set(key, { uid: uidStr, promise });

      try {
        const dataUrl = await promise;
        if (mounted) {
          setSrc(dataUrl);
          setLoading(false);
          setError(false);
        }
      } catch (err) {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    if (uid) {
      load();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [uid, lang, api]);

  if (loading)
    return (
      <div
        className="flex items-center justify-center w-full h-full"
        style={{
          height: "100%",
          width: "100%",
          minHeight: "100%",
          minWidth: "100%",
          maxHeight: "100%",
          maxWidth: "100%",
        }}
      >
        <ClipLoader
          color={"#734A1c"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  if (error) return <ErrorDisplay className={errorClassName} style={errorStyle} />;

  return <img src={src} alt={alt} className={className} style={style} {...props} />;
}

export default RemoteImage;
