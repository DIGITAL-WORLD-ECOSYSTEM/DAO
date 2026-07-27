import { EventRepository } from '../../../repositories/event.repository';
import { EmailEventDTO } from '../../../dto/email-event';

export class EmailEventService {
	constructor(private eventRepository: EventRepository) {}

	async emit(event: EmailEventDTO): Promise<void> {
		try {
			await this.eventRepository.append(event);
		} catch (error) {
			// Não travar o fluxo principal se a telemetria/auditoria falhar
			console.error(`[EmailEventService] Failed to emit event ${event.event}:`, error);
		}
	}
}
