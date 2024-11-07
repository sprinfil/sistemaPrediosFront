import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast";
import { showPredio } from "@/lib/PredioService";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader } from "./Loader";

export function ModalVerPredio({ trigger, predioId, setPredioId }) {
  const [predio, setPredio] = useState({});
  const [loading, setLoading] = useState({});

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={async () => {
        try {
          showPredio(predioId, setLoading, setPredio);
        }
        catch (e) {
          //TODO: MOSTRAR ERROR

        }
      }} asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>


          {
            loading ?
              <>
                <div className="w-full flex items-center justify-center">
                  <Loader />
                </div>
              </>
              :
              <>
                <AlertDialogTitle>Predio C.C. {predio?.clave_catastral}</AlertDialogTitle>
                <div className="mt-3 grid grid-cols-2">

                  <div>
                    <Table>

                      <TableHeader>
                        <TableRow>
                          <TableHead colSpan={2}>Información del predio</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        <TableRow>
                          <TableCell className="font-bold">Dueno</TableCell>
                          <TableCell>Jeremy Ojeda</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-bold">Direccion</TableCell>
                          <TableCell>Bahia de la paz 120</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-bold">Area</TableCell>
                          <TableCell>120 mts</TableCell>
                        </TableRow>

                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <Table>

                      <TableHeader>
                        <TableRow>
                          <TableHead>Toma(s)</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        <TableRow>
                          <TableCell>0101001</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                </div>

              </>
          }
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { setPredioId(null); }}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
