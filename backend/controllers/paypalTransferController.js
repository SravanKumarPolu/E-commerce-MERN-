import paypal from '@paypal/checkout-server-sdk';
import orderModel from '../models/orderModel.js';

// PayPal client configuration
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal transfer to specified account
export const createPayPalTransfer = async (req, res) => {
  try {
    const { amount, note, transferType = 'PAYOUT' } = req.body;
    const adminId = req.user?.id;

    console.log('💰 Creating PayPal transfer:', { amount, note, transferType, adminId });

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Validate amount (minimum $0.01 for PayPal)
    if (amount < 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Transfer amount must be at least $0.01'
      });
    }

    // Create PayPal payout request
    const request = new paypal.payouts.PayoutsPostRequest();
    request.requestBody({
      sender_batch_header: {
        sender_batch_id: `batch_${Date.now()}`,
        email_subject: "You have a payment",
        email_message: note || "Payment from your business account"
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount.toFixed(2),
            currency: "USD"
          },
          receiver: "sb-j1ksk43419843@business.example.com", // Target account
          note: note || "Payment transfer",
          sender_item_id: `item_${Date.now()}`
        }
      ]
    });

    console.log('🔄 Executing PayPal payout request...');
    const response = await client.execute(request);
    console.log('✅ PayPal payout response:', JSON.stringify(response.result, null, 2));

    if (response.result.batch_header.payout_batch_id) {
      console.log('🎉 PayPal transfer created successfully');
      console.log('💰 Transfer details:', {
        batchId: response.result.batch_header.payout_batch_id,
        amount: amount,
        status: response.result.batch_header.batch_status,
        recipient: "sb-j1ksk43419843@business.example.com"
      });

      res.json({
        success: true,
        message: 'PayPal transfer created successfully',
        transfer: {
          batchId: response.result.batch_header.payout_batch_id,
          amount: amount,
          status: response.result.batch_header.batch_status,
          recipient: "sb-j1ksk43419843@business.example.com",
          accountNumber: "7597988",
          routingNumber: "YESB0JIVAN2"
        }
      });
    } else {
      console.error('❌ PayPal transfer failed - no batch ID returned');
      res.status(400).json({
        success: false,
        message: 'PayPal transfer failed - no batch ID returned'
      });
    }

  } catch (error) {
    console.error('❌ PayPal transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal transfer',
      error: error.message
    });
  }
};

// Get transfer history
export const getTransferHistory = async (req, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    // Mock transfer history for now
    const transferHistory = [
      {
        id: 'transfer_1',
        batchId: 'batch_123456789',
        amount: 100.00,
        currency: 'USD',
        recipientEmail: 'sb-j1ksk43419843@business.example.com',
        recipientAccountNumber: '7597988',
        recipientRoutingNumber: 'YESB0JIVAN2',
        status: 'SUCCESS',
        note: 'Payment transfer',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        adminId
      }
    ];

    res.json({
      success: true,
      data: {
        transfers: transferHistory,
        summary: {
          totalTransfers: transferHistory.length,
          totalAmount: transferHistory.reduce((sum, t) => sum + t.amount, 0),
          averageAmount: transferHistory.length > 0 ? transferHistory.reduce((sum, t) => sum + t.amount, 0) / transferHistory.length : 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting transfer history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transfer history',
      error: error.message
    });
  }
};

// Get transfer status
export const getTransferStatus = async (req, res) => {
  try {
    const { batchId } = req.params;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }

    if (!batchId) {
      return res.status(400).json({
        success: false,
        message: 'Batch ID is required'
      });
    }

    // Get PayPal payout status
    const request = new paypal.payouts.PayoutsGetRequest(batchId);
    const response = await client.execute(request);

    console.log('✅ Transfer status response:', JSON.stringify(response.result, null, 2));

    res.json({
      success: true,
      data: {
        batchId: response.result.batch_header.payout_batch_id,
        status: response.result.batch_header.batch_status,
        amount: response.result.batch_header.amount?.value,
        currency: response.result.batch_header.amount?.currency,
        createdAt: response.result.batch_header.time_created,
        completedAt: response.result.batch_header.time_completed
      }
    });

  } catch (error) {
    console.error('❌ Error getting transfer status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transfer status',
      error: error.message
    });
  }
}; 