import { auth } from "@clerk/nextjs";
import { db } from "./db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return false;
  }

  const orgSuscription = await db.orgSubscription.findUnique({
    where: {
      orgId,
    },
    select: {
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
    },
  });

  if (!orgSuscription) {
    return false;
  }

  const isValid =
    orgSuscription.stripePriceId &&
    orgSuscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
