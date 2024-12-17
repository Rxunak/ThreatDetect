import "../styles/Footer.css";
import { MdLocalPolice } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";




const Footer = () => {
  return (
    <div className="mainfooter">
      <div className="footer">
        <div className="footerone"><MdLocalPolice/></div>
        <div className="footertwo">&copy; 2024 ThreatDetect. All rights reserved.</div>
        <div className="footerthree">
          <li><a target="_blank" rel="noreferrer" href="https://www.instagram.com/" ><RiInstagramFill/></a></li>
          <li><FaFacebook/></li>
          <li><FaTwitter/></li>
        </div>
      </div>
    </div>
  );
};

export default Footer;
