import repos from '../data/repos.json'
import { RepoList } from './components/RepoList'
import logo from './assets/logo.svg'

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-x-hidden">
      <main className="w-full max-w-xl px-4 py-8 sm:px-8">
        <img src={logo} alt="1984 Logo" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">GitHub Trending Repos</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">For February 14, 2025</p>
        <RepoList repos={repos} />
      </main>
    </div>
  )
}

export default App
