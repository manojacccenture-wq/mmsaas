import { useMemo, useRef, useState } from "react";
import Input from "@/shared/components/UI/Input/Input";
import Button from "@/shared/components/UI/Button/Button";
import Card from "@/shared/components/UI/Card/Card";

// Mock Images
const imgAvocadoSandwich = "https://via.placeholder.com/150";
const imgAvocadoSandwich1 = "https://via.placeholder.com/150";
const imgAvocadoSandwich2 = "https://via.placeholder.com/150";
const imgAvocadoSandwich3 = "https://via.placeholder.com/150";

// --- Sub-Components ---
const ProductCard = ({ title, price, isVeg, quantity, image }: any) => {
  return (
    <Card className="flex flex-col p-4 w-[220px] shrink-0 hover:shadow-md transition-shadow relative">
      <div className="w-full h-[120px] mb-3 overflow-hidden rounded-xl bg-neutral-100 flex items-center justify-center">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-3 h-3 rounded-full ${isVeg ? 'bg-success' : 'bg-danger'}`} />
        <span className="font-semibold text-neutral-800 line-clamp-1 flex-1">{title}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-primary font-bold">₹{price}</span>
        <Button size="sm" variant={quantity > 0 ? "primary" : "outlinePrimary"} className="h-8 px-3 rounded-lg">
          {quantity > 0 ? `${quantity} Added` : "Add"}
        </Button>
      </div>
    </Card>
  );
};

const OrderItem = ({ image, title, price, quantity, onIncrease, onDecrease, onRemove }: any) => {
  return (
    <div className="bg-white border border-neutral-20 rounded-2xl p-3 flex gap-3 items-center shadow-sm relative">
      <div className="w-[50px] h-[50px] shrink-0 rounded-lg overflow-hidden">
        <img src={image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-sm text-neutral-800 font-semibold">{title}</span>
        <div className="flex items-center gap-3 mt-1">
          <button onClick={onDecrease} className="w-6 h-6 rounded-xl bg-neutral-10 flex items-center justify-center text-xs font-bold text-neutral-60 cursor-pointer hover:bg-neutral-20">-</button>
          <span className="text-sm text-neutral-60 font-semibold">{quantity}</span>
          <button onClick={onIncrease} className="w-6 h-6 rounded-xl bg-neutral-10 flex items-center justify-center text-xs font-bold text-neutral-60 cursor-pointer hover:bg-neutral-20">+</button>
        </div>
      </div>
      <div className="absolute right-3 top-3 flex gap-2">
         <div onClick={onRemove} className="w-5 h-5 flex items-center justify-center cursor-pointer text-neutral-50 hover:text-danger">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
         </div>
      </div>
      <div className="absolute right-3 bottom-3 flex items-start gap-[2px]">
        <small className="text-primary font-bold pb-1">₹</small>
        <span className="text-primary font-semibold">{price}</span>
      </div>
    </div>
  );
};

const OrderPanel = () => {
  const [orderItems, setOrderItems] = useState([
    { id: 1, image: imgAvocadoSandwich1, title: "Chicken Biriyani", price: 120, quantity: 2 },
    { id: 2, image: imgAvocadoSandwich1, title: "Non veg thali", price: 120, quantity: 2 },
  ]);

  const handleIncrease = (id: number) => {
    setOrderItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrease = (id: number) => {
    setOrderItems(prev => prev.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const handleRemove = (id: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = orderItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const tax = totalAmount > 0 ? totalAmount * 0.05 : 0; 
  const finalPrice = totalAmount + tax;

  return (
    <div className="w-[354px] h-[calc(100vh-80px)] bg-white border-l border-neutral-20 flex flex-col relative shrink-0">
      <div className="flex items-center gap-4 px-4 pt-4 shrink-0">
         <Button variant="danger" className="flex-1 py-3 rounded-2xl" onClick={() => setOrderItems([])}>Cancel order</Button>
         <Button variant="primary" className="flex-1 py-3 rounded-2xl">Pause</Button>
      </div>

      <div className="flex-1 overflow-y-auto mt-6 pb-4">
        <div className="px-4">
           <h2 className="text-lg font-semibold text-neutral-80 mb-4">Current order</h2>
           <div className="flex flex-col gap-4">
             {orderItems.map((item) => (
                <OrderItem 
                  key={item.id}
                  {...item}
                  onIncrease={() => handleIncrease(item.id)}
                  onDecrease={() => handleDecrease(item.id)}
                  onRemove={() => handleRemove(item.id)}
                />
             ))}
             {orderItems.length === 0 && (
               <span className="text-sm text-neutral-50 text-center my-4">No items in the order.</span>
             )}
           </div>
        </div>

        <div className="px-4 mt-8">
           <div className="bg-neutral-10 p-3 rounded-xl flex justify-center mb-4">
             <span className="font-semibold text-neutral-80">Payment Summary</span>
           </div>
           <Card shadow={true} padding="p-4" rounded="rounded-2xl" className="flex flex-col gap-3 border border-neutral-20">
             <div className="flex justify-between items-center">
               <span className="text-sm text-neutral-60">Total Amount</span>
               <span className="text-neutral-80 font-bold flex gap-1"><small className="text-primary mt-1">₹</small>{totalAmount.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-neutral-60">Tax (5%)</span>
               <span className="text-neutral-80 font-bold flex gap-1"><small className="text-primary mt-1">₹</small>{tax.toFixed(2)}</span>
             </div>
             <div className="w-full h-px border-t border-dashed border-neutral-30 my-1"></div>
             <div className="flex justify-between items-center">
               <span className="font-semibold text-neutral-80">Total price</span>
               <span className="text-primary font-bold text-lg flex gap-1"><small className="text-primary mt-[2px]">₹</small>{finalPrice.toFixed(2)}</span>
             </div>
           </Card>
        </div>

        <div className="px-4 mt-6 flex flex-col gap-3">
          <Input 
            placeholder="Phone Number" 
            defaultValue="9629917347" 
          />
          <textarea 
            placeholder="Special Instructions...."
            className="w-full h-[100px] border border-neutral-30 rounded-xl p-4 text-sm outline-none resize-none focus:border-primary transition-colors"
          ></textarea>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-3 shrink-0 bg-white border-t border-neutral-20">
        <Button variant="outlinePrimary" className="w-full py-4 rounded-xl">Apply Discount</Button>
        <Button variant="primary" className="w-full py-4 rounded-xl shadow-md">Print Billing</Button>
      </div>
    </div>
  );
};


// --- Main Layout ---
const TenantUserDashboard = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Dishes");

  const categories = [
    { label: "All Dishes" },
    { label: "Veg" },
    { label: "Non Veg" },
    { label: "Desert" },
  ];

  const products = [
    { itemNo: "401", title: "Mutton Gravy", price: "160", isVeg: false, quantity: 3, image: imgAvocadoSandwich },
    { itemNo: "402", title: "Non veg thali", price: "120", isVeg: false, quantity: 0, image: imgAvocadoSandwich1 },
    { itemNo: "203", title: "Veg Thali", price: "160", isVeg: true, quantity: 0, image: imgAvocadoSandwich2 },
    { itemNo: "204", title: "Panner Gravy", price: "160", isVeg: true, quantity: 0, image: imgAvocadoSandwich3 },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory === "Veg") filtered = filtered.filter(p => p.itemNo.startsWith('2'));
    if (activeCategory === "Non Veg") filtered = filtered.filter(p => p.itemNo.startsWith('4'));
    if (activeCategory === "Desert") filtered = filtered.filter(p => p.itemNo.startsWith('5'));

    if (search.trim()) {
      const searchValue = search.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchValue) ||
        product.itemNo.toLowerCase().startsWith(searchValue)
      );
    }
    return filtered;
  }, [search, activeCategory, products]);

  return (
    <div className="flex w-full h-[calc(100vh-80px)] overflow-hidden bg-white -m-6 rounded-tl-3xl border border-neutral-20">
      
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-[769px] mb-8">
          <Input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Item No or Product Name"
          />
        </div>

        <div className="flex gap-3 mb-8">
          {categories.map((cat, index) => (
            <Button
              key={index}
              onClick={() => setActiveCategory(cat.label)}
              variant={activeCategory === cat.label ? "primary" : "secondaryLight"}
              className="rounded-full px-6"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-neutral-80 mb-2">Top 10 Today</h2>
          <div className="flex gap-4 flex-wrap max-w-[800px]">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p, index) => (
                <ProductCard key={index} {...p} />
              ))
            ) : (
              <div className="w-full flex items-center justify-center py-10">
                <span className="text-neutral-50 text-sm">No products found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderPanel />

    </div>
  );
};

export default TenantUserDashboard;
