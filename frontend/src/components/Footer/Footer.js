import React from "react";
import { useHistory } from "react-router-dom";
import "./Footer.css";

export const Footer = (props) => {
  return (
    <footer className="footer">
      <ul className="footer-list">
        <li>LOGO</li>
        <li>Support</li>
        <li>FAQ</li>
      </ul>
    </footer>
  );
};
