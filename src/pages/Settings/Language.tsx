import { FlagIDSVg, FlagUKSvg } from "@/assets";
import { Navbar, Toolbar } from "@/components";

const Language = () => {
  const appVersion = import.meta.env.APP_VERSION;

  return (
    <div className="settings">
      <div className="flex-column gap-8 p-4">
        <Navbar title="Theme" enableBackButton={true} />

        <ul className="flex-column gap-8 py-4">
          <li className="flex-space-between">
            <button type="button" className="btn btn-clear">
              <div className="flex-align-center gap-2">
                <FlagUKSvg />
                <span>English</span>
              </div>
            </button>
            <span className="check-mark">✔</span>
          </li>
          <li>
            <button type="button" className="btn btn-clear">
              <div className="flex-align-center gap-2">
                <FlagIDSVg />
                <span>Indonesia</span>
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

export default Language;
