import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Utama } from './components/Utama';

function App() {
  	return (
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Utama/>}/>
		</Routes>
	</BrowserRouter>
  	);
}

export default App;