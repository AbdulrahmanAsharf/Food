export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-red-600">Payment Cancelled</h1>
      <p className="mt-4 text-gray-600">You have cancelled the payment. No charges were made.</p>
    </div>
  );
}
