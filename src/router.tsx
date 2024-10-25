import { Navigate, createBrowserRouter } from 'react-router-dom';
import { DefaultLayout } from './views/Layouts/DefaultLayout';
import { DashBoard } from './views/Layouts/DashBoard';
import { GuestLayout } from './views/Layouts/GuestLayout';
import { Login } from './views/Auth/Login';
import { NotFound } from './views/Layouts/NotFound';
import { CargasTrabajos } from './views/CargasTrabajo/CargasTrabajos';
import { Mapa } from './views/Mapa/Mapa';
import { Operadores } from './views/Operadores/Operadores';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <DashBoard />
            },
            {
                path: '/cargasTrabajo',
                element: <CargasTrabajos />
            },
            {
                path: '/mapa',
                element: <Mapa />
            },
            {
                path: '/operadores',
                element: <Operadores />
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
])
export default router;
