// ecosystem.config.js w katalogu projekt-inz/
module.exports = {
  apps: [
    {
      name: 'Serwer',
      script: 'server/index.js', // ścieżka do pliku uruchamiającego serwer
      cwd: 'server', // katalog, w którym znajduje się serwer
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'Klient',
      script: 'node_modules/react-scripts/scripts/start.js', // ścieżka do skryptu uruchamiającego klienta
      cwd: '.', // katalog główny (projekt-inz/)
      watch: true,
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};
