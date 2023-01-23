import { Provider } from "react-redux";
import { store } from "./models";
import AudioPlayer from "./pages/AudioPlayer";

function App() {
  return (
    <Provider store={store}>
      <AudioPlayer />
    </Provider>
  );
}

export default App;
