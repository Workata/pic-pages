# PicPages

Frontend for tomtol application.


### Development

Make sure you are using `Node 25.2.1`
```sh
nvm use 25.2.1
```

Run static checks
```sh
make check
```

Start development server
```sh
make run
```

### Deployment

1. Check `.env` file (`prod` settings)
2. Check branch (should be `main`)
3. Run deploy (via `Makefile` - it will run `npm run deploy` command)
```sh
make deploy
```

### Design assumptions
TODO

### Stack

**Language**: [TypeScript](https://www.typescriptlang.org/) <br>
**Frontend**: [React](https://react.dev/learn) <br>
**Image hosting**: [Google Drive](https://drive.google.com/) <br>
**Deploy**: [Github Actions](https://github.com/features/actions) with [Github Pages](https://pages.github.com/) <br>
**Maps**: [OpenLayers](https://openlayers.org/) <br>
