import prisma from '../config/prisma.js';

export const fakePay = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find order
    const order = await prisma.order.findUnique({
      where: {
        id: Number(orderId),
      },
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Check if already paid
    const existingPayment = await prisma.payment.findUnique({
      where: {
        orderId: Number(orderId),
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        message: 'Order already paid',
      });
    }

    // Create fake payment
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalPrice,
        method: 'FAKE_CARD',
        status: 'PAID',
        transactionId: `FAKE-${Date.now()}`,
        paidAt: new Date(),
      },
    });

    return res.status(201).json({
      message: 'Payment successful',
      payment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};