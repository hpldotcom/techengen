import prisma from '../config/prisma.js';

export const placeOrder = async (req, res) => {
  try {
    const { items, shippingDetails, phone, city } = req.body; // items: [{ productId, quantity }]
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let totalPrice = 0;
    const orderItemsData = [];

    // Begin transaction for safety
    const result = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Reduce stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        });

        const itemTotal = Number(product.price) * item.quantity;
        totalPrice += itemTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price
        });
      }

      // Create order
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          totalPrice,
          shippingDetails,
          phone,
          city,
          orderItems: {
            create: orderItemsData
          }
        },
        include: { orderItems: true }
      });

      return order;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
