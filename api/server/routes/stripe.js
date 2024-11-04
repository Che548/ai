const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { logger } = require('~/config');
const { upgradeSubscription, handleSubscriptionUpdated } = require('../services/SubscriptionService');

router.post('/upgrade', async (req, res) => {
  const { userId, priceId } = req.body;

  try {
    const session = await upgradeSubscription(userId, priceId);
    res.json({ sessionId: session.id });
  } catch (error) {
    logger.error('[/upgrade] Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    logger.error('[webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await handleSubscriptionUpdated({
          ...subscription,
          metadata: {
            userId: session.client_reference_id,
          },
        });
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionUpdated({
          ...event.data.object,
          status: 'canceled',
        });
        break;

      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('[webhook] Error processing event:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

module.exports = router;