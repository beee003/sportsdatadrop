// Stripe configuration
// Replace with your actual Stripe Payment Link or integrate Stripe Checkout
export const STRIPE_CHECKOUT_BASE = "https://checkout.stripe.com/pay/";

// Example: If you have a Stripe Payment Link, you can use it like:
// export const getCheckoutUrl = (videoId: string, price: number) => {
//   return `YOUR_STRIPE_PAYMENT_LINK?client_reference_id=${videoId}`;
// };

// For MVP: Use a simple placeholder that links to Stripe Payment Links
export const getCheckoutUrl = (videoId: string, price: number) => {
  // Replace with your actual Stripe Payment Link
  return `https://buy.stripe.com/your-payment-link?client_reference_id=${videoId}`;
};
