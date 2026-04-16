import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/features/products/schema/product";

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      className="relative mx-auto w-full max-w-sm cursor-pointer pt-0"
      onClick={onClick}
    >
      <div className="h-28 w-full">
        <img
          src={`${import.meta.env.VITE_BASE_URL}/storage/images/${product.image}`}
          alt={product.name}
          className="h-full w-full object-none"
        />
      </div>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{product.active && "Active"}</Badge>
        </CardAction>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="truncate">
          {product.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
