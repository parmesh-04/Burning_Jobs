import { Metadata } from 'next'
import MyOrders from './MyOrders'

export const metadata: Metadata = {
  title: 'Order History',
}
export default function OrderHistory() {
  return (
    <>
      <h1 className="text-sm md:text-2xl py-2 text-center font-bold text-[#4F4A45]">
        Order History
      </h1>
      <MyOrders />
    </>
  )
}
