import EventRepo, {
  TEvents,
} from "../modules/implementation/event.implementation";
import { TGroup } from "../modules/implementation/group.implementation";

class EventService {
  private event_repo: EventRepo;

  constructor() {
    this.event_repo = new EventRepo();
  }

  async addANewEvent(payload: Partial<TEvents>): Promise<void> {
    try {
      const createEvent = await this.event_repo.createAnEvent(payload);
      return;
    } catch (error) {
      throw error;
    }
  }

  async getAllEventsInGroup(group_id: TGroup["_id"]): Promise<TEvents[]> {
    try {
      const data = await this.event_repo.getAllEvents(group_id);

      const events = data.filter((event) => {
        return event.completed != false;
      });

      return events;
    } catch (error) {
      throw error;
    }
  }

  async getAnEventInGroup(event_id: TEvents["_id"]): Promise<TEvents> {
    try {
      const data = await this.event_repo.getEventById(event_id);
      return data;
    } catch (error) {
      throw error;
      {
      }
    }
  }

  async completeAnEvent(event_id: TEvents["_id"]): Promise<void> {
    try {
      await this.event_repo.updateAnEvent(event_id, { completed: true });
      return;
    } catch (error) {
      throw error;
    }
  }
}
