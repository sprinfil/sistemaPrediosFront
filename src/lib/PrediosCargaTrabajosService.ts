import axiosClient from "@/axios-client";


export const crearCargaTrabajo = async (fileInfo, operadorSeleccionado, asignedById, setLoading) => {
  try {
    // console.log(fileInfo)
    if (!Array.isArray(fileInfo) || fileInfo.length === 0) {
      return;
    }
    setLoading(true)
    const nombre = Object.keys(fileInfo[0])[0];
    const predioCargaTrabajo =
    {
      user_id: operadorSeleccionado?.id,
      asigned_by: asignedById,
      nombre_carga: nombre,
      status: 0
    }

    const response = await axiosClient.post('/predios-carga-trabajos', predioCargaTrabajo);

    const carga_trabajo_id = response?.data?.data?.id;
    const predioCargaTrabajoDetalles: any[] = [];

    fileInfo?.map((row, index) => {
      if (index != 0) {
        let campos: any[] = [];
        Object.values(row).map((value, i) => {
          campos.push(value);
        })

        let cargaTrabajoDetalleTemp =
        {
          id_predios_carga_trabajo: carga_trabajo_id,
          cuenta: campos[0],
          usuario: campos[1],
          orden: campos[2],
          dirección: campos[3],
          clave_catastral: campos[4],
          no_medidor: campos[5],
        }
        predioCargaTrabajoDetalles.push(cargaTrabajoDetalleTemp);
      }
    })

    console.log(nombre);
    console.log(predioCargaTrabajoDetalles);
  } catch (e) {

    throw e;

  } finally {
    setLoading(false)
  }


};