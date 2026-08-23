import { Badge } from "@/components/ui/badge";

type VariantStatusPage = {
    status: string;
};

export function VariantStatusBadge({status}: VariantStatusPage)
{
    const normalizedStatus = status.toLowerCase();
    if(normalizedStatus == "active")
    {
        return (
            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                Đang hoạt động
            </Badge>
        )
    }
    else if (normalizedStatus === "inactive") {
    return (
      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
        Ngừng hoạt động
      </Badge>
    );
  }
   return <Badge variant="secondary">{status}</Badge>;
}   