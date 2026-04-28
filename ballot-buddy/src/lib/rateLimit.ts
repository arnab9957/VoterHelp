export const rateLimitMap = new Map();

export function checkRateLimit(identifier: string, limit: number = 20, windowMs: number = 60000) {
  const now = Date.now();
  const windowData = rateLimitMap.get(identifier) || { count: 0, startTime: now };
  
  if (now - windowData.startTime > windowMs) {
    windowData.count = 1;
    windowData.startTime = now;
  } else {
    windowData.count++;
  }
  
  rateLimitMap.set(identifier, windowData);
  return windowData.count <= limit;
}
