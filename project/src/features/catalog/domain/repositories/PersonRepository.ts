import type { Person } from '../entities/Person';
import type { Title } from '../entities/Title';

export interface PersonRepository {
  details(personId: number): Promise<Person>;
  credits(personId: number): Promise<Title[]>;
}