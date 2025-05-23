import { Button } from "@/components/ui/button";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Loader } from "./Loader";
import { IoIosSave } from "react-icons/io";
import { useCargaTrabajoCensos } from "@/lib/CensosHook";
import { ComboBoxOperadoresCensos } from "./ComboBoxOperadoresCensos";
dayjs.extend(localizedFormat);
dayjs.locale('es');


export function CargaTrabajoCensos({ cargaTrabajo, setCargaTrabajo, setData }) {
    const{
        operadorSeleccionado,
        setOperadorSeleccionado,
        loading,
        form,
        onSubmit
    }=useCargaTrabajoCensos(cargaTrabajo, setCargaTrabajo, setData);

    return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="nombre_carga"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nombre de la carga</FormLabel>
                <FormControl>
                    <Input placeholder="Nombre de la carga" disabled={false} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Operador Asignado</FormLabel>
                <FormControl>
                    <div>
                    <ComboBoxOperadoresCensos defualtOperador={operadorSeleccionado?.id} setOperador={setOperadorSeleccionado} />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField

            control={form.control}
            name="fecha_asignacion"

            render={({ field }) => (
                <FormItem>
                <FormLabel>Fecha de asignación</FormLabel>
                <FormControl>
                    <Input className="pointer-events-none" type="text"  {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="fecha_finalizacion"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fecha de finalización</FormLabel>
                <FormControl>
                    <Input className="pointer-events-none" type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Estado" className="pointer-events-none" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            {
            cargaTrabajo?.status == "0" ?
                <>
                <Button
                    type="submit"
                    disabled={loading}
                >
                    <IoIosSave />
                    Guardar
                    {loading ? <><Loader /> </> : <></>}
                </Button>
                </> : <></>
            }

        </form>
        </Form>
    </>

    );
}
