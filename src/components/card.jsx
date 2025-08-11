import React from "react";

const VenueCard = ({
  venueName,
  sportTypes,
  pricePerHour,
  location,
  rating, // optional
  badgeText = "",
  bgColor = "#a78bfa",
}) => {
  const cardStyle = {
    width: "190px",
    height: "254px",
    background: "#fff",
    borderRadius: "20px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  };

  const shineStyle = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  };

  const glowStyle = {
    position: "absolute",
    inset: "-10px",
    background:
      "radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0) 70%)",
    opacity: 0,
    transition: "opacity 0.5s ease",
  };

  const contentStyle = {
    padding: "1.25em",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.75em",
    position: "relative",
    zIndex: 2,
  };

  const badgeStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#10b981",
    color: "white",
    padding: "0.25em 0.5em",
    borderRadius: "999px",
    fontSize: "0.7em",
    fontWeight: 600,
  };

  const imageStyle = {
    width: "100%",
    height: "100px",
    background: bgColor,
    borderRadius: "12px",
    position: "relative",
    overflow: "hidden",
  };

  const textStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25em",
  };

  const titleStyle = {
    color: "#1e293b",
    fontSize: "1.1em",
    margin: 0,
    fontWeight: 700,
  };

  const descStyle = {
    color: "#1e293b",
    fontSize: "0.75em",
    margin: 0,
    opacity: 0.7,
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  };

  const priceStyle = {
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "1em",
  };

  const buttonStyle = {
    width: "28px",
    height: "28px",
    background: "#7c3aed",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div style={cardStyle}>
      <div style={shineStyle}></div>
      <div style={glowStyle}></div>

      <div style={contentStyle}>
        {badgeText && <div style={badgeStyle}>{badgeText}</div>}
        <div style={imageStyle}></div>

        <div style={textStyle}>
          <p style={titleStyle}>{venueName}</p>
          <p style={descStyle}>{sportTypes.join(", ")}</p>
          <p style={descStyle}>📍 {location}</p>
          {rating !== undefined && <p style={descStyle}>⭐ {rating.toFixed(1)} / 5</p>}
        </div>

        <div style={footerStyle}>
          <div style={priceStyle}>${pricePerHour} / hr</div>
          <div style={buttonStyle}>
            <svg height="16" width="16" viewBox="0 0 24 24">
              <path
                strokeWidth="2"
                stroke="currentColor"
                d="M4 12H20M12 4V20"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
