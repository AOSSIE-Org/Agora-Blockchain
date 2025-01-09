import { useTheme } from "../Helper/ThemeProvider"; // Import useTheme hook
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

export const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme(); // Use theme context

  return (
    <div
      className="relative w-16 h-8 flex items-center dark:bg-gray-100 bg-teal-500 cursor-pointer rounded-full p-1"
      onClick={toggleTheme}
    >
      <FaMoon className="text-white size={18}" />
      <div
        className="absolute bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300"
        style={darkMode ? { left: "2px" } : { right: "2px" }}
      ></div>
      <BsSunFill className="ml-auto text-yellow-400" size={18}></BsSunFill>
    </div>
  );
};
