import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';

const AffiliateAgreement = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          PublishJockey Affiliate Program Agreement
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="body1" paragraph>
          This Affiliate Program Agreement ("Agreement") is entered into between PublishJockey ("Company," "we," "us," or "our") 
          and the individual or entity applying to participate in our affiliate program ("Affiliate," "you," or "your").
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          1. Commission Structure
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Commission Rates:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <Typography component="li" variant="body1">
            20% commission during promotional period
          </Typography>
          <Typography component="li" variant="body1">
            15% commission after promotional period
          </Typography>
          <Typography component="li" variant="body1">
            60-day payout delay for fraud prevention
          </Typography>
          <Typography component="li" variant="body1">
            No refunds = guaranteed commissions
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          2. Affiliate Responsibilities
        </Typography>
        <Typography variant="body1" paragraph>
          As an affiliate, you agree to:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <Typography component="li" variant="body1">
            Promote PublishJockey ethically and honestly
          </Typography>
          <Typography component="li" variant="body1">
            Not engage in spam, misleading advertising, or fraudulent activities
          </Typography>
          <Typography component="li" variant="body1">
            Comply with all applicable laws and regulations, including CAN-SPAM Act and GDPR
          </Typography>
                     <Typography component="li" variant="body1">
             Maintain accurate and up-to-date payout information
           </Typography>
           <Typography component="li" variant="body1">
             Be responsible for all taxes on commissions earned
           </Typography>
           <Typography component="li" variant="body1">
             Not use automated tools or bots to generate clicks or conversions
           </Typography>
          <Typography component="li" variant="body1">
            Not engage in cookie stuffing or other fraudulent tracking methods
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          3. Company Responsibilities
        </Typography>
        <Typography variant="body1" paragraph>
          PublishJockey agrees to:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <Typography component="li" variant="body1">
            Track and credit all valid referrals accurately
          </Typography>
          <Typography component="li" variant="body1">
            Process payouts within 60 days of commission approval
          </Typography>
          <Typography component="li" variant="body1">
            Provide marketing materials and support
          </Typography>
          <Typography component="li" variant="body1">
            Maintain program transparency and provide reporting
          </Typography>
          <Typography component="li" variant="body1">
            Protect affiliate data and maintain confidentiality
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          4. Commission Tracking and Payment
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Tracking:</strong> Commissions are tracked through unique affiliate links and codes. 
          We use industry-standard tracking methods to ensure accurate attribution.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Qualifying Sales:</strong> Only completed, non-refunded sales qualify for commission. 
          Trial conversions and upgrades are included in commission calculations.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Payout Schedule:</strong> Commissions are held for 60 days to prevent fraud and chargebacks. 
          Payouts are processed on the 15th of each month for all commissions that are at least 60 days old and exceed $50.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Payment Fees:</strong> Payment processing fees are deducted from commission amounts. 
          Fees vary by payment method: PayPal (2.9% + $0.30), Stripe Connect (0.25% + $0.25), 
          Bank Transfer ($0.80), Zelle ($0.00).
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          5. Termination
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Termination by Either Party:</strong> Either party may terminate this agreement with 30 days written notice.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Immediate Termination:</strong> PublishJockey reserves the right to terminate immediately for:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <Typography component="li" variant="body1">
            Violation of this agreement
          </Typography>
          <Typography component="li" variant="body1">
            Fraudulent or unethical marketing practices
          </Typography>
          <Typography component="li" variant="body1">
            Non-compliance with applicable laws
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          <strong>Outstanding Commissions:</strong> Upon termination, outstanding commissions will be paid according to the standard schedule.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          6. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          PublishJockey grants affiliates a limited, non-exclusive license to use our trademarks, 
          logos, and marketing materials solely for promoting our services. This license terminates 
          with the agreement.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          7. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          PublishJockey shall not be liable for any indirect, incidental, special, or consequential 
          damages arising from this agreement. Our maximum liability is limited to the total amount 
          of commissions earned by the affiliate.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          8. Indemnification
        </Typography>
        <Typography variant="body1" paragraph>
          Affiliates agree to indemnify and hold harmless PublishJockey from any claims, damages, 
          or expenses arising from their marketing activities or violation of this agreement.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          9. Privacy and Data Protection
        </Typography>
        <Typography variant="body1" paragraph>
          Both parties agree to comply with applicable data protection laws. Affiliates must obtain 
          proper consent for any data collection and processing activities.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          10. Governing Law and Disputes
        </Typography>
        <Typography variant="body1" paragraph>
          This agreement is governed by the laws of [Your Jurisdiction]. Any disputes shall be 
          resolved through binding arbitration in accordance with the rules of [Arbitration Organization].
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          11. Modifications
        </Typography>
        <Typography variant="body1" paragraph>
          PublishJockey reserves the right to modify this agreement with 30 days notice. Continued 
          participation after modifications constitutes acceptance of the new terms.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          12. Entire Agreement
        </Typography>
        <Typography variant="body1" paragraph>
          This agreement constitutes the entire understanding between the parties and supersedes 
          all prior agreements or understandings.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body1" paragraph>
          <strong>Contact Information:</strong>
        </Typography>
        <Typography variant="body1" paragraph>
          For questions about this agreement, please contact us at:<br />
          Email: affiliates@publishjockey.com<br />
          Address: [Your Business Address]
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
          By participating in the PublishJockey Affiliate Program, you acknowledge that you have 
          read, understood, and agree to be bound by the terms of this agreement.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AffiliateAgreement;
