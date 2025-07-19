// Generate static params for static export
export async function generateStaticParams() {
  // Return empty array - dynamic routes will be handled at runtime
  return [];
}

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
