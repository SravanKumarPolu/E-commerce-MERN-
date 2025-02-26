import Title from "./Title";
import { useShopContext } from "../context/ShopContext"

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useShopContext();
  return (
    <div className='w-full '>
      <div className='text-xl'>
        <Title text1={'CART'} text2={'TOTAL'} />
      </div>
      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>SubTotal</p>
          <p>{currency}{getCartAmount()}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p> Shipping fee</p>
          <p>{currency} {delivery_fee}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>
            {currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
          </b>
        </div>

      </div>

    </div>
  )
}

export default CartTotal