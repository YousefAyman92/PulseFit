const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const startSubscriptionChecker = () => {
    cron.schedule('* * * * *', async () => { // Running every minute
        try {
            const today = new Date();

            //Find expired plans
            const expiredSubs = await Subscription.find({
                status: "active",
                endDate: { $lt: today }
            });

            if (expiredSubs.length > 0) {
                //Get User IDs from these subscriptions
                const userIds = [...new Set(expiredSubs.map(sub => sub.userId))];

                //Cancel the subscriptions
                await Subscription.updateMany(
                    { _id: { $in: expiredSubs.map(s => s._id) } },
                    { $set: { status: "cancelled" } }
                );

                //Flag the users so they get a message when entering account
                await User.updateMany(
                    { _id: { $in: userIds } },
                    { $set: { needsExpiryToast: true } }
                );
            }
        } catch (err) {
            console.error('Checker Error:', err);
        }
    });
};

module.exports = startSubscriptionChecker;