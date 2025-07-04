import { ActivityFormValues } from "../../components/ActivityFormModal";
import api from "../../services/api";
import { Activity } from "../../types/trips";
import { createAppThunk } from "../../utils/createAppThunk";

export const fetchActivities = createAppThunk<ActivityFormValues[], string>({
  typePrefix: "activities/fetchActivities",
  payloadCreator: async (tripId) => {
    const res = await api.get(`/trips/${tripId}/activities`);
    return res.data;
  },
  //   showCloseButton: false, // Optional: if you're showing toast notifications
});

export const createActivity = createAppThunk<
  ActivityFormValues,
  { tripId: string; data: Partial<ActivityFormValues> }
>({
  typePrefix: "activities/createActivity",
  payloadCreator: async ({ tripId, data }) => {
    const res = await api.post(`/trips/${tripId}/activities`, data);
    return res.data;
  },
});

export const updateActivity = createAppThunk<
  ActivityFormValues,
  { tripId: string; activityId: string; data: Partial<ActivityFormValues> }
>({
  typePrefix: "activities/updateActivity",
  payloadCreator: async ({ tripId, activityId, data }) => {
    const res = await api.put(
      `/trips/${tripId}/activities/${activityId}`,
      data
    );
    return res.data;
  },
});
