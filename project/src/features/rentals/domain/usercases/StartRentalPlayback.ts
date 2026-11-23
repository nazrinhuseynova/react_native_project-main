import type { Rental } from '../entities/Rental';
import { RentalWindowPolicy } from '../policies/RentalWindowPolicy';
import type { RentalRepository } from '../repositories/RentalRepository';

export interface StartRentalPlaybackInput {
  userId: string;
  titleId: string;
  now?: Date;
}

export class StartRentalPlayback {
  constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly windowPolicy: RentalWindowPolicy = new RentalWindowPolicy(),
  ) {}

  async execute(input: StartRentalPlaybackInput): Promise<Rental | null> {
    const now = input.now ?? new Date();
    const rental = await this.rentalRepository.getByUserAndTitle(
      input.userId,
      input.titleId,
    );

    if (!rental) {
      return null;
    }

    const evaluation = this.windowPolicy.evaluate(rental, now);
    if (!evaluation.canWatch) {
      return rental;
    }


    if (!rental.firstPlayAt) {
      return this.rentalRepository.markFirstPlay(rental.id, now.toISOString());
    }

    return rental;
  }
}