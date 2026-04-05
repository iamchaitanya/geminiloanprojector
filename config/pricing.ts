// config/pricing.ts

export const PRICING_CONFIG = {
    baseRatePerLakh: 100, // ₹100 per Lakh
    gstRate: 0.18,        // 18% GST
    currency: "INR",
    
    /**
     * Calculates the exact breakdown for the Razorpay order and the UI receipt.
     * @param loanAmount The total loan amount in Rupees (e.g., 500000 for 5 Lakhs)
     */
    calculateTotal: (loanAmount: number) => {
      if (loanAmount <= 0) return { lakhs: 0, baseAmount: 0, gstAmount: 0, totalAmount: 0, razorpayPaise: 0 };
  
      const lakhs = loanAmount / 100000;
      const baseAmount = lakhs * PRICING_CONFIG.baseRatePerLakh;
      const gstAmount = baseAmount * PRICING_CONFIG.gstRate;
      const totalAmount = baseAmount + gstAmount;
      
      return {
        lakhs,
        baseAmount,
        gstAmount,
        totalAmount,
        razorpayPaise: Math.round(totalAmount * 100), 
      };
    }
  };