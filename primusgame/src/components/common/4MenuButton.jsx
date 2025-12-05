import "./MenuButton.css";
import { Link } from "react-router-dom";

export default function MenuButton({ label, to }) {
    return (
        <Link className="menu-btn" to={to}>
            {label}
        </Link>
    );
}
