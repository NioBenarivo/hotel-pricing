// test-utils.js
import { render } from "@testing-library/react"
import { Provider } from 'react-redux'
import { useStore, initialState } from './redux/store'

const store = useStore(initialState)
// Add in any providers here if necessary:
// (ReduxProvider, ThemeProvider, etc)
const Providers = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
