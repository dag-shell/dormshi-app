// tgcloud/endpoints/wallet_get.js
// Fetch caller's wallet balances.
// Call as: Telegram.WebApp.Serverless.call('wallet_get', ...)
import { requireUser } from '../lib/auth.js';

export default async function (input = {}, ctx) {
  const user = await requireUser(ctx);

  return {
    mainBalance: user.mainBalance,
    rewardBalance: user.rewardBalance,
    escrowBalance: user.escrowBalance,
  };
}
