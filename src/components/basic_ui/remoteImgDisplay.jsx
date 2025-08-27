import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

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
  lang = "am",
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
    async function fetchImage() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${api}/api/${lang}/images/${uid}`);
        const imageDoc = await res.json();
        if (!imageDoc.data || !imageDoc.contentType)
          throw new Error("Invalid image data");

        setSrc(`data:${imageDoc.contentType};base64,${imageDoc.data}`);
      } catch (err) {
        console.error("Error loading image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (uid) fetchImage();
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
  if (error)
    return <ErrorDisplay className={errorClassName} style={errorStyle} />;

  return (
    <img src={src} alt={alt} className={className} style={style} {...props} />
  );
}

export default RemoteImage;
