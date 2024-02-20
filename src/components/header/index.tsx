import { AiOutlineGlobal, AiOutlineUser } from "react-icons/ai";

import tags from "@/mocks/tags";
import "./style.scss";

function Header() {
  return (
    <header className="mb-8">
      <div className="tagsBox">
        <a href="/" className="logoLink">
          <img
            src="https://logodownload.org/wp-content/uploads/2020/10/epic-games-logo.png"
            alt="epicLogo"
            className="logo"
          />
        </a>
        {tags.map((tag) => (
          <p className="tag text-gray-500 hover:text-white transition-all">
            {tag.toUpperCase()}
          </p>
        ))}
      </div>
      <div className="userBox">
        <AiOutlineGlobal className="icon" />
        <AiOutlineUser className="icon" />
        <div className="download">
          <p>Baixar Epic Games </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
