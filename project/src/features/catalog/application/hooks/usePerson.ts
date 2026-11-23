import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import type { Title } from '../../domain/entities/Title';
import { catalogKeys } from '../catalogKeys';

const EMPTY: Title[] = [];

export function usePerson(personId: number | null) {
  const { catalog } = useServices();
  const { i18n } = useTranslation();
  const enabled = personId !== null;
  const id = personId ?? 0;

  const person = useQuery({
    queryKey: catalogKeys.person(id, i18n.language),
    queryFn: () => catalog.people.details(id),
    enabled,
  });

  const credits = useQuery({
    queryKey: catalogKeys.personCredits(id, i18n.language),
    queryFn: () => catalog.people.credits(id),
    enabled,
  });

  const { refetch: refetchPerson } = person;
  const { refetch: refetchCredits } = credits;
  const refetch = useCallback(
    () => Promise.all([refetchPerson(), refetchCredits()]),
    [refetchPerson, refetchCredits],
  );

  return {
    person: person.data,
    credits: credits.data ?? EMPTY,
    isLoading: person.isLoading,
    isLoadingCredits: credits.isLoading,
    isError: person.isError,
    refetch,
  };
}