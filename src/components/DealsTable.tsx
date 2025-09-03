
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Deal {
  id: string;
  clientName: string;
  dealType: string;
  amount: number;
  profit: number;
  date: string;
  status: string;
}

interface DealsTableProps {
  deals: Deal[];
}

const DealsTable = ({ deals }: DealsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Deal Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell className="font-medium">{deal.clientName}</TableCell>
              <TableCell>{deal.dealType}</TableCell>
              <TableCell>${deal.amount.toLocaleString()}</TableCell>
              <TableCell className="text-green-600 font-medium">
                +${deal.profit.toLocaleString()}
              </TableCell>
              <TableCell>{new Date(deal.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {deal.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DealsTable;
