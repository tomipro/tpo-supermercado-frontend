import React from "react";
import "./CreditCard.css";
function CreditCard({ cardNumber, name, expiry, cvv }) {
  return (
    <div className="flip-card mb-6 mx-auto">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <p className="heading_8264">MASTERCARD</p>
          {/* ... SVGs ... */}
          <p className="number">{cardNumber || "•••• •••• •••• ••••"}</p>
          <p className="valid_thru">VALID THRU</p>
          <p className="date_8264">{expiry || "MM/YY"}</p>
          <p className="name">{name || "NOMBRE Y APELLIDO"}</p>
        </div>
        <div className="flip-card-back">
          <div className="strip"></div>
          <div className="mstrip"></div>
          <div className="sstrip">
            <p className="code">{cvv ? cvv : "***"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreditCard;
