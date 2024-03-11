import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui";
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  </Provider>
);
