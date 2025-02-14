interface GithubRepo {
  name: string;
  owner: string;
  homepage: string;
  description: string;
}

interface Repo {
  id: number;
  starCount: number;
  starCountChange: number;
  GithubRepo: GithubRepo;
}

interface RepoListProps {
  repos: Repo[];
}

export function RepoList({ repos }: RepoListProps) {
  return (
    <div className="w-full space-y-6">
      {repos.map((repo) => (
        <div key={repo.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <a 
                href={`https://github.com/${repo.GithubRepo.owner}/${repo.GithubRepo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {repo.GithubRepo.owner}/{repo.GithubRepo.name}
              </a>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{repo.GithubRepo.description || 'No description available'}</p>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300 text-sm">
              <span className="font-medium">{repo.starCount.toLocaleString()}</span>
              {repo.starCountChange > 0 && (
                <span className="text-green-600 dark:text-green-400 text-sm">
                  (+{repo.starCountChange})
                </span>
              )}
            </div>
          </div>
          {repo.GithubRepo.homepage && (
            <a
              href={repo.GithubRepo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              🔗 {repo.GithubRepo.homepage}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
