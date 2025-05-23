import { Navigate, createBrowserRouter } from 'react-router-dom';
import { DefaultLayout } from './views/Layouts/DefaultLayout';
import { DashBoard } from './views/Layouts/DashBoard';
import { GuestLayout } from './views/Layouts/GuestLayout';
import { Login } from './views/Auth/Login';
import { NotFound } from './views/Layouts/NotFound';
import { CargasTrabajos } from './views/CargasTrabajo/CargasTrabajos';
import { Mapa } from './views/Mapa/Mapa';
import { Operadores } from './views/Operadores/Operadores';
import { MapaValvulas } from './views/Mapa/MapaValvulas';
import { Recorridos } from './views/Recorridos/Recorridos';
import { PadronTomas } from './views/PadronTomas/PadronTomas';
import { Reportes } from './views/Reportes/Reportes';
import { Solicitud } from './views/TiempoExtra/Solicitud';
import HorasExtras from './views/TiempoExtra/HorasExtras';
import { HoraExtraVer } from './views/TiempoExtra/HoraExtraVer';
import { Empleados } from './views/TiempoExtra/Empleados';
import { Areas } from './views/TiempoExtra/Areas';
import { Grupos } from './views/TiempoExtra/Grupos';
import { EditarSolicitud } from './views/TiempoExtra/EditarSolicitud';
import { RolesPermisos } from './views/AdministracionSistema/RolesPermisos';

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
        path: '/mapaValvulas',
        element: <MapaValvulas />
      },
      {
        path: '/operadores',
        element: <Operadores />
      },
      {
        path: '/recorridos',
        element: <Recorridos />
      },
      {
        path: '/padronTomas',
        element: <PadronTomas />
      },
      {
        path: '/reporte',
        element: <Reportes />
      },
      {
        path: '/solicitud',
        element: <Solicitud />
      },
      {
        path: '/horasextra',
        element: <HorasExtras />
      },
      {
        path: '/horasextra/verSolicitud/:solicitudId',
        element: <HoraExtraVer />
      },
      {
        path: '/solicitud/solicitudes/:solicitudId',
        element: <EditarSolicitud />
      },
      {
        path: '/horasextra/empleados',
        element: <Empleados />
      },
      {
        path: '/horasextra/areas',
        element: <Areas />
      },
      {
        path: '/horasextra/grupos',
        element: <Grupos />
      },
      {
        path: "/rolesPermisos",
        element: <RolesPermisos />
      }
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
