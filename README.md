# Next.js Telo Shop
Para correr localmente, se necesita la base de datos.
```
docker-compose up -d
```

* El -d, significa __detached__



## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
* MongoDB URL Local:
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir los módulos de node y levantar Next
```
yarn install
yarn dev
```


## Llenar la base de datos con información de pruebas

Llamara:
```
http://localhost:3000/api/seed
```

## package.json
{
  "name": "teslo-shop",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@emotion/react": "^11.7.1",
    "@emotion/styled": "^11.6.0",
    "@mui/icons-material": "^5.4.1",
    "@mui/material": "^5.4.1",
    "@mui/x-charts": "^6.0.0-alpha.4",
    "@mui/x-data-grid": "^5.5.1",
    "@paypal/react-paypal-js": "^7.6.0",
    "@tanstack/react-table": "^8.9.3",
    "@types/bcryptjs": "^2.4.2",
    "axios": "^0.26.0",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.28.1",
    "formidable": "^2.0.1",
    "js-cookie": "^3.0.1",
    "jsonwebtoken": "^9.0.1",
    "material-react-table": "^1.14.0",
    "mongoose": "^6.2.1",
    "next": "12.0.10",
    "next-auth": "^4.22.1",
    "react": "17.0.2",
    "react-base-table": "^1.13.4",
    "react-dom": "17.0.2",
    "react-hook-form": "^7.27.1",
    "react-slideshow-image": "^3.7.0",
    "react-table": "^7.8.0",
    "swr": "^1.2.1"
  },
  "devDependencies": {
    "@types/formidable": "^2.0.4",
    "@types/js-cookie": "^3.0.1",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/node": "17.0.17",
    "@types/react": "17.0.39",
    "@types/react-dom": "^18.2.7",
    "eslint": "8.9.0",
    "eslint-config-next": "12.0.10",
    "typescript": "4.5.5"
  }
}
