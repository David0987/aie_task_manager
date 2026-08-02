// Header — shown on every page (it is rendered outside <Routes> in App.jsx).
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      {/* <Link> instead of <a>: it changes the URL without reloading the
          whole page, which is what makes this a single-page app. */}
      <Link to="/tasks" className="header-title">
        Task Manager
      </Link>
    </header>
  );
}

export default Header;
