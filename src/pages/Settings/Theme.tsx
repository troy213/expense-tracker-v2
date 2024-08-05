import { Navbar, Toolbar } from "@/components";
import { ChangeEvent, useState } from "react";

const Theme = () => {
  const appVersion = import.meta.env.APP_VERSION;
  
  const [selectedTheme, setSelectedTheme] = useState("light");

  const OnThemeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedTheme(event.target.value);
  };

  return (
    <div className="settings">
      <div className="flex-column gap-8 p-4">
        <Navbar title="Theme" enableBackButton={true} />

        <ul className="flex-column gap-8 py-4">
          <li>
            <button type="button" className="btn btn-clear">
              <div className="flex-align-center gap-2">
                <input
                  type="radio"
                  id="light"
                  name="theme"
                  value="light"
                  checked={selectedTheme === "light"}
                  onChange={OnThemeChange}
                />
                <label htmlFor="light">Light Theme</label>
              </div>
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-clear">
              <div className="flex-align-center gap-2">
                <input
                  type="radio"
                  id="dark"
                  name="theme"
                  value="dark"
                  checked={selectedTheme === "dark"}
                  onChange={OnThemeChange}
                />
                <label htmlFor="dark">Dark Theme</label>
              </div>
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div className="flex-justify-center">
          <span className="text--light text--3 py-4">v{appVersion}</span>
        </div>
        <Toolbar />
      </div>
    </div>
  );
};

export default Theme;
