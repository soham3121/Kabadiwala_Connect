const STORAGE_KEY = 'kabadi_offline_queue';

export const getOfflineLots = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading offline storage:', err);
    return [];
  }
};

export const saveOfflineLot = (lot) => {
  try {
    const current = getOfflineLots();
    const updated = [lot, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving to offline storage:', err);
    return [];
  }
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const syncOfflineQueue = async () => {
  const queue = getOfflineLots();
  if (queue.length === 0) return { success: true, count: 0 };

  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offlineQueue: queue })
    });
    const result = await response.json();
    if (result.success) {
      clearOfflineQueue();
      return { success: true, count: result.syncedCount };
    }
    return { success: false, error: 'Server rejected sync' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
