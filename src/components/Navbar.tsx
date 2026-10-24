import "./Navbar.css";

interface NavbarProps {
  categories: string[];
  category: string;
  setCategory: (value: string) => void;
}

function Navbar({
  categories,
  category,
  setCategory,
}: NavbarProps) {

  return (
    <nav className="navbar">

      {categories.map((item) => (

        <button
          key={item}
          className={
            category === item
              ? "active"
              : ""
          }
          onClick={() =>
            setCategory(item)
          }
        >
          {item}
        </button>

      ))}

    </nav>
  );
}

export default Navbar;