import type { TitleCredits } from '../../../domain/entities/CastMember';
import type { Person } from '../../../domain/entities/Person';
import type { TmdbPersonDto } from '../dto/TmdbCommonDto';
import type { TmdbCreditsDto } from '../dto/TmdbCreditsDto';
import type { TmdbImageUrlBuilder } from '../TmdbImageUrlBuilder';

export function mapCredits(dto: TmdbCreditsDto, images: TmdbImageUrlBuilder): TitleCredits {
  return {
    cast: (dto.cast ?? []).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character ?? '',
      order: member.order,
      profile: images.profile(member.profile_path),
    })),
    crew: (dto.crew ?? []).map((member) => ({
      id: member.id,
      name: member.name,
      job: member.job,
      department: member.department,
      profile: images.profile(member.profile_path),
    })),
  };
}

export function mapPerson(dto: TmdbPersonDto, images: TmdbImageUrlBuilder): Person {
  return {
    id: dto.id,
    name: dto.name,
    biography: dto.biography ?? '',
    birthday: dto.birthday || null,
    deathday: dto.deathday || null,
    placeOfBirth: dto.place_of_birth || null,
    knownForDepartment: dto.known_for_department || null,
    profile: images.profile(dto.profile_path),
  };
}