// src/components/Header.jsx
import './Header.css';
import Logo from './../Assets/SagerLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="Sager Logo" className="logo-img" />
      </div>
      <div className="right-section">
        <div className="close">
        <FontAwesomeIcon icon={faExpand} style={{"--fa-primary-color": "#fcfcfc", "--fa-secondary-color": "#fcfcfc"}} />
      </div>
        <span className="close">
          <FontAwesomeIcon icon={faGlobe} />
        </span>
        <span className="icon bell">
          <FontAwesomeIcon icon={faBell} />
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