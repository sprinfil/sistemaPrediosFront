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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export function TableCargaTrabajoDetalles({cargaTrabajo}) {
  return (
    <div className="mt-5 overflow-auto h-[60vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cuenta</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Clave Catastral</TableHead>
            <TableHead>Medidor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargaTrabajo?.detalles?.map((detalle) => (
            <TableRow className={`${detalle?.asignado == 1 ? "bg-green-100 hover:bg-green-100" : ""}`} key={detalle?.id}>
              <TableCell>{detalle?.cuenta}</TableCell>
              <TableCell>{detalle?.usuario}</TableCell>
              <TableCell>{detalle?.orden}</TableCell>
              <TableCell>{detalle?.direccion}</TableCell>
              <TableCell>{detalle?.clave_catastral}</TableCell>
              <TableCell>{detalle?.no_medidor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

  )
}
