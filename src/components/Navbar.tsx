import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav
      style={{
        width: "100%",
        height: 56,
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
        fontFamily: "inherit",
        position: "fixed",
        top: 0,
        zIndex: 100
      }}
    >
  <div style={{ fontWeight: 700, fontSize: 20, color: "#222" }}>Cham-ai</div>
  <div style={{ fontSize: 15, color: "#555" }}>
        Developed by{' '}
        <a
          href="https://linkedin.com/in/afnanafsal"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0077b5", textDecoration: "none", fontWeight: 500 }}
        >
          afnanafsal
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
