import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId: "69f5fbb6b1f4d064d9cbd657",
  token,
  functionsVersion,
  requiresAuth: false,
  appBaseUrl
});
