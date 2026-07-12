# Aqua Green Agencies — Customer Website

The public-facing website (home, products, services, gallery, spares,
contact, and customer account/login) for Aqua Green Agencies.

## Run locally
```bash
npm install
npm start
```
Runs on http://localhost:3000. By default it talks to the backend at
`http://localhost:8080/api` — see `.env.example` to point it at a
deployed backend instead.

## Deploy
Build with `npm run build` and deploy the `build/` folder to any static
host (Vercel, Netlify, Render Static Site, etc). Set the environment
variable `REACT_APP_API_URL` to your deployed backend's URL before
building.

## Related repos
- `admin-frontend` — the staff/admin dashboard (separate app, separate deploy)
- `backend` — the Spring Boot API both frontends talk to
