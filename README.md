# 🍽️ Restaurant UI

React frontend for the Restaurant Table Reservation System.

## Tech Stack
- React 19, Vite 6, React Router v7
- Dark glassmorphism design with Inter font
- Nginx reverse proxy (Docker)

## Pages
| Path | Description |
|------|-------------|
| `/` | Hero + live stats from Table Service |
| `/tables` | Table management (CRUD, filtering) |
| `/book` | 3-step booking wizard with availability |
| `/reservations` | View/cancel reservations with filters |

## Development
```bash
npm install
npm run dev     # http://localhost:3000
```

## Docker
```bash
docker build -t restaurant-ui .
docker run -p 3000:80 restaurant-ui
```
