
import { useState } from 'react';
import { Activity, walletDB } from '@/utils/database';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = () => {
    try {
      const activityList = walletDB.getActivities(100);
      setActivities(activityList);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  return {
    activities,
    loadActivities
  };
};
