import ReactDOM from 'react-dom/client'
import App from './App'
import { store } from './store'
import { Provider } from 'react-redux'
import './i18n/i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  <Provider store={store}>
      <App />
  </Provider>,
)