import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CartTabContent from "@/features/pos/components/cart/cart-tab-content";
import CustomerInformation from "@/features/pos/components/customer/customer-information";
import CustomerSelector from "@/features/pos/components/customer/customer-selector";
import PaymentTabContent from "@/features/pos/components/payment/payment-tab-content";
import { useCartCount } from "@/features/pos/store/selectors/cart-selector";
import {
  useActiveTab,
  useUIActions,
} from "@/features/pos/store/selectors/ui-selector";
import type { ActiveTab } from "@/features/pos/store/slices/ui-slice";
import { ShoppingCart } from "lucide-react";

const tabs = [
  { value: "cart", name: "Cart" },
  { value: "payment", name: "Payment" },
];

export default function PosRightPanel() {
  const activeTab = useActiveTab();
  const { setActiveTab } = useUIActions();
  const count = useCartCount();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex h-12 items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="relative cursor-pointer"
              onClick={() => setActiveTab("cart")}
            >
              <ShoppingCart className="text-primary size-5" />
              {count > 0 && (
                <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 tabular-nums">
                  {count}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CustomerSelector />
      </div>
      <CustomerInformation />
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ActiveTab)}
      >
        <TabsList className="bg-background w-full rounded-none border-b p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="cart" className="my-6 mt-3.5">
          <div className="sticky top-0 h-[calc(100vh-4rem)] overflow-hidden">
            <CartTabContent />
          </div>
        </TabsContent>

        <TabsContent value="payment" className="my-6 mt-3.5">
          <PaymentTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
