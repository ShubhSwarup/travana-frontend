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
