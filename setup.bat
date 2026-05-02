:: TaskFlow — Quick local setup
@echo off
echo Installing backend dependencies...
cd backend
call npm install
echo.

echo Installing frontend dependencies...
cd ..\frontend
call npm install
echo.

echo Done! Now:
echo  - Copy backend\.env.example to backend\.env and fill in your MongoDB URI
echo  - Run backend:  cd backend ^&^& npm run dev
echo  - Run frontend: cd frontend ^&^& npm run dev
