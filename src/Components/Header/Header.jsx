// src/components/Header.jsx
import './Header.css';
import Logo from './../Assets/SagerLogo.png';
import captureIcon from './../Assets/capture-svgrepo-com.svg';
import globelIcon from './../Assets/language-svgrepo-com.svg';
import bellIcon from './../Assets/bell.svg';


function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="Sager Logo" className="logo-img" />
      </div>
      <div className="right-section">
        <span className="icon">
          <img src={captureIcon} alt="Capture" style={{ width: 24, height: 24 }} />
        </span>
        <span className="icon">
          <img src={globelIcon} alt="Language" style={{ width: 24, height: 24 }} />
        </span>
        <span className="icon bell">
          <img src={bellIcon} alt="Bell" style={{ width: 24, height: 24 }} />
          <span className="notification">8</span>
        </span>
        <div className="user-support">
          <span className="user">Hello,Mohamed Omar</span>
          <span className="support">Technical Support</span>
        </div>
      </div>
    </header>
  );
}

export default Header;